import React, { useEffect, useState } from 'react';
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
