import React from 'react';

const CustomHeader = props => {
  const { displayName, tooltipField } = props;
  return (
    <div style={{ whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.2' }}>
      <div>{displayName}</div>
      {tooltipField && (
        <div style={{ fontSize: '0.8em', fontWeight: 'normal', marginTop: '2px' }}>
          {tooltipField}
        </div>
      )}
    </div>
  );
};

export default CustomHeader;
