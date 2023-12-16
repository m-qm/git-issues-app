// src/components/GitHubIssuesFilter.tsx
import React from 'react';

interface GitHubIssuesFilterProps {
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  status: string[];
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;
  setCursor: React.Dispatch<React.SetStateAction<string | null>>;
  fetchMore: any; // Adjust the type based on your needs
  owner: string;
  repo: string;
}

const GitHubIssuesFilter: React.FC<GitHubIssuesFilterProps> = ({
  labels,
  setLabels,
  status,
  setStatus,
  setCursor,
  fetchMore,
  owner,
  repo,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setCursor(null);
        fetchMore({
          variables: { owner, repo, labels, status, cursor: null },
        });
      }}
    >
      <label>
        Labels:
        <input
          type="text"
          value={labels.join(',')}
          onChange={(e) => setLabels(e.target.value.split(','))}
        />
      </label>
      <label>
        Status:
        <select
          multiple
          value={status}
          onChange={(e) => setStatus(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default GitHubIssuesFilter;
