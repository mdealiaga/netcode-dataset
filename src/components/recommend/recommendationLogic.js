import { scoringConfig, networkProfiles, networkAlgorithms, criteriaCombinationConfig } from './config';

const mapCombatValue = (combatValue) => {
  const mapping = {
    "No Interaction Between Players": "None",
    "Collision Between Players": "Collision",
    "Basic Combat": "CombatNormal",
    "Instant Hit Detection": "CombatInstant",
    "Responsive Combat": "CombatResponsive"
  };

  return mapping[combatValue] || "None"; // Default to "None" if no match found
};

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
    const combinationMethod = criteriaCombinationConfig[key] || criteriaCombinationConfig.default;

    if (combinationMethod === 'intersection') {
      if (Array.isArray(primaryCriteria[key]) && Array.isArray(secondaryCriteria[key])) {
        combinedCriteria[key] = primaryCriteria[key].filter(value => secondaryCriteria[key].includes(value));
      } else if (primaryCriteria[key] === secondaryCriteria[key]) {
        combinedCriteria[key] = primaryCriteria[key];
      } else {
        combinedCriteria[key] = []; // No intersection
      }
    } else if (combinationMethod === 'union') {
      if (Array.isArray(primaryCriteria[key]) && Array.isArray(secondaryCriteria[key])) {
        combinedCriteria[key] = [...new Set([...(primaryCriteria[key] || []), ...(secondaryCriteria[key] || [])])];
      } else if (Array.isArray(primaryCriteria[key])) {
        combinedCriteria[key] = [...new Set([...(primaryCriteria[key] || []), secondaryCriteria[key]])];
      } else if (Array.isArray(secondaryCriteria[key])) {
        combinedCriteria[key] = [...new Set([primaryCriteria[key], ...(secondaryCriteria[key] || [])])];
      } else {
        combinedCriteria[key] = secondaryCriteria[key];
      }
    }
  });

  return combinedCriteria;
};

const generateSecondaryCombinations = (primary) => {
  const validCombinations = [];
  const secondaryNames = [];

  networkAlgorithms.forEach(secondary => {
    if (
      secondary.allowedNetworkProfiles.includes(primary.name)
    ) {
      const combinedCriteria = combineCriteria(primary.combinedCriteria, secondary.criteria);
      secondaryNames.push(secondary.name);
      validCombinations.push({ name: `${primary.name} with ${secondary.name}`, combinedCriteria, networkProfile: primary.name, networkAlgorithms: [secondary.name] });
    }
  });

  // Add the primary model without any secondary profiles
  validCombinations.push({ name: primary.name, combinedCriteria: primary.combinedCriteria, networkProfile: primary.name, networkAlgorithms: [] });

  // Create a single combined secondary profile string
  if (secondaryNames.length > 0) {
    const combinedSecondaryName = `${primary.name} with ${secondaryNames.join(' and ')}`;
    validCombinations.push({ name: combinedSecondaryName, combinedCriteria: primary.combinedCriteria, networkProfile: primary.name, networkAlgorithms: secondaryNames });
  }

  return validCombinations;
};

export const recommendNetworkModel = (criteria) => {
  const adjustedCriteria = criteria;

  const primaryResults = networkProfiles.map(profile => {
    const combinedCriteria = combineCriteria(profile.criteria, profile.criteria);
    return {
      name: profile.name,
      combinedCriteria,
      recommendLibraryIfSmallTeam: profile.recommendLibraryIfSmallTeam,
      networkProfile: profile.name,
      networkAlgorithms: []
    };
  });

  console.log('primary results', primaryResults)
  const combinedResults = new Map();

  primaryResults.forEach(primary => {
    const secondaryCombinations = generateSecondaryCombinations(primary);
    secondaryCombinations.forEach(({ name, combinedCriteria, networkProfile, networkAlgorithms }) => {
      const { score, penalties } = calculateScore(adjustedCriteria, combinedCriteria, scoringConfig, name);
      if (!combinedResults.has(name) || combinedResults.get(name).score < score) {
        combinedResults.set(name, { score, penalties, networkProfile, networkAlgorithms, combinedCriteria });
      }
    });

    const { score, penalties } = calculateScore(adjustedCriteria, primary.combinedCriteria, scoringConfig, primary.name);
    if (!combinedResults.has(primary.name) || combinedResults.get(primary.name).score < score) {
      combinedResults.set(primary.name, { score, penalties, networkProfile: primary.name, networkAlgorithms: [] });
    }
  });

  console.log('combined results', combinedResults)
  return Array.from(combinedResults.entries()).map(([name, result]) => ({
    name,
    score: Math.min(result.score, 100),
    penalties: result.penalties,
    networkProfile: result.networkProfile,
    networkAlgorithms: result.networkAlgorithms
  })).sort((a, b) => b.score - a.score);
};
