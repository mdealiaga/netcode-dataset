import React, { useContext, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import CustomHeader from './CustomHeader';
import CustomCell from './CustomCell';
import { CsvDataContext } from '../CsvDataContext';

const DataTable = () => {
  const { csvData, loading, error } = useContext(CsvDataContext);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    if (csvData) {
      const processedData = csvData.map(row => {
        const newRow = { ...row };
        delete newRow.Timestamp;
        return newRow;
      });

      const processedColumns = Object.keys(processedData[0]).map(key => {
        const modifiedKey = key.replace(/\./g, '_');
        const match = key.match(/^(.*?)\s*\((.*)\)?$/);
        const mainText = match ? match[1] : key;
        const comments = match && match[2] ? match[2] : '';
        const isSourcesColumn = mainText.toLowerCase() === 'sources';

        return {
          headerName: mainText,
          field: modifiedKey,
          width: isSourcesColumn ? 600 : 200,
          minWidth: isSourcesColumn ? 400 : 200,
          cellRenderer: isSourcesColumn ? CustomCell : undefined,
          cellClass: isSourcesColumn ? 'auto-height-cell' : '',
          filter: 'agTextColumnFilter',
          headerComponent: CustomHeader,
          headerComponentParams: { displayName: mainText, comments: comments },
          autoHeight: isSourcesColumn,
          cellClassRules: {
            'cell-true': params => params.value === 'TRUE',
            'cell-false': params => params.value === 'FALSE'
          },
        };
      });

      const transformedData = processedData.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
          const modifiedKey = key.replace(/\./g, '_');
          newRow[modifiedKey] = row[key];
        });
        return newRow;
      });

      setRowData(transformedData);
      setColumnDefs(processedColumns);
    }
  }, [csvData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (rowData.length === 0) {
    return <div>No data available</div>;
  }

  const pageSizeOptions = [10, 25, 50, 100, 1000];

  return (
    <div className="ag-theme-quartz-dark" style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, minWidth: 200, filter: true, sortable: true }}
        pagination={true}
        paginationPageSize={25}
        paginationPageSizeSelector={pageSizeOptions}
        domLayout='autoHeight'
        headerHeight={100}
        frameworkComponents={{
          customHeader: CustomHeader,
          customCell: CustomCell,
        }}
      />
    </div>
  );
};

export default DataTable;
