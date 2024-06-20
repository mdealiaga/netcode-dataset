import React, { useState } from 'react';
import Papa from 'papaparse';
import { recommendNetworkModel } from './recommendationLogic';

const AnalyzeCsv = () => {
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

  const parseSize = (size) => {
    if (size.includes('Small')) return 'Small';
    if (size.includes('Medium')) return 'Medium';
    if (size.includes('Large')) return 'Large';
    return size;
  };

  const mapNetworkModel = (model) => {
    switch (model) {
      case 'Peer to Peer':
        return 'P2P';
      case 'Client-Server with Server-Side Authority':
        return 'Client-Server - Full-Auth';
      case 'Client-Server with Client-Side Authority (Relay)':
        return 'Client-Server - Relay';
      case 'Client-Server with Hybrid Authority':
        return 'Client-Server - Hybrid';
      default:
        return 'Unknown Model';
    }
  };

  const createActualModel = (row) => {
    const primaryAndSubModel = mapNetworkModel(row['Network Model']);
    const secondaryProfiles = [];
    Object.keys(row).forEach(key => {
        if (key.startsWith('Server-Side Rewind') && row[key] === 'TRUE') secondaryProfiles.push('Server Side Rewind');
        if (key.startsWith('Rollback') && row[key] === 'TRUE') secondaryProfiles.push('Rollback');
        if (key.startsWith('Deterministic Lockstep') && row[key] === 'TRUE') secondaryProfiles.push('Deterministic Lockstep');
        if (key.startsWith('Interest Management') && row[key] === 'TRUE') secondaryProfiles.push('Interest Management');
        if (key.startsWith('Third Party Library')) {
          if (row[key] && !row[key].includes('(in-house)')) {
            secondaryProfiles.push('Third Party Library');
          }
        }
      });
  

    return `${primaryAndSubModel}${secondaryProfiles.length ? ' with ' + secondaryProfiles.join(' and ') : ''}`;
  };

  const analyzeData = () => {
    if (fileContent) {
      const results = fileContent.map((row) => {
        const criteria = {
          lobbySize: parseSize(row['Lobby Size']),
          gameType: row['Game Type'],
          onlineEconomy: row['Online Economy'] === 'TRUE',
          devTeamSize: parseSize(row['Development Team Size']),
          manyEntities: row['Many Entities per Player'] === 'TRUE',
          playerInteractionLevel: row['Player Interaction Level'],
        };

        const recommendations = recommendNetworkModel(criteria);

        // Filter recommendations with score 80 or higher
        const highScoreRecommendations = recommendations.filter(rec => rec.score >= 80);

        // Combine primary profiles, submodels, and secondary profiles
        const recommendedModels = highScoreRecommendations.map(rec => {
          let model = rec.name;
          const secondaryProfiles = [];

          rec.penalties.forEach(penalty => {
            if (penalty.key in secondaryProfiles) {
              secondaryProfiles.push(penalty.key);
            }
          });

          if (secondaryProfiles.length > 0) {
            model += ' with ' + secondaryProfiles.join(' and ');
          }

          return model;
        });

        const actualModel = createActualModel(row);
        const matches = recommendedModels.includes(actualModel);

        // Add all high score models with scores
        const highScoreModels = highScoreRecommendations.map(rec => `${rec.name} (${rec.score})`).join(', ');

        return {
          'Game Name': row['Game Name'],
          'Genre': row['Genre'],
          'Used Server Model': actualModel,
          'Recommended Model Matches': matches ? 'Yes' : 'No',
          'High Score Models': highScoreModels,
        };
      });

      setAnalysisResults(results);
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
              <th>High Score Models</th>
            </tr>
          </thead>
          <tbody>
            {analysisResults.map((result, index) => (
              <tr key={index}>
                <td>{result['Game Name']}</td>
                <td>{result['Genre']}</td>
                <td>{result['Used Server Model']}</td>
                <td>{result['Recommended Model Matches']}</td>
                <td>{result['High Score Models']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyzeCsv;
