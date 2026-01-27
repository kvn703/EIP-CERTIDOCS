import React from 'react';
import './Tabs.css';

const Tabs = ({ activeTab, onTabChange, tabs }) => {
  const handleTabChange = (idx) => {
    // Fade out current content
    const content = document.querySelector('.tabs-content');
    if (content) {
      content.style.opacity = '0';
      setTimeout(() => {
        onTabChange(idx);
        // Fade in new content
        setTimeout(() => {
          content.style.opacity = '1';
        }, 50);
      }, 300);
    } else {
      onTabChange(idx);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`tab-btn${activeTab === idx ? ' active' : ''}`}
            onClick={() => handleTabChange(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs; 