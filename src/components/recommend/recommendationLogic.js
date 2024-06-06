import { scoringConfig, primaryProfiles, secondaryProfiles, getSizeIndex } from './config';

const calculateScore = (criteria, modelCriteria, config) => {
  let score = 10;

  Object.keys(config).forEach(key => {
    if (modelCriteria[key] !== undefined) {
      if (config[key].isSizeDependent) {
        const criteriaIndex = getSizeIndex(criteria[key]);
        const modelCriteriaIndex = getSizeIndex(modelCriteria[key]);
        if (criteriaIndex > modelCriteriaIndex) { // Penalize if criteria size is larger
          score -= config[key].mismatchPenalty;
        }
      } else if (modelCriteria[key] !== criteria[key]) {
        score -= config[key].mismatchPenalty;
      }
    }
  });

  return Math.max(score, 0);
};

const combineSecondaryProfiles = (criteria, primaryProfileName, secondaryProfiles, config) => {
  const validCombinations = [];
  const secondaryCount = secondaryProfiles.length;

  // Generate all combinations of secondary profiles
  for (let i = 1; i < (1 << secondaryCount); i++) {
    let combinedCriteria = {};
    let combinedScore = 0;
    let names = [];

    for (let j = 0; j < secondaryCount; j++) {
      if (i & (1 << j)) {
        const profile = secondaryProfiles[j];
        if (profile.allowedPrimaryProfiles.includes(primaryProfileName)) {
          combinedCriteria = { ...combinedCriteria, ...profile.criteria };
          combinedScore += calculateScore(criteria, profile.criteria, config);
          names.push(profile.name);
        }
      }
    }

    if (names.length > 0) {
      validCombinations.push({
        name: names.join(" and "),
        score: combinedScore
      });
    }
  }

  return validCombinations;
};

export const recommendNetworkModel = (criteria) => {
  const primaryResults = primaryProfiles.flatMap(profile => {
    const subModelResults = profile.subModels.map(subModel => {
      const combinedCriteria = { ...profile.criteria, ...subModel.criteria };
      const score = calculateScore(criteria, combinedCriteria, scoringConfig);
      return {
        name: `${profile.name} - ${subModel.name}`,
        score
      };
    }).filter(result => result.score > 0);

    // If profile has no subModels, treat the profile itself as a subModel
    if (subModelResults.length === 0) {
      const profileResult = {
        name: profile.name,
        score: calculateScore(criteria, profile.criteria, scoringConfig)
      };
      if (profileResult.score > 0) {
        return [profileResult];
      }
    }

    return subModelResults;
  });

  const combinedResults = primaryResults.flatMap(primary => {
    const secondaryCombinations = combineSecondaryProfiles(criteria, primary.name.split(' - ')[0], secondaryProfiles, scoringConfig);
    return secondaryCombinations.map(secondary => {
      return {
        name: `${primary.name} with ${secondary.name}`,
        score: primary.score + secondary.score
      };
    });
  });

  return combinedResults.sort((a, b) => b.score - a.score);
};
