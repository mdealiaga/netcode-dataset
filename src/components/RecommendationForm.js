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
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(modelData).map((key) => {
        // Skip rendering "instantHit", "responsiveCombat", and "combatOption" by default
        if (key === "instantHit" || key === "responsiveCombat" || key === "combatOption") return null;

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
              ) : field.type === 'buttons' ? (
                <div>
                  {field.options.map(option => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleButtonClick(key, option.value)}
                      style={{
                        backgroundColor: formState[key] === option.value ? 'lightblue' : 'white',
                        border: '1px solid #ccc',
                        margin: '0 5px'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
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
        <div>
          <label>
            Combat Option:
            <select name="combatOption" value={formState.combatOption} onChange={handleChange}>
              <option value="">Select Combat Option</option>
              {modelData.combatOption.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button type="button" onClick={() => toggleInfo('combatOption')}>?</button>
          </label>
          {showInfo.combatOption && (
            <p dangerouslySetInnerHTML={{ __html: modelData.combatOption.info.replace(/\n/g, '<br />') }} />
          )}
        </div>
      )}
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

export default RecommendationForm;
