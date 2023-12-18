// src/components/GitHubIssues.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import GitHubIssuesFilter from './GitHubIssuesFilter';
import GitHubIssuesTable from './GitHubIssuesTable';
import { GitHubIssuesData } from '../types';
import './GitHubIssues.css'; // Import the CSS file

const GITHUB_ISSUES_QUERY = gql`
query GetGitHubIssues($owner: String!, $repo: String!, $states: [IssueState!]) {
  repository(owner: $owner, name: $repo) {
    issues(first: 10, states: $states) {
      totalCount
      nodes {
        id
        title
        state
        labels(first: 5) {
          nodes {
            name
          }
        }
      }
    }
  }
}

`;

const GitHubIssues: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>(['OPEN']);

  const { loading, error, data, fetchMore } = useQuery<GitHubIssuesData>(GITHUB_ISSUES_QUERY, {
    variables: { owner: 'facebook', repo: 'docusaurus', states: status },
  });

  console.log('Data:', data);

  if (error) return <p>Error :(</p>;

  const totalIssues = data?.repository?.issues?.totalCount || 0;
  const openIssues = data?.repository?.issues?.nodes || [];
  const pageInfo = data?.repository?.issues?.pageInfo || {};

  const pieChartData = [
    { name: 'bug', fill: '#ff0000' },
    { name: 'enhancement', fill: '#00ff00' },
    { name: 'question', fill: '#0000ff' },
    { name: 'documentation', fill: '#ff00ff' },
    { name: 'invalid', fill: '#ffff00' },
    { name: 'wontfix', fill: '#00ffff' },
    {name: 'proposal', fill: '#ff8000'},
    {name: 'duplicate', fill: '#ff0080'},
    {name: 'good first issue', fill: '#00ff80'},
    {name: 'help wanted', fill: '#8000ff'},
    {name: 'design', fill: '#ff80ff'},
    {name: 'question', fill: '#80ff00'},
    {name: 'feature', fill: '#0080ff'},
    {name: 'performance', fill: '#ff0000'},
    {name: 'invalid', fill: '#00ff00'},
    {name: 'difficulty:easy', fill: '#0000ff'},
    {name: 'difficulty:medium', fill: '#ff00ff'},
    {name: 'difficulty:advanced', fill: '#ffff00'},



  ];

  const issues = openIssues;

  // Calculate the total number of issues per label
  const labelCounts: { [label: string]: number } = {};
  issues.forEach((issue) => {
    issue.labels.nodes.forEach((label) => {
      labelCounts[label.name] = (labelCounts[label.name] || 0) + 1;
    });
  });

  // Update pieChartData with the calculated values
  const updatedPieChartData = pieChartData?.map((entry) => ({
    ...entry,
    value: labelCounts[entry.name] || 0,
  }));

  const legendData = pieChartData.map((entry) => ({
    value: entry.name,
    type: 'rect',
    color: entry.fill,
  }));


  const fetchIssues = (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: null | string }) => {
    fetchMore({
      variables,
    });
  };

  const handlePageChange = (newCursor: string) => {
    fetchMore({
      variables: { owner: 'facebook', repo: 'docusaurus', cursor: newCursor },
    });
  };

  const renderTooltip = (props: any) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const label = payload[0].name;
      const value = payload[0].value;
      return (
        <div style={{ background: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p>{`${label}: ${value} issues`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h1>GitHub Issues</h1>
      <GitHubIssuesFilter
        labels={labels}
        setLabels={setLabels}
        setStatus={setStatus}
        fetchIssues={fetchIssues}
        owner="facebook"
        repo="docusaurus"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <GitHubIssuesTable issues={issues} />
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={updatedPieChartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {updatedPieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default GitHubIssues;
