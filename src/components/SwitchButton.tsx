// SwitchButton.js

import React from 'react';
import './SwitchButton.css';

interface SwitchButtonProps {
    onToggle: () => void;
    isOpen: boolean;
    closedCount: number;
    openCount: number;
  }

  const SwitchButton: React.FC<SwitchButtonProps> = ({ onToggle, isOpen, closedCount, openCount }) => {
    return (
    <div className="switch-container">
      <span className={`switch-label ${isOpen ? 'active' : ''}`}>{`Closed: ${closedCount}`}</span>
      <label className="switch">
        <input type="checkbox" onChange={onToggle} checked={isOpen} />
        <span className="slider round"></span>
      </label>
      <span className={`switch-label ${!isOpen ? 'active' : ''}`}>{`Open: ${openCount}`}</span>
    </div>
  );
};

export default SwitchButton;
