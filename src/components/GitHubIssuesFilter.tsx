// src/components/GitHubIssuesFilter.tsx
import React, { useState } from 'react';
import './GitHubIssuesFilter.css'; // Import your CSS file for styling

interface GitHubIssuesFilterProps {
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;
  fetchIssues: (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: null | string }) => void;
  owner: string;
  repo: string;
}

const GitHubIssuesFilter: React.FC<GitHubIssuesFilterProps> = ({
  labels,
  setLabels,
  setStatus,
  fetchIssues,
  owner,
  repo,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('OPEN'); // Default status to 'OPEN'

  const handleToggleStatus = () => {
    const newStatus = selectedStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    setSelectedStatus(newStatus);
    setStatus([newStatus]); // Update the status state
    fetchIssues({ owner, repo, labels, status: [newStatus], cursor: null }); // Trigger data fetching
  };

  return (
    <div className="github-issues-filter">
      <label>
        Labels:
        <input
          type="text"
          value={labels.join(',')}
          onChange={(e) => setLabels(e.target.value.split(','))}
        />
      </label>
      <div className="status-container">
        <span>Status: {selectedStatus}</span>
        <label className="switch">
          <input type="checkbox" checked={selectedStatus === 'CLOSED'} onChange={handleToggleStatus} />
          <span className="slider round">
            <span className="status-label">Closed</span>
            <span className="status-label">Open</span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default GitHubIssuesFilter;
