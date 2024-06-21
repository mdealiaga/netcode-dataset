// CsvDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { csvUrl } from '../constants';

export const CsvDataContext = createContext();

export const CsvDataProvider = ({ children }) => {
  const [csvData, setCsvData] = useState(null);
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

        setCsvData(results.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CsvDataContext.Provider value={{ csvData, loading, error }}>
      {children}
    </CsvDataContext.Provider>
  );
};
