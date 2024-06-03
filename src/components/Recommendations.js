import React, { useState } from 'react';

const Recommendations = () => {
  const [genre, setGenre] = useState('');
  const [lobbySize, setLobbySize] = useState('');
  const [gameType, setGameType] = useState('');
  const [onlineEconomy, setOnlineEconomy] = useState(false);
  const [devTeamSize, setDevTeamSize] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const recommendedModels = recommendNetworkModel({
      genre,
      lobbySize,
      gameType,
      onlineEconomy,
      devTeamSize
    });

    setRecommendations(recommendedModels);
  };

  const recommendNetworkModel = ({ genre, lobbySize, gameType, onlineEconomy, devTeamSize }) => {
    const profiles = {
      clientServer: { name: "Client-Server", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (lobbySize !== "Large" && genre !== "Fighter") },
      relay: { name: "Relay", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (lobbySize !== "Large" && gameType !== "Competitive") },
      fullAuth: { name: "Full-Auth", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (gameType === "Competitive" || onlineEconomy === true) && lobbySize !== "Large" },
      hybrid: { name: "Hybrid", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (gameType === "Competitive" && lobbySize !== "Large") },
      arbitrer: { name: "Arbitrer (Photon Quantum)", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (devTeamSize === "Small") },
      p2p: { name: "P2P", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (lobbySize === "Small") },
      deterministicLockstep: { name: "Deterministic Lockstep", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (genre === "RTS") },
      rollback: { name: "Rollback", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (genre === "Fighter" && lobbySize === "Small") },
      serverSidePrediction: { name: "Server Side Prediction", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (genre === "FPS" && lobbySize === "Small") },
      basic: { name: "Basic", criteria: (genre, lobbySize, gameType, onlineEconomy, devTeamSize) => (devTeamSize === "Small" && gameType === "Casual") }
    };

    return Object.values(profiles)
      .filter(profile => profile.criteria(genre, lobbySize, gameType, onlineEconomy, devTeamSize))
      .map(profile => profile.name);
  };

  return (
    <div>
      <h2>Game Network Model Recommendations</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Genre:
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Select Genre</option>
            <option value="FPS">FPS</option>
            <option value="RTS">RTS</option>
            <option value="Fighter">Fighter</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <br />
        <label>
          Lobby Size:
          <select value={lobbySize} onChange={(e) => setLobbySize(e.target.value)}>
            <option value="">Select Lobby Size</option>
            <option value="Small">Small (&lt;=10)</option>
            <option value="Medium">Medium (&lt;=100)</option>
            <option value="Large">Large (&gt;100)</option>
          </select>
        </label>
        <br />
        <label>
          Game Type:
          <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
            <option value="">Select Game Type</option>
            <option value="Casual">Casual</option>
            <option value="Competitive">Competitive</option>
            <option value="Cooperative">Cooperative</option>
          </select>
        </label>
        <br />
        <label>
          Online Economy:
          <input
            type="checkbox"
            checked={onlineEconomy}
            onChange={(e) => setOnlineEconomy(e.target.checked)}
          />
        </label>
        <br />
        <label>
          Development Team Size:
          <select value={devTeamSize} onChange={(e) => setDevTeamSize(e.target.value)}>
            <option value="">Select Development Team Size</option>
            <option value="Small">Small (1-3)</option>
            <option value="Medium">Medium (4-10)</option>
            <option value="Large">Large (10+)</option>
          </select>
        </label>
        <br />
        <button type="submit">Get Recommendations</button>
      </form>
      <div>
        <h3>Recommended Network Models:</h3>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;
