import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
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
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    const combinations = generateCombinations();
    const results = evaluateCombinations(combinations);
    setResults(results);

    setColumnDefs([
      { headerName: 'Lobby Size', field: 'criteria.lobbySize', width: 200, autoHeight: true },
      { headerName: 'Game Type', field: 'criteria.gameType', width: 200, autoHeight: true },
      { headerName: 'Online Economy', field: 'criteria.onlineEconomy', width: 200, autoHeight: true, cellRenderer: params => params.value ? 'Yes' : 'No' },
      { headerName: 'Dev Team Size', field: 'criteria.devTeamSize', width: 200, autoHeight: true },
      { headerName: 'Many Entities', field: 'criteria.manyEntities', width: 200, autoHeight: true, cellRenderer: params => params.value ? 'Yes' : 'No' },
      { headerName: 'Player Interaction Level', field: 'criteria.playerInteractionLevel', width: 200, autoHeight: true },
      { headerName: 'Highest Score', field: 'highestScore', width: 200, autoHeight: true },
    ]);
  }, []);

  const barData = {
    labels: ['No Recommendation (0)', 'Probably Not Usable (0-59)', 'Not Recommended (60-79)', 'Good (80+)', 'Perfect (100)'],
    datasets: [
      {
        label: 'Simulation Results',
        data: results ? [results.noRecommendation, results.probablyNotUsable, results.notRecommended, results.good, results.perfect] : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="simulation-page">
      <h2>Simulation Results</h2>
      {results ? (
        <div>
          <div style={{ width: '60%', margin: '0 auto', marginBottom: '20px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="ag-theme-quartz-dark" style={{ height: '600px', width: 'calc(100% - 40px)', margin: '0 auto', padding: '20px' }}>
            <AgGridReact
              rowData={results.summary}
              columnDefs={columnDefs}
              defaultColDef={{ flex: 1, minWidth: 200, filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={25}
              domLayout='autoHeight'
              headerHeight={100}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SimulationPage;
