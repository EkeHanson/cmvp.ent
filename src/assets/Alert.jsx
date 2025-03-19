// src/components/Alert.js
import React, { useEffect } from 'react';
import './Alert.css'; // Ensure this file exists and has the correct styles

const Alert = ({ type, message, onClose, hidden }) => {
  useEffect(() => {
    if (!hidden) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted or if hidden changes
    }
  }, [hidden, onClose]);
  if (hidden) return null;
  return (
    <div className={`alert ${type} ${hidden ? 'hidden' : ''}`}>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Alert;

