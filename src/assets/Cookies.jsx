import React, { useState, useEffect } from 'react';
import './Cookies.css';

const Cookies = () => {
  const [isActive, setIsActive] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('gdprPreferences');
    if (!savedPreferences) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const savePreferences = (analytics, marketing) => {
    const preferences = {
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem('gdprPreferences', JSON.stringify(preferences));
    } catch (e) {
      console.log('Storage not available');
    }

    setIsActive(false);
    setNotification(
      analytics || marketing 
        ? 'Thank you for accepting cookies!'
        : 'Preferences saved. Only essential cookies will be used.'
    );

    document.dispatchEvent(
      new CustomEvent('gdprPreferencesSaved', { detail: preferences })
    );
  };

  const handleAcceptAll = () => {
    savePreferences(true, true);
  };

  const handleRejectAll = () => {
    savePreferences(false, false);
  };

  if (!isActive) return null;

  return (
    <>
      <div className={`overlay ${isActive ? 'active' : ''}`} />
      
      <div className={`gdpr-consent ${isActive ? 'active' : ''}`}>
        <div className="gdpr-content">
          <div className="gdpr-header">
            <h2 className="gdpr-title">Cookie Preferences</h2>
            <p className="gdpr-description">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              Please select your preferences below.
            </p>
          </div>

          <div className="gdpr-preferences">
            <div className="preference-item">
              <label className="switch">
                <input type="checkbox" checked disabled />
                <span className="slider" />
              </label>
              <span className="preference-label">Essential Cookies (Required)</span>
            </div>

            <div className="preference-item">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={analyticsChecked}
                  onChange={(e) => setAnalyticsChecked(e.target.checked)}
                />
                <span className="slider" />
              </label>
              <span className="preference-label">Analytics Cookies</span>
            </div>

            <div className="preference-item">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={marketingChecked}
                  onChange={(e) => setMarketingChecked(e.target.checked)}
                />
                <span className="slider" />
              </label>
              <span className="preference-label">Marketing Cookies</span>
            </div>
          </div>

          <div className="gdpr-actions">
            <button className="btn btn-secondary" onClick={handleRejectAll}>
              Reject All
            </button>
            <button className="btn btn-primary" onClick={handleAcceptAll}>
              Accept All
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="notification active">
          {notification}
        </div>
      )}
    </>
  );
};

export default Cookies;
