  import React, { useState, useEffect } from 'react';
  import { Form } from 'react-bootstrap';

  function AutoCompleteInput({ label, name, value, onChange, options, getOptionLabel, disabled }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      if (value.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filtered = options.filter(option =>
        getOptionLabel(option).toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    }, [value, options, getOptionLabel]);

    const handleSelect = (selected) => {
      onChange({ target: { name, value: selected } });
      setShowSuggestions(false);
    };

    const handleFocus = () => {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleBlur = () => {
      // Delay to allow clicking a suggestion before hiding
      setTimeout(() => setShowSuggestions(false), 150);
    };

    return (
      <Form.Group className="mb-3" style={{ position: 'relative' }}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={`Enter ${label}`}
          autoComplete="off"
          disabled={disabled}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ced4da',
            width: '100%',
            maxHeight: '150px',
            overflowY: 'auto',
          }}>
            {suggestions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(getOptionLabel(option))}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
              >
                {getOptionLabel(option)}
              </div>
            ))}
          </div>
        )}
      </Form.Group>
    );
  }

  export default AutoCompleteInput;
