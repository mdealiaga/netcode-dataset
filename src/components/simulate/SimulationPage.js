import React, { useEffect, useState } from 'react';
import { recommendNetworkModel } from '../recommend/recommendationLogic';
import './SimulationPage.css';

const generateCombinations = () => {
  const lobbySizes = ["Small", "Medium", "Large"];
  const gameTypes = ["Casual", "Competitive", "Cooperative"];
  const onlineEconomyOptions = [true, false];
  const devTeamSizes = ["Small", "Medium", "Large"];
  const manyEntitiesOptions = [true, false];
  const playerInteractionLevels = ["None", "Collision", "CombatNormal", "CombatInstant", "CombatResponsive"];

  const combinations = [];

  for (const lobbySize of lobbySizes) {
    for (const gameType of gameTypes) {
      for (const onlineEconomy of onlineEconomyOptions) {
        for (const devTeamSize of devTeamSizes) {
          for (const manyEntities of manyEntitiesOptions) {
            for (const playerInteractionLevel of playerInteractionLevels) {
              combinations.push({
                lobbySize,
                gameType,
                onlineEconomy,
                devTeamSize,
                manyEntities,
                playerInteractionLevel
              });
            }
          }
        }
      }
    }
  }

  return combinations;
};

const evaluateCombinations = (combinations) => {
  const results = {
    perfect: 0,
    good: 0,
    notRecommended: 0,
    probablyNotUsable: 0,
    noRecommendation: 0,
    summary: [],
  };

  combinations.forEach((criteria) => {
    const recommendation = recommendNetworkModel(criteria);

    const highestScore = Math.max(...recommendation.map(rec => rec.score), 0);

    if (highestScore === 100) {
      results.perfect += 1;
    } else if (highestScore >= 80) {
      results.good += 1;
    } else if (highestScore >= 60) {
      results.notRecommended += 1;
    } else if (highestScore < 60 && highestScore > 0) {
      results.probablyNotUsable += 1;
    } else {
      results.noRecommendation += 1;
    }

    results.summary.push({
      criteria,
      highestScore,
    });
  });

  return results;
};

const SimulationPage = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const combinations = generateCombinations();
    const results = evaluateCombinations(combinations);
    setResults(results);
  }, []);

  return (
    <div className="simulation-page">
      <h2>Simulation Results</h2>
      {results ? (
        <div>
          <p><strong>Perfect (100):</strong> {results.perfect}</p>
          <p><strong>Good (80+):</strong> {results.good}</p>
          <p><strong>Not Recommended (60-79):</strong> {results.notRecommended}</p>
          <p><strong>Probably Not Usable (0-59):</strong> {results.probablyNotUsable}</p>
          <p><strong>No Recommendation (0):</strong> {results.noRecommendation}</p>
          <h3>Detailed Results</h3>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Lobby Size</th>
                  <th>Game Type</th>
                  <th>Online Economy</th>
                  <th>Dev Team Size</th>
                  <th>Many Entities</th>
                  <th>Player Interaction Level</th>
                  <th>Highest Score</th>
                </tr>
              </thead>
              <tbody>
                {results.summary.map((result, index) => (
                  <tr key={index}>
                    <td>{result.criteria.lobbySize}</td>
                    <td>{result.criteria.gameType}</td>
                    <td>{result.criteria.onlineEconomy ? 'Yes' : 'No'}</td>
                    <td>{result.criteria.devTeamSize}</td>
                    <td>{result.criteria.manyEntities ? 'Yes' : 'No'}</td>
                    <td>{result.criteria.playerInteractionLevel}</td>
                    <td>{result.highestScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SimulationPage;
