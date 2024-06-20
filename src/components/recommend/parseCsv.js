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

  const createActualModel = (row) => {
    const primaryProfile = row['Primary Profile'];
    const subModel = row['Sub Model'];
    const secondaryProfiles = [];

    if (row['Server Side Rewind'] === 'TRUE') secondaryProfiles.push('Server Side Rewind');
    if (row['Rollback'] === 'TRUE') secondaryProfiles.push('Rollback');
    if (row['Deterministic Lockstep'] === 'TRUE') secondaryProfiles.push('Deterministic Lockstep');
    if (row['Interest Management'] === 'TRUE') secondaryProfiles.push('Interest Management');
    if (row['Third Party Library'] === 'TRUE') secondaryProfiles.push('Third Party Library');

    return `${primaryProfile} - ${subModel}${secondaryProfiles.length ? ' with ' + secondaryProfiles.join(' and ') : ''}`;
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

        return { ...row, recommendedModels, matches };
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
              {Object.keys(analysisResults[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analysisResults.map((result, index) => (
              <tr key={index}>
                {Object.values(result).map((value, i) => (
                  <td key={i}>{Array.isArray(value) ? value.join(', ') : value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyzeCsv;
