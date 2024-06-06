import React, { useState } from 'react';
import RecommendationForm from './RecommendationForm'; // Ensure this matches the actual file name
import RecommendationList from './RecommendationList'; // Ensure this matches the actual file name
import { recommendNetworkModel } from './recommendationLogic'; // Ensure this matches the actual file name

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  const handleRecommend = (criteria) => {
    const recommendedModels = recommendNetworkModel(criteria);
    setRecommendations(recommendedModels);
  };

  return (
    <div>
      <h2>Game Network Model Recommendations</h2>
      <RecommendationForm onRecommend={handleRecommend} />
      <RecommendationList recommendations={recommendations} />
    </div>
  );
};

export default Recommendations;
