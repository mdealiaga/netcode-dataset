import { scoringConfig, primaryProfiles, secondaryProfiles } from './config';

const calculateScore = (criteria, modelCriteria, config, modelName) => {
  let score = 100;
  const penalties = [];

  Object.keys(config).forEach(key => {
    if (modelCriteria[key] !== undefined) {
      if (Array.isArray(modelCriteria[key])) {
        if (!modelCriteria[key].includes(criteria[key])) {
          penalties.push({ key, penalty: config[key].mismatchPenalty, reason: `${key}: ${config[key].mismatchPenalty}` });
          score -= config[key].mismatchPenalty;
        }
      } else if (modelCriteria[key] !== criteria[key]) {
        penalties.push({ key, penalty: config[key].mismatchPenalty, reason: `${key}: ${config[key].mismatchPenalty}` });
        score -= config[key].mismatchPenalty;
      }
    } else {
      penalties.push({ key, penalty: config[key].mismatchPenalty, reason: `${key}: ${config[key].mismatchPenalty}` });
      score -= config[key].mismatchPenalty;
    }
  });

  return { score: Math.max(score, 0), penalties };
};

const combineCriteria = (primaryCriteria, secondaryCriteria) => {
  const combinedCriteria = { ...primaryCriteria };

  Object.keys(secondaryCriteria).forEach(key => {
    if (Array.isArray(secondaryCriteria[key]) || Array.isArray(primaryCriteria[key])) {
      combinedCriteria[key] = [...new Set([...(primaryCriteria[key] || []), ...(secondaryCriteria[key] || [])])];
    } else {
      combinedCriteria[key] = secondaryCriteria[key];
    }
  });

  return combinedCriteria;
};

const generateSecondaryCombinations = (primary) => {
  const validCombinations = [];
  const secondaryNames = [];

  secondaryProfiles.forEach(secondary => {
    const [primaryProfile, subModel] = primary.name.includes(' - ') 
      ? primary.name.split(' - ') 
      : [primary.name, ''];

    console.log('Checking combination:', { primaryProfile, subModel, secondary });

    if (
      secondary.allowedPrimaryProfiles && secondary.allowedPrimaryProfiles.includes(primaryProfile) &&
      (!subModel || secondary.allowedSubModels.includes(subModel))
    ) {
      const combinedCriteria = combineCriteria(primary.combinedCriteria, secondary.criteria);
      secondaryNames.push(secondary.name);
      validCombinations.push({ name: `${primary.name} with ${secondary.name}`, combinedCriteria });
    }
  });

  // Add the primary model without any secondary profiles
  validCombinations.push({ name: primary.name, combinedCriteria: primary.combinedCriteria });

  // Create a single combined secondary profile string
  if (secondaryNames.length > 0) {
    const combinedSecondaryName = `${primary.name} with ${secondaryNames.join(' and ')}`;
    validCombinations.push({ name: combinedSecondaryName, combinedCriteria: primary.combinedCriteria });
  }

  return validCombinations;
};

export const recommendNetworkModel = (criteria) => {
  const adjustedCriteria = {
    ...criteria,
    combatOption: criteria.playerInteractionLevel !== "Combat" ? '' : criteria.combatOption
  };

  const primaryResults = primaryProfiles.flatMap(profile => {
    const subModelResults = profile.subModels.map(subModel => {
      const combinedCriteria = combineCriteria(profile.criteria, subModel.criteria);
      return {
        name: `${profile.name} - ${subModel.name}`,
        combinedCriteria,
        recommendLibraryIfSmallTeam: subModel.recommendLibraryIfSmallTeam
      };
    });

    if (subModelResults.length === 0) {
      const combinedCriteria = profile.criteria;
      return [{
        name: profile.name,
        combinedCriteria,
        recommendLibraryIfSmallTeam: profile.recommendLibraryIfSmallTeam
      }];
    }

    return subModelResults;
  });

  const combinedResults = new Map();

  primaryResults.forEach(primary => {
    const secondaryCombinations = generateSecondaryCombinations(primary);
    secondaryCombinations.forEach(({ name, combinedCriteria }) => {
      const { score, penalties } = calculateScore(adjustedCriteria, combinedCriteria, scoringConfig, name);
      if (!combinedResults.has(name) || combinedResults.get(name).score < score) {
        combinedResults.set(name, { score, penalties });
      }
    });

    const { score, penalties } = calculateScore(adjustedCriteria, primary.combinedCriteria, scoringConfig, primary.name);
    if (!combinedResults.has(primary.name) || combinedResults.get(primary.name).score < score) {
      combinedResults.set(primary.name, { score, penalties });
    }
  });

  return Array.from(combinedResults.entries()).map(([name, result]) => ({
    name,
    score: Math.min(result.score, 100),
    penalties: result.penalties
  })).sort((a, b) => b.score - a.score);
};
