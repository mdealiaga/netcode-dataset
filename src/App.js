import React from 'react';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
      <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSf9Eob2_3ANwl3yxg89_-29koDZQMhRszy3U6HOfJ25LAr_8g/viewform"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}
        >
          Contribute Data
        </a>
        <h1 style={{ margin: 0 }}>Game Netcode Database</h1>
        <a
          href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSev34FK3e5MuHtQED5AUSovGEAU9l5TgxP4_w-RnEQRngIM6EDBRvzPS7WJnWKHjPrzMsl9BlCI1ly/pub?gid=133993680&single=true&output=csv"
          download
          style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}
        >
          <img src={`${process.env.PUBLIC_URL}/download-icon.png`} alt="Download CSV" style={{ width: '24px', height: '24px' }} />
        </a>
      </div>
      <DataTable />
    </div>
  );
}

export default App;
