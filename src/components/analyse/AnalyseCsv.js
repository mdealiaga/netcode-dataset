import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import CustomHeader from '../CustomHeader';
import CustomCell from '../CustomCell';
import { csvUrl } from '../../constants';
import { recommendNetworkModel } from '../recommend/recommendationLogic';

const AnalyseCsv = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        analyzeData(results.data);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          analyzeData(result.data);
        },
      });
    }
  };

  const analyzeData = (data) => {
    const results = data.map((row) => {
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
        return `${rec.name} (Score: ${rec.score})`;
      }).join(', ');

      // Determine actual model used by the game
      const actualModel = createActualModel(row);

      // Check if the recommended models match the actual model used by the game
      const matches = highScoreRecommendations.some(model => model.name === actualModel);

      return { 
        gameName: row['Game Name'],
        genre: row['Genre'],
        usedServerModel: actualModel,
        recommendedModelMatches: matches ? 'Yes' : 'No',
        recommendedModels
      };
    });

    setRowData(results);
    setLoading(false);
    setColumnDefs([
      { headerName: 'Game Name', field: 'gameName', width: 200 },
      { headerName: 'Genre', field: 'genre', width: 150 },
      { headerName: 'Used Server Model', field: 'usedServerModel', width: 300 },
      { headerName: 'Recommended Model Matches', field: 'recommendedModelMatches', width: 200 },
      { headerName: 'Recommended Models and Scores', field: 'recommendedModels', width: 400 }
    ]);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="ag-theme-quartz-dark" style={{ height: '600px', width: '100%' }}>
      <h2>Analyze CSV Data</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {rowData.length > 0 && (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, minWidth: 200, filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={25}
          domLayout='autoHeight'
          frameworkComponents={{
            customHeader: CustomHeader,
            customCell: CustomCell
          }}
        />
      )}
    </div>
  );
};

export default AnalyseCsv;
