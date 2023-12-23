// src/components/GitHubIssuesTable.tsx
import React from 'react';
import { GitHubIssue } from '../types';
import './GitHubIssuesTable.css';// Import the CSS file

interface GitHubIssuesTableProps {
  issues: GitHubIssue[] | null;
}

function parseDate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

const GitHubIssuesTable: React.FC<GitHubIssuesTableProps> = ({ issues }) => {
  console.log(issues, 'issues')

  // function to parse date
  
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
