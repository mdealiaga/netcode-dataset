export const scoringConfig = {
  lobbySize: { mismatchPenalty: 20 },
  gameType: { mismatchPenalty: 20 },
  onlineEconomy: { mismatchPenalty: 20 },
  devTeamSize: { mismatchPenalty: 20 },
  manyEntities: { mismatchPenalty: 20 },
  playerInteractionLevel: { mismatchPenalty: 40 }
};

export const criteriaCombinationConfig = {
  default: 'union', // Default behavior is to join the criteria (union)
  // playerInteractionLevel: 'intersection' // Use intersection for playerInteractionLevel
};


export const networkProfiles = [
  {
    name: "Client-Server with Server-Side Authority",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Competitive",
      onlineEconomy: [true, false],
      playerInteractionLevel: ["Collision", "CombatNormal"],
      recommendLibraryIfSmallTeam: true,
      devTeamSize: ["Medium", "Large"]
    }
  },
  {
    name: "Client-Server with Client-Side Authority (Relay)",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Casual",
      playerInteractionLevel: "None",
      recommendLibraryIfSmallTeam: false,
      devTeamSize: ["Small","Medium", "Large"]

    }
  },
  {
    name: "Client-Server with Hybrid Authority",
    criteria: {
      lobbySize: ["Small", "Medium", "Large"],
      manyEntities: false,
      gameType: "Competitive",
      playerInteractionLevel: ["None", "Collision", "CombatNormal"],
      recommendLibraryIfSmallTeam: false,
      devTeamSize: ["Small","Medium", "Large"]
    }
  },
  {
    name: "Peer to Peer",
    criteria: {
      lobbySize: ["Small"],
      onlineEconomy: false,
      devTeamSize: ["Medium", "Large"]
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
      playerInteractionLevel: ["None", "Collision", "CombatNormal"]
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
