import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const renderTextWithLinks = text => {
  if (!text) return text; 
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).filter(Boolean).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};

const renderCell = params => {
  const value = params.value;
  return <span>{renderTextWithLinks(value)}</span>;
};

const DataTable = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSev34FK3e5MuHtQED5AUSovGEAU9l5TgxP4_w-RnEQRngIM6EDBRvzPS7WJnWKHjPrzMsl9BlCI1ly/pub?gid=2000762019&single=true&output=csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });

        const processedData = results.data.map(row => {
          const newRow = { ...row };
          delete newRow.Timestamp; 
          return newRow;
        });

        const processedColumns = Object.keys(processedData[0]).map(key => {
          const modifiedKey = key.replace(/\./g, '_'); // Replace periods with underscores
          const match = modifiedKey.match(/^(.*?)\s*(\((.*))?$/); // Updated regex
          const mainText = match ? match[1] : modifiedKey;
          const comments = match && match[2] ? match[2] : '';
          const isSourcesColumn = mainText.toLowerCase() === 'sources'; // Check if the column is "Sources"

          return {
            headerName: mainText,
            field: modifiedKey,
            width: isSourcesColumn ? 400 : 150, // Set a wider width for the "Sources" column
            cellRendererFramework: renderCell,
            filter: 'agTextColumnFilter',
            tooltipField: comments,
          };
        });

        const transformedData = processedData.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            const modifiedKey = key.replace(/\./g, '_'); // Replace periods with underscores
            newRow[modifiedKey] = row[key];
          });
          return newRow;
        });

        setRowData(transformedData);
        setColumnDefs(processedColumns);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (rowData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, minWidth: 100, filter: true }}
        pagination={true}
        paginationPageSize={10}
        domLayout='autoHeight'
      />
    </div>
  );
};

export default DataTable;
