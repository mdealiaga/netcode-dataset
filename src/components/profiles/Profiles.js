import React from 'react';
import { primaryProfiles, secondaryProfiles } from '../recommend/config';
import './Profiles.css';

const Profiles = () => {
  return (
    <div className="profiles-container">
      <h2>Network Profiles</h2>
      <div className="profile-list">
        {primaryProfiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <h3>{profile.name}</h3>
            <p><strong>Criteria:</strong> {JSON.stringify(profile.criteria)}</p>
            <h4>SubModels:</h4>
            {profile.subModels.map((subModel, subIndex) => (
              <div key={subIndex} className="submodel-card">
                <h5>{subModel.name}</h5>
                <p><strong>Criteria:</strong> {JSON.stringify(subModel.criteria)}</p>
                <p><strong>Recommend Library If Small Team:</strong> {subModel.recommendLibraryIfSmallTeam ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2>Secondary Profiles</h2>
      <div className="profile-list">
        {secondaryProfiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <h3>{profile.name}</h3>
            <p><strong>Criteria:</strong> {JSON.stringify(profile.criteria)}</p>
            <p><strong>Allowed Primary Profiles:</strong> {profile.allowedPrimaryProfiles.join(', ')}</p>
            <p><strong>Allowed SubModels:</strong> {profile.allowedSubModels.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiles;
