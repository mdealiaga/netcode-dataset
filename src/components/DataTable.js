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
      placeholder={`Search...`}
    />
  );
};

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

const renderCell = cell => {
  const value = cell.value;
  return <span>{renderTextWithLinks(value)}</span>;
};

const DataTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
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
          const match = key.match(/(.*?)(\s*\(.*\))?$/); // Extract main text and parenthetical comments
          const mainText = match[1];
          const comments = match[2];
          return {
            Header: (
              <div>
                <span>{mainText}</span>
                {comments && (
                  <span className="comments">{renderTextWithLinks(comments)}</span>
                )}
              </div>
            ),
            accessor: key,
            Filter: DefaultColumnFilter,
            filter: 'text',
            Cell: renderCell, 
          };
        });

        setData(processedData);
        setColumns(processedColumns);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
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
                    {renderCell(cell)}
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
