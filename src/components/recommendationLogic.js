export const recommendNetworkModel = ({ lobbySize, gameType, onlineEconomy, devTeamSize, manyEntities, instantHit, responsiveCombat }) => {
  const profiles = [
    {
      name: "Client-Server",
      subModels: [
        { name: "Relay", criteria: { lobbySize: "Small", gameType: "Competitive", responsiveCombat: true } },
        { name: "Full-Auth", criteria: { gameType: "Competitive", onlineEconomy: true }},
        { name: "Hybrid", criteria: { gameType: "Competitive", onlineEconomy: true } },
        { name: "Server Side Rewind", criteria: { instantHit: true }}
      ],
      criteria: { lobbySize: "Small", manyEntities: false }
    },
    {
      name: "P2P",
      subModels: [
        { name: "Deterministic Lockstep", criteria: { manyEntities: true } },
        { name: "Rollback", criteria: { responsiveCombat: true } }
      ],
      criteria: { lobbySize: "Small" }
    },
    { name: "Arbitrer (Photon Quantum)", criteria: { devTeamSize: "Small" } }
  ];

  const calculateScore = (criteria, modelCriteria) => {
    let score = 10;

    if (modelCriteria.lobbySize && modelCriteria.lobbySize !== criteria.lobbySize) score -= 2;
    if (modelCriteria.gameType && modelCriteria.gameType !== criteria.gameType) score -= 2;
    if (modelCriteria.onlineEconomy !== undefined && modelCriteria.onlineEconomy !== criteria.onlineEconomy) score -= 5;
    if (modelCriteria.devTeamSize && modelCriteria.devTeamSize !== criteria.devTeamSize) score -= 2;
    if (modelCriteria.manyEntities !== undefined && modelCriteria.manyEntities !== criteria.manyEntities) score -= 2;
    if (modelCriteria.instantHit !== undefined && modelCriteria.instantHit !== criteria.instantHit) score -= 2;
    if (modelCriteria.responsiveCombat !== undefined && modelCriteria.responsiveCombat !== criteria.responsiveCombat) score -= 5;

    return Math.max(score, 0);
  };

  const results = profiles.flatMap(profile => {
    const profileScore = calculateScore({ lobbySize, gameType, onlineEconomy, devTeamSize, manyEntities, instantHit, responsiveCombat }, profile.criteria);
    const subModelResults = profile.subModels
      ? profile.subModels.map(subModel => ({
          name: `${profile.name} - ${subModel.name}`,
          score: profileScore + calculateScore({ lobbySize, gameType, onlineEconomy, devTeamSize, manyEntities, instantHit, responsiveCombat }, subModel.criteria)
        })).filter(result => result.score > 0)
      : [];

    return [{ name: profile.name, score: profileScore }, ...subModelResults];
  });

  return results.sort((a, b) => b.score - a.score).filter(result => result.score > 0);
};
