export const scoringConfig = {
  lobbySize: { mismatchPenalty: 20 },
  gameType: { mismatchPenalty: 20 },
  onlineEconomy: { mismatchPenalty: 20 },
  devTeamSize: { mismatchPenalty: 10 },
  manyEntities: { mismatchPenalty: 20 },
  combatOption: { mismatchPenalty: 20 },
  playerInteractionLevel: { mismatchPenalty: 20 }
};

export const primaryProfiles = [
  {
    name: "Client-Server",
    subModels: [
      { name: "Relay", criteria: {  gameType: "Casual"}, recommendLibraryIfSmallTeam: false, playerInteractionLevel: "None" },
      { name: "Full-Auth", criteria: { gameType: "Competitive", onlineEconomy: true }, recommendLibraryIfSmallTeam: true },
      { name: "Hybrid", criteria: { gameType: "Competitive", onlineEconomy: true }, recommendLibraryIfSmallTeam: false }
    ],
    criteria: { lobbySize: ["Small", "Medium", "Large"], manyEntities: false }
  },
  {
    name: "P2P",
    subModels: [
      { name: "Deterministic Lockstep", criteria: { manyEntities: true, lobbySize: ["Small"], gameType: "Competitive" }, recommendLibraryIfSmallTeam: true },
      { name: "Rollback", criteria: { combatOption: "Responsive", lobbySize: ["Small"], gameType: "Competitive" }, recommendLibraryIfSmallTeam: true }
    ],
    criteria: { lobbySize: ["Small"] }
  }
];

export const secondaryProfiles = [
  { name: "Server Side Rewind", criteria: { combatOption: "InstantHit" }, allowedPrimaryProfiles: ["Client-Server"] },
  { name: "Interest Management", criteria: { lobbySize: ["Medium", "Large"] }, allowedPrimaryProfiles: ["Client-Server", "P2P"] },
  { name: "Third Party Library", criteria: { devTeamSize: ["Small"] }, allowedPrimaryProfiles: ["Client-Server", "P2P"] }
];
