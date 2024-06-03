import React, { useState, useEffect } from 'react';

const renderTextWithLinks = text => {
  if (!text) return text;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).filter(Boolean).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
          {part}
        </a>
      );
    }
    return part;
  });
};

const CustomHeader = props => {
  const { displayName, comments, enableSorting, enableMenu, showColumnMenu, column, columnApi } = props;
  const [sortOrder, setSortOrder] = useState(null); // Initial sort order is none

  useEffect(() => {
    // Update sortOrder state when sort state changes
    const updateSortOrder = () => {
      const allColumns = columnApi.getAllColumns();
      const currentColumn = allColumns.find(col => col.getColId() === column.getColId());
      const sortState = currentColumn.getSort();
      setSortOrder(sortState || null);
    };

    props.api.addEventListener('sortChanged', updateSortOrder);
    return () => {
      props.api.removeEventListener('sortChanged', updateSortOrder);
    };
  }, [props.api, column, columnApi]);

  const onSortRequested = event => {
    event.stopPropagation();
    const newSortOrder = sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc';
    columnApi.applyColumnState({
      state: [
        { colId: column.getColId(), sort: newSortOrder }
      ],
      applyOrder: false, // Ensure column order is not affected
    });
    setSortOrder(newSortOrder);
  };

  const onMenuClicked = event => {
    event.stopPropagation();
    showColumnMenu(event.currentTarget);
  };

  const renderSortIcon = () => {
    if (!enableSorting) return null;
    if (sortOrder === 'asc') return '▲';
    if (sortOrder === 'desc') return '▼';
    return '⇵'; // Default unsorted state icon
  };

  return (
    <div style={{ whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.2' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{displayName}</span>
        {enableSorting && (
          <span onClick={onSortRequested} style={{ cursor: 'pointer', padding: '0 4px', marginLeft: 'auto' }}>
            {renderSortIcon()}
          </span>
        )}
        {enableMenu && (
          <span onClick={onMenuClicked} className="ag-header-icon ag-header-cell-menu-button" role="button" style={{ cursor: 'pointer' }}>
            ☰
          </span>
        )}
      </div>
      {comments && (
        <div style={{ fontSize: '0.8em', fontWeight: 'normal', marginTop: '2px' }}>
          {renderTextWithLinks(comments)}
        </div>
      )}
    </div>
  );
};

export default CustomHeader;
