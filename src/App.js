import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DataTable from './components/DataTable';
import Recommendations from './components/recommend/Recommendations';
import Profiles from './components/profiles/Profiles';
import AnalyseCsv from './components/analyse/AnalyseCsv';
import './App.css';
import { csvUrl, formUrl } from './constants';

function Header() {
  return (
    <header className="App-header">
      <div className="header-content">
        <h1 className="header-title">Game Netcode Database</h1>
      </div>
      <nav>
        <NavLink exact to="/" activeClassName="active">Home</NavLink>
        <NavLink to="/recommend" activeClassName="active">Recommendations</NavLink>
        <NavLink to="/profiles" activeClassName="active">Profiles</NavLink>
        <NavLink to="/analyse" activeClassName="active">Analyse CSV</NavLink>
        <a href={csvUrl} download className="header-link download-link">Download Dataset</a>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<DataTable />} />
            <Route path="/recommend" element={<Recommendations />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/analyse" element={<AnalyseCsv />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
