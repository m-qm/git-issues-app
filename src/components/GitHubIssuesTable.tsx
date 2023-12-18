// src/components/GitHubIssuesTable.tsx
import React from 'react';
import { GitHubIssue } from '../types';
import './GitHubIssuesTable.css';// Import the CSS file

interface GitHubIssuesTableProps {
  issues: GitHubIssue[] | null;
}

const GitHubIssuesTable: React.FC<GitHubIssuesTableProps> = ({ issues }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        {issues?.map((issue) => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{issue.labels.nodes.map((label) => label.name).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GitHubIssuesTable;
