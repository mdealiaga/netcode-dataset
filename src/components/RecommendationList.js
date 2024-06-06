import React from 'react';

const RecommendationList = ({ recommendations }) => (
  <div>
    <h3>Recommended Network Models:</h3>
    <ul>
      {recommendations.map((rec, index) => (
        <li key={index}>{rec.name} - Score: {rec.score}</li>
      ))}
    </ul>
  </div>
);

export default RecommendationList;
