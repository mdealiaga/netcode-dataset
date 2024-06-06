import React, { useState } from 'react';
import { modelData } from './modelData';

const RecommendationForm = ({ onRecommend }) => {
  const initialState = Object.keys(modelData).reduce((state, key) => {
    state[key] = modelData[key].type === 'checkbox' ? false : '';
    return state;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const [showInfo, setShowInfo] = useState({});

  const toggleInfo = (key) => {
    setShowInfo(prevShowInfo => ({ ...prevShowInfo, [key]: !prevShowInfo[key] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleButtonClick = (name, value) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(modelData).map((key) => {
        const field = modelData[key];

        if (key === "combatOption" && formState.playerInteractionLevel !== "Combat") {
          return null;
        }

        return (
          <div key={key} className="form-group">
            <label>{field.label}:</label>
            {field.type === 'checkbox' ? (
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name={key}
                  checked={formState[key]}
                  onChange={handleChange}
                />
                {field.info && (
                  <button type="button" className="info-button" onClick={() => toggleInfo(key)}>?</button>
                )}
              </div>
            ) : (
              <div className="button-group">
                {field.options.map(option => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleButtonClick(key, option.value)}
                    className={formState[key] === option.value ? 'selected' : ''}
                  >
                    {option.label}
                  </button>
                ))}
                {field.info && (
                  <button type="button" className="info-button" onClick={() => toggleInfo(key)}>?</button>
                )}
              </div>
            )}
            {showInfo[key] && (
              <p dangerouslySetInnerHTML={{ __html: field.info.replace(/\n/g, '<br />') }} />
            )}
          </div>
        );
      })}
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default RecommendationForm;
