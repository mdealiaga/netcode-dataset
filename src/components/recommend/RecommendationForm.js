import React, { useState, useEffect } from 'react';
import { modelData } from './modelData';

const RecommendationForm = ({ onRecommend }) => {
  const initialState = Object.keys(modelData).reduce((state, key) => {
    state[key] = modelData[key].type === 'checkbox' ? false : '';
    return state;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const [showInfo, setShowInfo] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInfo = (key) => {
    setShowInfo(prevShowInfo => ({ ...prevShowInfo, [key]: !prevShowInfo[key] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear errors as user corrects them
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleButtonClick = (name, value) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttemptedSubmit(true); // Mark that a submit attempt was made
    if (isFormValid && !isSubmitting) {
      console.log('Model Input Parameters:', formState); // Log the model input parameters here
      setIsSubmitting(true); // Prevent multiple submissions
      onRecommend(formState);
      setIsSubmitting(false); // Reset after submission
    }
  };

  useEffect(() => {
    const newErrors = {};
    const isValid = Object.keys(modelData).every((key) => {
      if (modelData[key].type === 'checkbox') {
        return true; // Checkboxes are optional
      }
      if (key === "combatOption" && formState.playerInteractionLevel !== "Combat") {
        return true; // Combat option is only required if playerInteractionLevel is "Combat"
      }
      if (formState[key] === '') {
        newErrors[key] = 'Please select an option.';
        return false;
      }
      return true;
    });

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formState]);

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
            {attemptedSubmit && errors[key] && (
              <p className="error-message">{errors[key]}</p>
            )}
          </div>
        );
      })}
      <button type="submit" disabled={!isFormValid}>Get Recommendations</button>
    </form>
  );
};

export default RecommendationForm;
