import React, { useState } from 'react';
import Papa from 'papaparse';
import { recommendNetworkModel } from '../recommend/recommendationLogic';

const AnalyseCsv = () => {
  const [fileContent, setFileContent] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          setFileContent(result.data);
        },
      });
    }
  };

  const analyzeData = () => {
    if (fileContent) {
      const results = fileContent.map((row) => {
        const criteria = {
          lobbySize: row['Lobby Size'].split(' ')[0],
          gameType: row['Game Type'],
          onlineEconomy: row['Online Economy'] === 'TRUE',
          devTeamSize: row['Development Team Size'].split(' ')[0],
          manyEntities: row['Many Entities per Player'] === 'TRUE',
          playerInteractionLevel: row['Player Interaction Level'],
        };

        const recommendation = recommendNetworkModel(criteria);

        // Filter recommendations with score 80 or higher
        const highScoreRecommendations = recommendation.filter(rec => rec.score >= 80);

        // Combine network profile and algorithms
        const recommendedModels = highScoreRecommendations.map(rec => {
          let model = rec.name;
          return { name: model, score: rec.score };
        });

        // Determine actual model used by the game
        const actualModel = createActualModel(row);

        // Check if the recommended models match the actual model used by the game
        const matches = recommendedModels.some(model => model.name === actualModel);

        return { 
          gameName: row['Game Name'],
          genre: row['Genre'],
          usedServerModel: actualModel,
          recommendedModelMatches: matches ? 'Yes' : 'No',
          recommendedModels
        };
      });

      setAnalysisResults(results);
    }
  };

  const checkForKeyword = (row, keyword) => {
    return Object.keys(row).some(key => row[key] && row[key].toLowerCase().includes(keyword.toLowerCase()));
  };
  
const createActualModel = (row) => {
  const networkProfile = mapNetworkModel(row['Network Model']);
  const networkAlgorithms = [];

  Object.keys(row).forEach(key => {
    if (key.includes('Server Side Rewind') && row[key] === 'TRUE') {
      networkAlgorithms.push('Server Side Rewind');
    }
    if (key.includes('Rollback') && row[key] && row[key] === 'TRUE') {
      networkAlgorithms.push('Rollback');
    }
    if (key.includes('Deterministic Lockstep') && row[key] === 'TRUE') {
      networkAlgorithms.push('Deterministic Lockstep');
    }
    if (key.includes('Interest Management') && row[key] === 'TRUE') {
      networkAlgorithms.push('Interest Management');
    }
    if (key.includes('Third Party Library') && row[key] && row[key].includes('Third Party Library') && !row[key].includes('(in-house)')) {
      networkAlgorithms.push('Third Party Library');
    }
  });

  return `${networkProfile}${networkAlgorithms.length ? ' with ' + networkAlgorithms.join(' and ') : ''}`;
};
  const mapNetworkModel = (networkModel) => {
    switch (networkModel) {
      case "Peer to Peer":
        return "Peer to Peer";
      case "Client-Server with Server-Side Authority":
        return "Client-Server with Server-Side Authority";
      case "Client-Server with Client-Side Authority (Relay)":
        return "Client-Server with Client-Side Authority (Relay)";
      case "Client-Server with Hybrid Authority":
        return "Client-Server with Hybrid Authority";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <h2>Analyze CSV Data</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={analyzeData}>Analyze</button>
      {analysisResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Game Name</th>
              <th>Genre</th>
              <th>Used Server Model</th>
              <th>Recommended Model Matches</th>
              <th>Recommended Models and Scores</th>
            </tr>
          </thead>
          <tbody>
            {analysisResults.map((result, index) => (
              <tr key={index}>
                <td>{result.gameName}</td>
                <td>{result.genre}</td>
                <td>{result.usedServerModel}</td>
                <td>{result.recommendedModelMatches}</td>
                <td>
                  {result.recommendedModels.map((model, i) => (
                    <div key={i}>{model.name} (Score: {model.score})</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyseCsv;
