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
      { name: "Relay", criteria: {
          gameType: "Casual",recommendLibraryIfSmallTeam: false, onlineEconomy: false, combatOption: "", playerInteractionLevel: "None", devTeamSize: ["Small", "Medium", "Large"]
        },  },
      { name: "Full-Auth", criteria: {
         gameType: "Competitive", onlineEconomy: [true, false],  playerInteractionLevel: [ "Collision", "Combat"], combatOption: [ "Basic", "InstantHit"], recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"] 
        } },
      { name: "Hybrid", criteria: { gameType: "Competitive", playerInteractionLevel: ["None", "Collision", "Combat"], combatOption: ["", "Basic"], onlineEconomy: [true, false], recommendLibraryIfSmallTeam: false, devTeamSize: ["Small", "Medium", "Large"]
      } }
    ],
    criteria: { lobbySize: ["Small", "Medium", "Large"], manyEntities: false }
  },
  {
    name: "P2P",
    subModels: [
      { name: "Deterministic Lockstep", criteria: {
         manyEntities: true, lobbySize: ["Small"], gameType: "Competitive", recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"], 
       playerInteractionLevel: ["None", "Collision", "Combat"],  combatOption: ["", "Basic", "InstantHit"]
        } },
      { name: "Rollback", criteria: {
         lobbySize: ["Small"], gameType: "Competitive", recommendLibraryIfSmallTeam: true, devTeamSize: ["Medium", "Large"], 
         playerInteractionLevel: "Combat", combatOption: "Responsive"
        } }
    ],
    criteria: { lobbySize: ["Small"], onlineEconomy: false }
  }
];

export const secondaryProfiles = [
  { name: "Server Side Rewind", criteria: {
     combatOption: "InstantHit", playerInteractionLevel: "Combat"
  }, 
  // allowedPrimaryProfiles: ["Client-Server"],
  allowedSubModels: ["Full-Auth"] 
},
  { name: "Interest Management", criteria: {
     lobbySize: ["Medium", "Large"] 
    }, 
    // allowedPrimaryProfiles: ["Client-Server", "P2P"],
    allowedSubModels: ["Full-Auth", "Hybrid", "Relay"] 
  },
  { name: "Third Party Library", criteria: {
     devTeamSize: ["Small"] 
    },
    //  allowedPrimaryProfiles: ["Client-Server", "P2P"],
     allowedSubModels: ["Full-Auth", "Deterministic Lockstep", "Rollback"] 
    }
];
