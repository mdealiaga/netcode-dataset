import React from 'react';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  return (
    <div className="App">
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
      </header>
      <div className="content">
        <DataTable />
      </div>
    </div>
  );
}

export default App;
