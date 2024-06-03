import React from 'react';

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
  const { displayName, tooltipField } = props;
  return (
    <div style={{ whiteSpace: 'normal', textAlign: 'left', lineHeight: '1.2' }}>
      <div>{displayName}</div>
      {tooltipField && (
        <div style={{ fontSize: '0.8em', fontWeight: 'normal', marginTop: '2px' }}>
          {renderTextWithLinks(tooltipField)}
        </div>
      )}
    </div>
  );
};

export default CustomHeader;
