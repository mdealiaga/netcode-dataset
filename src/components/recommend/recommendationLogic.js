import { scoringConfig, primaryProfiles, secondaryProfiles } from './config';

const calculateScore = (criteria, modelCriteria, config, modelName) => {
  let score = 100;
  const penalties = [];

  Object.keys(config).forEach(key => {
    if (modelCriteria[key] !== undefined) {
      if (Array.isArray(modelCriteria[key])) {
        if (!modelCriteria[key].includes(criteria[key])) {
          penalties.push(`${key}: ${config[key].mismatchPenalty}`);
          score -= config[key].mismatchPenalty;
        }
      } else if (modelCriteria[key] !== criteria[key]) {
        penalties.push(`${key}: ${config[key].mismatchPenalty}`);
        score -= config[key].mismatchPenalty;
      }
    }
  });

  console.log(`Final score for ${modelName}: ${score} (Penalties applied: ${penalties.join(', ')})`);
  return Math.max(score, 0);
};

const combineSecondaryProfiles = (criteria, primaryProfileName, secondaryProfiles, config) => {
  const validCombinations = new Map();
  const secondaryCount = secondaryProfiles.length;

  // Generate all combinations of secondary profiles
  for (let i = 1; i < (1 << secondaryCount); i++) {
    let combinedCriteria = {};
    let combinedScore = 100; // Start with the max score for secondary profiles
    let names = [];

    for (let j = 0; j < secondaryCount; j++) {
      if (i & (1 << j)) {
        const profile = secondaryProfiles[j];
        if (profile.allowedPrimaryProfiles.includes(primaryProfileName)) {
          combinedCriteria = { ...combinedCriteria, ...profile.criteria };
          combinedScore = Math.min(combinedScore, calculateScore(criteria, profile.criteria, config, profile.name));
          names.push(profile.name);
        }
      }
    }

    if (names.length > 0) {
      validCombinations.set(names.join(" and "), combinedScore);
    }
  }

  return Array.from(validCombinations.entries()).map(([name, score]) => ({ name, score }));
};

export const recommendNetworkModel = (criteria) => {
  const primaryResults = primaryProfiles.flatMap(profile => {
    const subModelResults = profile.subModels.map(subModel => {
      const combinedCriteria = { ...profile.criteria, ...subModel.criteria };
      const score = calculateScore(criteria, combinedCriteria, scoringConfig, `${profile.name} - ${subModel.name}`);
      return {
        name: `${profile.name} - ${subModel.name}`,
        score,
        recommendLibraryIfSmallTeam: subModel.recommendLibraryIfSmallTeam
      };
    }).filter(result => result.score > 0);

    // If profile has no subModels, treat the profile itself as a subModel
    if (subModelResults.length === 0) {
      const profileResult = {
        name: profile.name,
        score: calculateScore(criteria, profile.criteria, scoringConfig, profile.name),
        recommendLibraryIfSmallTeam: profile.recommendLibraryIfSmallTeam
      };
      if (profileResult.score > 0) {
        return [profileResult];
      }
    }

    return subModelResults;
  });

  const combinedResults = new Map();

  primaryResults.forEach(primary => {
    if (criteria.devTeamSize === "Small" && !primary.recommendLibraryIfSmallTeam) {
      // Only add the primary profile without third-party libraries if the team is small and no third-party library is recommended
      const primaryName = `${primary.name}`;
      if (!combinedResults.has(primaryName) || combinedResults.get(primaryName) < primary.score) {
        combinedResults.set(primaryName, primary.score);
      }
    } else {
      // Combine with secondary profiles
      const secondaryCombinations = combineSecondaryProfiles(criteria, primary.name.split(' - ')[0], secondaryProfiles, scoringConfig);
      secondaryCombinations.forEach(secondary => {
        const combinedName = `${primary.name} with ${secondary.name}`;
        const combinedScore = primary.score + secondary.score - 100; // Adjust the combination logic to properly account for the secondary score
        if (!combinedResults.has(combinedName) || combinedResults.get(combinedName) < combinedScore) {
          combinedResults.set(combinedName, combinedScore);
        }
      });
    }
  });

  // Convert the Map to an array and ensure score doesn't exceed 100
  return Array.from(combinedResults.entries()).map(([name, score]) => ({
    name,
    score: Math.min(score, 100)
  })).sort((a, b) => b.score - a.score);
};
