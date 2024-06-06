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
    instantHit: {
      label: "Instant Hit Detection",
      type: "checkbox",
      info: "This option is for games where a player needs to hit another player instantly (e.g., FPS games). These require server-side rewind algorithms to reconcile latency."
    },
    responsiveCombat: {
      label: "Responsive Combat",
      type: "checkbox",
      info: "This option is for games that need extremely responsive combat (e.g., fighting games). These prioritize player input and use rollback algorithms."
    },
    noInteractionBetweenPlayers: {
        label: "No Interaction Between Players",
        type: "checkbox",
        info: "This option is for games where players can see each other, but do not collide or hurt each other"
      }
      /*
        Level of interaction:
        - No Interaction Between Players (For example, racing game without collision)
        - Collision betwen Players (For example, Fall Guys)
        - Players can hurt each other (For example, Fortnite)
      */

      /*
        if interaction is hurt each other, ask about responsiveCombt and instantHit
      */
  };
  