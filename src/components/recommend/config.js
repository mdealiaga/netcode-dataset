export const scoringConfig = {
  lobbySize: { mismatchPenalty: 20 },
  gameType: { mismatchPenalty: 20 },
  onlineEconomy: { mismatchPenalty: 20 },
  devTeamSize: { mismatchPenalty: 20 },
  manyEntities: { mismatchPenalty: 20 },
  playerInteractionLevel: { mismatchPenalty: 20 }
};

export const networkProfiles = [
  {
    name: "Client-Server with Server-Side Authority",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Competitive",
      onlineEconomy: [true, false],
      playerInteractionLevel: ["Collision", "CombatNormal", "CombatInstant"],
      recommendLibraryIfSmallTeam: true
    }
  },
  {
    name: "Client-Server with Client-Side Authority (Relay)",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Casual",
      playerInteractionLevel: "None",
      recommendLibraryIfSmallTeam: false
    }
  },
  {
    name: "Client-Server with Hybrid Authority",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Competitive",
      playerInteractionLevel: ["None", "Collision", "CombatNormal"],
      recommendLibraryIfSmallTeam: false
    }
  },
  {
    name: "Peer to Peer",
    criteria: {
      lobbySize: ["Small"],
      onlineEconomy: false
    }, 
    recommendLibraryIfSmallTeam: true,

  }
];

export const networkAlgorithms = [
  {
    name: "Server Side Rewind",
    criteria: {
      playerInteractionLevel: "CombatInstant"
    },
    allowedNetworkProfiles: ["Client-Server with Server-Side Authority"]
  },
  {
    name: "Rollback",
    criteria: {
      lobbySize: ["Small"],
      gameType: "Competitive",
      recommendLibraryIfSmallTeam: true,
      devTeamSize: ["Medium", "Large"],
      playerInteractionLevel: "CombatResponsive",
      manyEntities: false
    },
    allowedNetworkProfiles: ["Peer to Peer", "Client-Server with Client-Side Authority (Relay)"]
  },
  {
    name: "Deterministic Lockstep",
    criteria: {
      manyEntities: true,
      lobbySize: ["Small"],
      gameType: "Competitive",
      recommendLibraryIfSmallTeam: true,
      devTeamSize: ["Medium", "Large"],
      playerInteractionLevel: ["None", "Collision", "CombatNormal", "CombatInstant"]
    },
    allowedNetworkProfiles: ["Peer to Peer", "Client-Server with Client-Side Authority (Relay)"]
  },
  {
    name: "Interest Management",
    criteria: {
      lobbySize: ["Medium", "Large"]
    },
    allowedNetworkProfiles: ["Client-Server with Server-Side Authority", "Client-Server with Client-Side Authority (Relay)", "Client-Server with Hybrid Authority", "Peer to Peer"]
  },
  {
    name: "Third Party Library",
    criteria: {
      devTeamSize: ["Small"]
    },
    allowedNetworkProfiles: ["Client-Server with Server-Side Authority", "Peer to Peer"],
    other: true // Flag to identify this as "Other" in the profile view
  }
];
