export const scoringConfig = {
  lobbySize: { mismatchPenalty: 20 },
  gameType: { mismatchPenalty: 20 },
  onlineEconomy: { mismatchPenalty: 20 },
  devTeamSize: { mismatchPenalty: 20 },
  manyEntities: { mismatchPenalty: 20 },
  playerInteractionLevel: { mismatchPenalty: 20 }
};

export const primaryProfiles = [
  {
    name: "Client-Server",
    subModels: [
      {
        name: "Relay", criteria: {
          gameType: "Casual", recommendLibraryIfSmallTeam: false, onlineEconomy: false, playerInteractionLevel: "None", devTeamSize: ["Small", "Medium", "Large"]
        },
      },
      {
        name: "Full-Auth", criteria: {
          gameType: "Competitive", onlineEconomy: [true, false], playerInteractionLevel: ["Collision", "CombatNormal", "CombatInstant"], recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"]
        }
      },
      {
        name: "Hybrid", criteria: {
          gameType: "Competitive", playerInteractionLevel: ["None", "Collision", "CombatNormal"], onlineEconomy: [true, false], recommendLibraryIfSmallTeam: false, devTeamSize: ["Small", "Medium", "Large"]
        }
      }
    ],
    criteria: { lobbySize: ["Small", "Medium", "Large"], manyEntities: false }
  },
  {
    name: "P2P",
    subModels: [
    ],
    criteria: { lobbySize: ["Small"], onlineEconomy: false }
  }
];

export const secondaryProfiles = [
  {
    name: "Server Side Rewind", criteria: {
      playerInteractionLevel: "CombatInstant"
    },
    allowedPrimaryProfiles: ["Client-Server"],
    allowedSubModels: ["Full-Auth"]
  },
  {
    name: "Rollback", criteria: {
      lobbySize: ["Small"], gameType: "Competitive", recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"],
      playerInteractionLevel: "CombatResponsive", manyEntities: false
    },
    allowedPrimaryProfiles: ["Client-Server", "P2P"],
    allowedSubModels: ["Relay"]
  },
  {
    name: "Deterministic Lockstep", criteria: {
      manyEntities: true, lobbySize: ["Small"], gameType: "Competitive", recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"],
      playerInteractionLevel: ["None", "Collision", "CombatNormal", "CombatInstant"],
    },
    allowedPrimaryProfiles: ["Client-Server", "P2P"],
    allowedSubModels: ["Relay"]
  },
  {
    name: "Interest Management", criteria: {
      lobbySize: ["Medium", "Large"]
    },
    allowedPrimaryProfiles: ["Client-Server", "P2P"],
    allowedSubModels: ["Full-Auth", "Hybrid", "Relay"]
  },
  {
    name: "Third Party Library", criteria: {
      devTeamSize: ["Small"]
    },
    allowedPrimaryProfiles: ["Client-Server", "P2P"],
    allowedSubModels: ["Full-Auth", "Deterministic Lockstep", "Rollback"]
  }
];
