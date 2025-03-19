import React, { useEffect } from 'react';
import './FlashMessage.css';

const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000); // Message disappears after 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div
      className="flash-message"
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)', // Centers it horizontally
        zIndex: 1000,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '90%', // Ensures it doesn't take the full width of smaller screens
        textAlign: 'center', // Centers text
      }}
    >
      {message}
    </div>
  );
};

export default FlashMessage;
