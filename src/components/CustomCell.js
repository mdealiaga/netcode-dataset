import React from 'react';

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

const CustomCell = ({ value }) => {
  return (
    <div style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {renderTextWithLinks(value)}
    </div>
  );
};

export default CustomCell;
