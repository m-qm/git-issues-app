// src/components/GitHubIssuesTable.tsx
import React from 'react';
import { GitHubIssuesTableProps } from '../types';
import './GitHubIssuesTable.css';

function parseDate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

const GitHubIssuesTable: React.FC<GitHubIssuesTableProps> = ({ issues }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        {issues?.map((issue) => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{parseDate(issue.date)}</td>
            <td>{issue.labels.nodes.map((label) => label.name).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GitHubIssuesTable;
