import React, { useContext, useEffect, useState } from 'react';
import Papa from 'papaparse';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import CustomHeader from '../dataset/CustomHeader';
import CustomCell from '../dataset/CustomCell';
import { CsvDataContext } from '../CsvDataContext';
import { recommendNetworkModel } from '../recommend/recommendationLogic';
import Summary from './Summary';
import jStat from 'jstat';
import './AnalyseCsv.css';

const AnalyseCsv = () => {
  const { csvData, loading, error } = useContext(CsvDataContext);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [customData, setCustomData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95); // Default confidence level to 95%

  useEffect(() => {
    if (csvData) {
      analyzeData(csvData);
    }
  }, [csvData, confidenceLevel]); // Recalculate when confidence level changes

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          setCustomData(result.data);
          analyzeData(result.data);
        },
      });
    }
  };

  const mapCombatValue = (combatValue) => {
    const mapping = {
      "No Interaction Between Players": "None",
      "Collision Between Players": "Collision",
      "Combat - Basic": "CombatNormal",
      "Combat - Instant Hit Detection": "CombatInstant",
      "Combat - Responsive": "CombatResponsive"
    };
  
    return mapping[combatValue] || "None"; // Default to "None" if no match found
  };
  
  const analyzeData = (data) => {
    const results = data.map((row) => {
      const criteria = {
        lobbySize: row['Lobby Size'].split(' ')[0],
        gameType: row['Game Type'],
        onlineEconomy: row['Online Economy'] === 'TRUE',
        devTeamSize: row['Development Team Size'].split(' ')[0],
        manyEntities: row['Many Entities per Player'] === 'TRUE',
        playerInteractionLevel: mapCombatValue(row['Player Interaction Level']) 
      };
  
      const recommendation = recommendNetworkModel(criteria);
  
      // Filter recommendations with score 80 or higher
      const highScoreRecommendations = recommendation.filter(rec => rec.score >= 80);
      // const highScoreRecommendations = recommendation
  
      // Combine network profile and algorithms
      const recommendedModels = highScoreRecommendations.map(rec => {
        return `${rec.name} (Score: ${rec.score}) (Penalties: ${rec.penalties.map(p => p.key).join(', ')})`;
      }).join(', ');
  
      // Determine actual model used by the game
      const actualModel = createActualModel(row);
  
      // Check if the recommended models match the actual model used by the game
      const matches = highScoreRecommendations.some(model => model.name === actualModel);
  
      return { 
        gameName: row['Game Name'],
        genre: row['Genre'],
        criteria: JSON.stringify(criteria, null, 2), // Convert criteria to a JSON string
        usedServerModel: actualModel,
        recommendedModelMatches: matches ? 'Yes' : 'No',
        recommendedModels,
        matches
      };
    });
  
    setRowData(results);
    setColumnDefs([
      { headerName: 'Game Name', field: 'gameName', width: 200, autoHeight: true },
      { headerName: 'Genre', field: 'genre', width: 200, autoHeight: true },
      { headerName: 'Criteria', field: 'criteria', width: 300, autoHeight: true }, // Enable wrapping
      { headerName: 'Used Server Model', field: 'usedServerModel', width: 200, autoHeight: true },
      { headerName: 'Recommended Model Matches', field: 'recommendedModelMatches', width: 200, autoHeight: true },
      { headerName: 'Recommended Models and Scores', field: 'recommendedModels', width: 400, autoHeight: true },
    ]);
  
    // Calculate summary statistics
    const total = results.length;
    const correctPredictions = results.filter(result => result.matches).length;
    const incorrectPredictions = total - correctPredictions;
    const accuracy = (correctPredictions / total) * 100;
  
    // Calculate confidence interval using jstat
    const standardError = Math.sqrt((accuracy / 100) * (1 - (accuracy / 100)) / total);
    const zScore = jStat.normal.inv(1 - (1 - confidenceLevel) / 2, 0, 1);
    const marginOfError = zScore * standardError * 100; // Convert to percentage
    const confidenceInterval = [
      Math.max(0, accuracy - marginOfError),
      Math.min(100, accuracy + marginOfError)
    ];
  
    setSummary({
      total,
      correctPredictions,
      incorrectPredictions,
      accuracy: accuracy.toFixed(2),
      confidenceInterval: confidenceInterval.map(val => val.toFixed(2))
    });
  };
  
  
  

  const createActualModel = (row) => {
    const networkProfile = mapNetworkModel(row['Network Model']);
    const networkAlgorithms = [];
  
    console.log('CREATING MODEL FOR', row['Game Name'])
    Object.keys(row).forEach(key => {
      if (key.includes('Server-Side Rewind') && row[key] === 'TRUE') {
        networkAlgorithms.push('Server-Side Rewind');
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
    console.log('found network algorithms', networkAlgorithms)
    // Ensure that all relevant network algorithms are included in the actual model
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

  const handleConfidenceLevelChange = (e) => {
    const newConfidenceLevel = parseFloat(e.target.value);
    setConfidenceLevel(newConfidenceLevel);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {summary && (
        <>
          <Summary summary={summary} />
          <div className="confidence-level-container">
            <label htmlFor="confidence-level">Confidence Level:</label>
            <select id="confidence-level" value={confidenceLevel} onChange={handleConfidenceLevelChange}>
              <option value={0.80}>80%</option>
              <option value={0.85}>85%</option>
              <option value={0.90}>90%</option>
              <option value={0.95}>95%</option>
              <option value={0.99}>99%</option>
            </select>
          </div>
        </>
      )}
      
      {rowData.length > 0 && (
        <div className="evaluation-container">
          <h3>Evaluation Data</h3>
          <div className="ag-theme-quartz-dark" style={{ height: '600px', width: 'calc(100% - 40px)', margin: '0 auto', padding: '20px' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ flex: 1, minWidth: 200, filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={25}
              domLayout='autoHeight'
              headerHeight={100}
              frameworkComponents={{
                customHeader: CustomHeader,
                customCell: CustomCell,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyseCsv;
