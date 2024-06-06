import { scoringConfig, profiles, getSizeIndex } from './config';

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

export const recommendNetworkModel = (criteria) => {

  const results = profiles.flatMap(profile => {
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

  const sortedResults = results.sort((a, b) => b.score - a.score);
  return sortedResults;
};
