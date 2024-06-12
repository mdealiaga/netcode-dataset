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

  console.log('scoring', modelName);
  console.log('criteria', criteria);
  console.log('model criteria', modelCriteria);
  console.log('penalties', penalties);
  console.log('score', score);
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

  const combineWithSecondaryProfiles = (currentCombination, index) => {
    if (index === secondaryProfiles.length) {
      if (currentCombination.length > 0) {
        let combinedCriteria = { ...primary.combinedCriteria };
        let combinedName = primary.name;

        currentCombination.forEach(secondary => {
          combinedCriteria = combineCriteria(combinedCriteria, secondary.criteria);
          combinedName += ` with ${secondary.name}`;
        });

        validCombinations.push({ name: combinedName, combinedCriteria });
      }
      return;
    }

    // Recurse with the current secondary profile included
    if (secondaryProfiles[index].allowedSubModels.includes(primary.name.split(' - ')[1])) {
      combineWithSecondaryProfiles([...currentCombination, secondaryProfiles[index]], index + 1);
    }

    // Recurse without the current secondary profile
    combineWithSecondaryProfiles(currentCombination, index + 1);
  };

  // Start recursion with an empty combination
  combineWithSecondaryProfiles([], 0);

  return validCombinations;
};

const recommendNetworkModel = (criteria) => {
  const adjustedCriteria = {
    ...criteria,
    combatOption: criteria.playerInteractionLevel !== "Combat" ? '' : criteria.combatOption
  };

  const primaryResults = primaryProfiles.flatMap(profile => {
    const subModelResults = profile.subModels.map(subModel => {
      const combinedCriteria = combineCriteria(profile.criteria, subModel.criteria);
      console.log(`combined criteria for ${profile.name} - ${subModel.name}`, combinedCriteria)
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

export { recommendNetworkModel };
