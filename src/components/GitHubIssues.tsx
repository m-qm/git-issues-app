// src/components/GitHubIssues.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import GitHubIssuesFilter from './GitHubIssuesFilter';
import GitHubIssuesTable from './GitHubIssuesTable';
import GitHubIssuesPagination from './GitHubIssuesPagination';
import { GitHubIssuesData, GitHubIssue, IssueState } from '../types';
import { accessToken } from '../config';

const GITHUB_ISSUES_QUERY = gql`
  query GetGitHubIssues($owner: String!, $repo: String!, $labels: [String!], $status: [IssueState!], $cursor: String) {
    repository(owner: $owner, name: $repo) {
      openIssues: issues(first: 5, after: $cursor, states: $status, filterBy: { labels: $labels }) {
        nodes {
          id
          title
          labels(first: 5) {
            nodes {
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      closedIssues: issues(first: 5, after: $cursor, states: [CLOSED], filterBy: { labels: $labels }) {
        nodes {
          id
          title
          labels(first: 5) {
            nodes {
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const pieChartData = [
  { name: 'Label 1', value: 10, fill: '#0088FE' },
  { name: 'Label 2', value: 20, fill: '#00C49F' },
  { name: 'Label 3', value: 15, fill: '#FFBB28' },
  { name: 'Label 4', value: 25, fill: '#FF8042' },
  { name: 'Label 5', value: 30, fill: '#AF19FF' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const GitHubIssues: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<IssueState[]>(['OPEN']);
  const [cursor, setCursor] = useState<string | null>(null);

  // add a try catch block to handle errors
  const { loading, error, data, fetchMore } = useQuery<GitHubIssuesData>(GITHUB_ISSUES_QUERY, {
    variables: { owner: 'facebook', repo: 'react', labels, status, cursor },
    context: {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error {error.message}</p>;

  const openIssues = data?.repository.openIssues.nodes || [];
  const closedIssues = data?.repository.closedIssues.nodes || [];
  const pageInfo = data?.repository.openIssues.pageInfo || {};

  const issues = openIssues; // Assuming you want to display open issues by default

  const handlePageChange = (newCursor: string) => {
    setCursor(newCursor);
    fetchMore({
      variables: { owner: 'facebook', repo: 'react', labels, status, cursor: newCursor },
    });
  };

  return (
    <div>
      <h1>GitHub Issues</h1>
      <GitHubIssuesFilter
        labels={labels}
        setLabels={setLabels}
        status={status}
        setStatus={setStatus}
        setCursor={setCursor}
        fetchMore={fetchMore}
        owner="facebook"
        repo="react"
      />
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <GitHubIssuesPagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
    </div>
  );
};

export default GitHubIssues;
