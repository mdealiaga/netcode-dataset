const sizeOrder = ["Small", "Medium", "Large"];

export const scoringConfig = {
  lobbySize: { mismatchPenalty: 5, isSizeDependent: true },
  gameType: { mismatchPenalty: 2 },
  onlineEconomy: { mismatchPenalty: 5 },
  devTeamSize: { mismatchPenalty: 2, isSizeDependent: true },
  manyEntities: { mismatchPenalty: 2 },
  combatOption: { mismatchPenalty: 2 },
  playerInteractionLevel: { mismatchPenalty: 5 }
};

export const primaryProfiles = [
  {
    name: "Client-Server",
    subModels: [
      { name: "Relay", criteria: { lobbySize: "Small", gameType: "Competitive", combatOption: "Responsive" } },
      { name: "Full-Auth", criteria: { gameType: "Competitive", onlineEconomy: true } },
      { name: "Hybrid", criteria: { gameType: "Competitive", onlineEconomy: true } }
    ],
    criteria: { lobbySize: "Large", manyEntities: false }
  },
  {
    name: "P2P",
    subModels: [
      { name: "Deterministic Lockstep", criteria: { manyEntities: true } },
      { name: "Rollback", criteria: { combatOption: "Responsive" } }
    ],
    criteria: { lobbySize: "Small" }
  },
  { name: "Arbitrer (Photon Quantum)", subModels: [], criteria: { devTeamSize: "Small" } }
];

export const secondaryProfiles = [
  { name: "Server Side Rewind", criteria: { combatOption: "InstantHit" }, allowedPrimaryProfiles: ["Client-Server"] },
  { name: "Interest Management", criteria: { manyEntities: true }, allowedPrimaryProfiles: ["Client-Server", "P2P"] }
];

export const getSizeIndex = (size) => sizeOrder.indexOf(size);
