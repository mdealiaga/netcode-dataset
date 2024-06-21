import React from 'react';
import { networkProfiles, networkAlgorithms } from '../recommend/config';
import './Profiles.css';

const criteriaLabels = {
  lobbySize: "Lobby Size",
  gameType: "Game Type",
  onlineEconomy: "Online Economy",
  devTeamSize: "Development Team Size",
  manyEntities: "Many Entities",
  combatOption: "Combat Option",
  playerInteractionLevel: "Player Interaction Level",
  recommendLibraryIfSmallTeam: "Recommend Library If Small Team"
};

const booleanToYesNo = (value) => (value ? 'Yes' : 'No');

const arrayToString = (array) => Array.isArray(array) ? array.join(', ') : array;

const renderCriteria = (criteria) => {
  return Object.keys(criteria).map(key => {
    const value = criteria[key];
    const label = criteriaLabels[key] || key;
    let displayValue;

    if (Array.isArray(value)) {
      displayValue = arrayToString(value);
    } else if (typeof value === 'boolean') {
      displayValue = booleanToYesNo(value);
    } else {
      displayValue = value;
    }

    return (
      <p key={key}><strong>{label}:</strong> {displayValue}</p>
    );
  });
};

const Profiles = () => {
  return (
    <div className="profiles-container">
      <h2>Network Profiles</h2>
      <div className="profile-list">
        {networkProfiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <h3>{profile.name}</h3>
            {renderCriteria(profile.criteria)}
          </div>
        ))}
      </div>
      <h2>Network Algorithms</h2>
      <div className="profile-list">
        {networkAlgorithms.map((algorithm, index) => (
          <div key={index} className="profile-card">
            <h3>{algorithm.name}</h3>
            {renderCriteria(algorithm.criteria)}
            <p><strong>Allowed Network Profiles:</strong> {arrayToString(algorithm.allowedNetworkProfiles)}</p>
            <p><strong>Allowed SubModels:</strong> {arrayToString(algorithm.allowedSubModels)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
