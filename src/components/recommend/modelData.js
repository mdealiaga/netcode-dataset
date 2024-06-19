export const modelData = {
  lobbySize: {
    label: "Lobby Size",
    type: "buttons",
    options: [
      { value: "Small", label: "Small (<=10)" },
      { value: "Medium", label: "Medium (<=100)" },
      { value: "Large", label: "Large (>100)" }
    ]
  },
  gameType: {
    label: "Game Type",
    type: "radio",
    options: [
      { value: "Casual", label: "Casual" },
      { value: "Competitive", label: "Competitive" },
      { value: "Cooperative", label: "Cooperative" }
    ]
  },
  onlineEconomy: {
    label: "Online Economy",
    type: "checkbox",
    info: "Online economy involves trading items of value and having scarcity, which needs protection against cheating."
  },
  devTeamSize: {
    label: "Development Team Size",
    type: "buttons",
    options: [
      { value: "Small", label: "Small (1-3)" },
      { value: "Medium", label: "Medium (4-9)" },
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
    type: "radio",
    options: [
      { value: "None", label: "No Interaction Between Players (e.g., racing game without collision)" },
      { value: "Collision", label: "Collision Between Players (e.g., Fall Guys)" },
      { value: "Combat", label: "Players Can Hurt Each Other (e.g., Fortnite)" }
    ]
  },
  combatOption: {
    label: "Combat Option",
    type: "radio",
    options: [
      { value: "Basic", label: "Basic Combat" },
      { value: "InstantHit", label: "Instant Hit Detection" },
      { value: "Responsive", label: "Responsive Combat" }
    ],
    info: "Basic Combat: Instant registration is not required (travel time, casting time, etc). Most games other than Competitive FPS and Fighting games.<br />Instant Hit Detection: This option is for games where a player needs to hit another player instantly (e.g., FPS games). These require server-side rewind algorithms to reconcile latency.<br />Responsive Combat: This option is for games that need extremely responsive combat (e.g., fighting games). These prioritize player input and use rollback algorithms."
  }
};
