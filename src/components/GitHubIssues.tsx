// src/components/GitHubIssues.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import GitHubIssuesFilter from './GitHubIssuesFilter';
import GitHubIssuesTable from './GitHubIssuesTable';
import { GitHubIssuesData } from '../types';
import './GitHubIssues.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
ChartJS.register(ArcElement, Tooltip, Legend);

const GITHUB_ISSUES_QUERY = gql`
  query GetGitHubIssues($owner: String!, $repo: String!, $states: [IssueState!], $labels: [String!], $cursor: String) {
    repository(owner: $owner, name: $repo) {
      issues(first: 10, states: $states, labels: $labels, after: $cursor) {
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
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const GitHubIssues: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>(['OPEN']);
  const [cursor, setCursor] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, error, data, refetch, fetchMore } = useQuery<GitHubIssuesData>(GITHUB_ISSUES_QUERY, {
    variables: {
      owner: 'facebook',
      repo: 'react',
      states: status,
      labels: labels.length > 0 ? labels : null,
      cursor: null,
    },
  });

  if (error) return <p>Error :(</p>;

  const openIssues = data?.repository?.issues?.nodes || [];
  const fetchedIssues = cursor ? openIssues : issues;

  const labelCounts: { [label: string]: number } = {};
  fetchedIssues.forEach((issue) => {
    issue.labels.nodes.forEach((label: any) => {
      labelCounts[label.name] = (labelCounts[label.name] || 0) + 1;
    });
  });

  const updatedPieChartData = {
    labels: Object.keys(labelCounts),
    datasets: [
      {
        data: Object.values(labelCounts),
        backgroundColor: [
          '#5D6FCF',
          '#86E8A1',
          '#EF5DA8',
          '#FFC75F',
          '#FF5F5F',
          '#5D6FCF',
          '#86E8A1',
          '#EF5DA8',
          '#FFC75F',
          '#FF5F5F',
          '#5D6FCF',
        ],
      },
    ],
  };

  const handlePageChange = () => {
    if (data?.repository?.issues?.pageInfo.hasNextPage && !loadingMore) {
      setLoadingMore(true);
      setCursor(data?.repository?.issues?.pageInfo.endCursor || null);
    }
  };

  const fetchMoreIssues = async () => {
    try {
      const result = await fetchMore({
        variables: {
          owner: 'facebook',
          repo: 'react',
          status,
          labels: labels.filter((label) => label.trim() !== ''),
          cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
  
          const newIssues = fetchMoreResult.repository.issues.nodes;
          const pageInfo = fetchMoreResult.repository.issues.pageInfo;
  
          return {
            repository: {
              __typename: prev.repository.__typename,
              issues: {
                __typename: prev.repository.issues.__typename,
                nodes: [...prev.repository.issues.nodes, ...newIssues],
                pageInfo,
              },
            },
          };
        },
      });
  
      if (!result.data.repository.issues.pageInfo.hasNextPage) {
        setCursor(null);
      } else {
        setCursor(result.data.repository.issues.pageInfo.endCursor);
      }
    } catch (error) {
      console.error('Error fetching more issues:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (cursor) {
      fetchMoreIssues();
    }
  }, [cursor, fetchMoreIssues, labels, status]);

  const chartOptions = {
    legend: {
      display: false, // Disable default legend
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const legendData = updatedPieChartData.labels.map((label, index) => ({
    label,
    color: updatedPieChartData.datasets[0].backgroundColor[index],
  }));

  return (
    <div>
      <h1>GitHub Issues</h1>
      <GitHubIssuesFilter
        labels={labels}
        setLabels={setLabels}
        setStatus={setStatus}

        cursor={cursor}
        status={status}
        setCursor={setCursor}
        fetchIssues={fetchMoreIssues}
        owner="facebook"
        repo="react"
        setIssues={setIssues}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="github-issues-container">
          <GitHubIssuesTable issues={issues} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Pie data={updatedPieChartData} options={chartOptions} />
          </div>
          <div className="legend-container">
            {legendData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                <span className="legend-label">{item.label}</span>
              </div>
            ))}
          </div>
          {data?.repository?.issues?.pageInfo.hasNextPage && (
            <button onClick={() => handlePageChange()}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubIssues;
