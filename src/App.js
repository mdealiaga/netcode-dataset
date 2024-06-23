import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataTable from './components/dataset/DataTable';
import Recommendations from './components/recommend/Recommendations';
import Profiles from './components/profiles/Profiles';
import EvaluateCsv from './components/evaluate/evaluateCsv';
import SimulationPage from './components/simulate/SimulationPage';

import './App.css';
import { CsvDataProvider } from './components/CsvDataContext';

function Header() {
  return (
    <header className="App-header">
      <div className="header-content">
        <h1 className="header-title">Game Netcode Database</h1>
        <nav>
          <Link to="/">Dataset</Link>
          <Link to="/profiles">Profiles</Link>
          <Link to="/recommend">Recommend</Link>
          <Link to="/evaluate">Evaluate</Link>
          <Link to="/simulate">Simulate</Link>
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSev34FK3e5MuHtQED5AUSovGEAU9l5TgxP4_w-RnEQRngIM6EDBRvzPS7WJnWKHjPrzMsl9BlCI1ly/pub?gid=133993680&single=true&output=csv"
            download
            className="header-link"
          >
            Download Dataset
          </a>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <CsvDataProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<DataTable />} />
              <Route path="/recommend" element={<Recommendations />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/evaluate" element={<EvaluateCsv />} />
              <Route path="/simulate" element={<SimulationPage />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </CsvDataProvider>
  );
}

export default App;
