import React from 'react';
import { primaryProfiles, secondaryProfiles } from '../recommend/config';
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

const arrayToString = (array) => (Array.isArray(array) ? array.join(', ') : '');

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
        {primaryProfiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <h3>{profile.name}</h3>
            {renderCriteria(profile.criteria)}
            <h4>SubModels:</h4>
            {profile.subModels && profile.subModels.length > 0 ? profile.subModels.map((subModel, subIndex) => (
              <div key={subIndex} className="submodel-card">
                <h5>{subModel.name}</h5>
                {renderCriteria(subModel.criteria)}
                <p><strong>Recommend Library If Small Team:</strong> {booleanToYesNo(subModel.recommendLibraryIfSmallTeam)}</p>
              </div>
            )) : <p>No SubModels</p>}
          </div>
        ))}
      </div>
      <h2>Secondary Profiles</h2>
      <div className="profile-list">
        {secondaryProfiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <h3>{profile.name}</h3>
            {renderCriteria(profile.criteria)}
            <p><strong>Allowed Primary Profiles:</strong> {arrayToString(profile.allowedPrimaryProfiles)}</p>
            <p><strong>Allowed SubModels:</strong> {arrayToString(profile.allowedSubModels)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
