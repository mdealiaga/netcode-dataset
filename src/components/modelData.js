export const modelData = {
    lobbySize: {
      label: "Lobby Size",
      options: [
        { value: "Small", label: "Small (<=10)" },
        { value: "Medium", label: "Medium (<=100)" },
        { value: "Large", label: "Large (>100)" }
      ]
    },
    gameType: {
      label: "Game Type",
      options: [
        { value: "Casual", label: "Casual" },
        { value: "Competitive", label: "Competitive" },
        { value: "Cooperative", label: "Cooperative" }
      ]
    },
    onlineEconomy: {
      label: "Online Economy",
      type: "checkbox"
    },
    devTeamSize: {
      label: "Development Team Size",
      options: [
        { value: "Small", label: "Small (1-3)" },
        { value: "Medium", label: "Medium (4-10)" },
        { value: "Large", label: "Large (10+)" }
      ]
    },
    manyEntities: {
      label: "Many Entities per Player",
      type: "checkbox",
      info: "This option is for games that have many entities per player (e.g., RTS games). These require algorithms that use low bandwidth per entity."
    },
    playerInteractionLevel: {
      label: "Player Interaction Level",
      options: [
        { value: "None", label: "No Interaction Between Players (e.g., racing game without collision)" },
        { value: "Collision", label: "Collision Between Players (e.g., Fall Guys)" },
        { value: "Combat", label: "Players Can Hurt Each Other (e.g., Fortnite)" }
      ]
    },
    // basic combat 
    // for example WoW where a hit is guaranteed if certain checks are passed, or a game where a projectile is created that can be dodged
    instantHit: {
      label: "Instant Hit Detection",
      type: "checkbox",
      info: "This option is for games where a player needs to hit another player instantly (e.g., FPS games). These require server-side rewind algorithms to reconcile latency."
    },
    responsiveCombat: {
      label: "Responsive Combat",
      type: "checkbox",
      info: "This option is for games that need extremely responsive combat (e.g., fighting games). These prioritize player input and use rollback algorithms."
    }
  };
  