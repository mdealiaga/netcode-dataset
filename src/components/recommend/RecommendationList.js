import React, { useState } from 'react';
import './RecommendationList.css';

const RecommendationList = ({ recommendations }) => {
  return (
    <div>
      <h3>Recommended Network Models:</h3>
      <ul className="recommendation-list">
        {recommendations.map((rec, index) => (
          <RecommendationItem key={index} recommendation={rec} />
        ))}
      </ul>
    </div>
  );
};

const RecommendationItem = ({ recommendation }) => {
  const [showPenalties, setShowPenalties] = useState(false);

  const togglePenalties = () => {
    setShowPenalties(!showPenalties);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  const [primaryProfile, ...rest] = recommendation.name.split(' - ');
  const subModel = rest.join(' - ');
  let secondaryProfiles = '';

  if (primaryProfile === 'P2P') {
    secondaryProfiles = subModel.split(' with ').slice(1).join(', ');
  } else {
    secondaryProfiles = subModel.split(' with ').slice(1).join(', ');
  }

  return (
    <li className={`recommendation-item ${getScoreColor(recommendation.score)}`}>
      <div className="recommendation-header">
        <div className="recommendation-primary">{primaryProfile} - {subModel.split(' with ')[0]}</div>
        <div className="recommendation-secondaries">{secondaryProfiles}</div>
        <div className="recommendation-score">Score: {recommendation.score}</div>
        <button className="toggle-penalties-button" onClick={togglePenalties}>
          {showPenalties ? 'Hide Penalties' : 'Show Penalties'}
        </button>
      </div>
      {showPenalties && (
        <div className="penalties-list">
          <ul>
            {recommendation.penalties.map((penalty, i) => (
              <li key={i}>{penalty.reason}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default RecommendationList;
