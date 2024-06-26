// components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h2>Welcome to the Game Netcode Database</h2>
      <p>This website provides various tools and resources for analyzing and recommending network models for games.</p>
      <div className="home-links">
        <div>
          <h3>Dataset</h3>
          <p>Explore the dataset of various games and their network models.</p>
          <Link to="/">Go to Dataset</Link>
        </div>
        <div>
          <h3>Profiles</h3>
          <p>View different network profiles and their characteristics.</p>
          <Link to="/profiles">Go to Profiles</Link>
        </div>
        <div>
          <h3>Recommend</h3>
          <p>Get recommendations for the best network model based on your criteria.</p>
          <Link to="/recommend">Go to Recommendations</Link>
        </div>
        <div>
          <h3>Evaluate</h3>
          <p>Evaluate model recommendations with the real world dataset.</p>
          <Link to="/evaluate">Go to Evaluate</Link>
        </div>
        <div>
          <h3>Simulate</h3>
          <p>Simulate all possible combinations and explore them.</p>
          <Link to="/simulate">Go to Simulation</Link>
        </div>
        <div>
          <h3>Download Dataset</h3>
          <p>Download the full dataset in CSV format</p>
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSev34FK3e5MuHtQED5AUSovGEAU9l5TgxP4_w-RnEQRngIM6EDBRvzPS7WJnWKHjPrzMsl9BlCI1ly/pub?gid=133993680&single=true&output=csv"
            download
            className="download-link" /* Add a specific class for this link */
          >
            Download Dataset
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
