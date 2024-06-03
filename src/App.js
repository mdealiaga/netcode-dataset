import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import DataTable from './components/DataTable';
import Recommendations from './components/Recommendations';
import './App.css';

function Header() {
  const location = useLocation();

  // Conditionally render the header based on the current route
  if (location.pathname === '/recommend') {
    return null;
  }

  return (
    <header className="App-header">
      <div className="header-content">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSf9Eob2_3ANwl3yxg89_-29koDZQMhRszy3U6HOfJ25LAr_8g/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
        >
          Contribute Data
        </a>
        <h1 className="header-title">Game Netcode Database</h1>
        <a
          href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSev34FK3e5MuHtQED5AUSovGEAU9l5TgxP4_w-RnEQRngIM6EDBRvzPS7WJnWKHjPrzMsl9BlCI1ly/pub?gid=133993680&single=true&output=csv"
          download
          className="header-link"
        >
          <img src={`${process.env.PUBLIC_URL}/download-icon-white.png`} alt="Download CSV" className="download-icon" />
        </a>
      </div>
      <nav>
        {/* <Link to="/">Home</Link>
        <Link to="/recommend">Recommendations</Link> */}
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
