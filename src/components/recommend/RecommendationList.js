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

  return (
    <li className={`recommendation-item ${getScoreColor(recommendation.score)}`}>
      <div className="recommendation-header">
        <div className="recommendation-primary">{recommendation.networkProfile}</div>
        {recommendation.networkAlgorithms.length > 0 && (
          <div className="recommendation-secondary">{recommendation.networkAlgorithms.join(' and ')}</div>
        )}
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
