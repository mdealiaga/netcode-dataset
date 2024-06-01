import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTable, useSortBy, useFilters } from 'react-table';

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); 
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data.csv`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });
        setData(results.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => (data.length > 0 ? Object.keys(data[0]).map(key => ({
      Header: key,
      accessor: key,
      Filter: DefaultColumnFilter, // Use default filter UI
      filter: 'text',
    })) : []),
    [data]
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter, // Set default filter UI
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, defaultColumn }, useFilters, useSortBy);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map(cell => {
                let cellStyle = {};
                if (cell.value === 'TRUE') {
                  cellStyle = { backgroundColor: 'green', color: 'white' };
                } else if (cell.value === 'FALSE') {
                  cellStyle = { backgroundColor: 'red', color: 'white' };
                }
                return (
                  <td {...cell.getCellProps()} style={cellStyle} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
