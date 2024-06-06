import React, { useState } from 'react';
import RecommendationForm from './RecommendationForm'; 
import RecommendationList from './RecommendationList'; 
import { recommendNetworkModel } from './recommendationLogic'; 

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
