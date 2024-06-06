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

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(modelData).map((key) => {
        // Skip rendering "instantHit" and "responsiveCombat" by default
        if (key === "instantHit" || key === "responsiveCombat") return null;

        const field = modelData[key];
        return (
          <div key={key}>
            <label>
              {field.label}:
              {field.type === 'checkbox' ? (
                <>
                  <input
                    type="checkbox"
                    name={key}
                    checked={formState[key]}
                    onChange={handleChange}
                  />
                  {field.info && (
                    <button type="button" onClick={() => toggleInfo(key)}>?</button>
                  )}
                </>
              ) : (
                <select name={key} value={formState[key]} onChange={handleChange}>
                  <option value="">Select {field.label}</option>
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              )}
            </label>
            {showInfo[key] && <p>{field.info}</p>}
            <br />
          </div>
        );
      })}
      {formState.playerInteractionLevel === "Combat" && (
        <>
          <div>
            <label>
              Responsive Combat:
              <input
                type="checkbox"
                name="responsiveCombat"
                checked={formState.responsiveCombat}
                onChange={handleChange}
              />
              <button type="button" onClick={() => toggleInfo('responsiveCombat')}>?</button>
            </label>
            {showInfo.responsiveCombat && <p>{modelData.responsiveCombat.info}</p>}
          </div>
          <br />
          <div>
            <label>
              Instant Hit Detection:
              <input
                type="checkbox"
                name="instantHit"
                checked={formState.instantHit}
                onChange={handleChange}
              />
              <button type="button" onClick={() => toggleInfo('instantHit')}>?</button>
            </label>
            {showInfo.instantHit && <p>{modelData.instantHit.info}</p>}
          </div>
        </>
      )}
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default RecommendationForm;
