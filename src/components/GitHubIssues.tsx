import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GitHubIssuesFilter from './GitHubIssuesFilter';
import GitHubIssuesTable from './GitHubIssuesTable';
import { GitHubIssuesData } from '../types';
import './GitHubIssues.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import GitHubIssuesPagination from './GitHubIssuesPagination';
ChartJS.register(ArcElement, Tooltip, Legend);

export const GITHUB_ISSUES_QUERY = gql`
  query GetGitHubIssues($owner: String!, $repo: String!, $states: [IssueState!], $labels: [String!], $cursor: String) {
    repository(owner: $owner, name: $repo) {
      name
      owner {
        login
      }
      all:issues {
        totalCount
      }
      closed:issues(states:CLOSED) {
        totalCount
      }
      open:issues(states:OPEN) {
        totalCount
      }
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
  const [issues, setIssues] = useState<GitHubIssuesData['repository']['issues']['nodes']>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { loading, error, data, fetchMore } = useQuery<GitHubIssuesData>(GITHUB_ISSUES_QUERY, {
    variables: {
      owner: 'facebook',
      repo: 'react',
      states: status,
      labels: labels.length > 0 ? labels : null,
      cursor: null,
    },
  });
  useEffect(() => {
    if (!loading && data) {
      const initialIssues = data.repository?.issues?.nodes || [];
      setIssues(initialIssues);
    }
  }, [loading, data]);

  const openIssues = data?.repository?.issues?.nodes || [];

  const labelCounts: { [label: string]: number } = {};
  openIssues.forEach((issue) => {
    issue.labels.nodes.forEach((label: any) => {
      labelCounts[label.name] = (labelCounts[label.name] || 0) + 1;
    });
  });


  const handlePrevPage = useCallback(() => {
    if (data?.repository?.issues?.pageInfo?.hasPreviousPage) {
      setLoadingMore(true);

      fetchMore({
        variables: {
          owner: 'facebook',
          repo: 'react',
          states: status,
          labels: labels || [],
          cursor: data.repository.issues.pageInfo.startCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            repository: {
              ...prev.repository,
              issues: {
                ...prev.repository.issues,
                nodes: [...fetchMoreResult.repository.issues.nodes, ...prev.repository.issues.nodes],
                pageInfo: fetchMoreResult.repository.issues.pageInfo,
              },
            },
          };
        },
      }).then((result) => {
        const newIssues = result.data?.repository?.issues?.nodes || [];
        setIssues([...newIssues, ...issues]);
        setLoadingMore(false);
      }).catch((error) => {
        console.error('Error fetching previous page issues:', error);
        setLoadingMore(false);
      });
    }
  }, [data, fetchMore, labels, issues, status]);

  const handlePageChange = useCallback((cursor: string) => {
    fetchMore({
      variables: {
        owner: 'facebook',
        repo: 'react',
        states: status,
        labels: labels || [],
        cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          repository: {
            ...prev.repository,
            issues: {
              ...prev.repository.issues,
              nodes: fetchMoreResult.repository.issues.nodes,
              pageInfo: fetchMoreResult.repository.issues.pageInfo,
            },
          },
        };
      },
    }).then((result) => {
      const newIssues = result.data?.repository?.issues?.nodes || [];
      setIssues(newIssues);
    }).catch((error) => {
      console.error('Error fetching issues:', error);
    });
  }
    , [fetchMore, labels, status]);

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

  if (error) return <p>Error: {error.message}</p>;
  console.log('issues', issues)
  return (
    <div>
      <h1>Public Issues</h1>
      <div className="top-bar">
        <h2>{data?.repository?.owner?.login}/
          {data?.repository?.name}
        </h2>
        <span className="top-bar-item">{data?.repository?.issues?.totalCount} issues</span>
      </div>

      <GitHubIssuesFilter
        labels={labelCounts ? Object.keys(labelCounts) : []}
        setLabels={setLabels}
        setStatus={setStatus}
        cursor={cursor}
        fetchIssues={async (variables) => {
          await fetchMore({
            variables: {
              owner: variables.owner,
              repo: variables.repo,
              states: variables.status,
              labels: variables.labels || [],
              cursor: variables.cursor,
            },
          });
        }}
        status={status}
        setCursor={setCursor}
        owner="facebook"
        repo="react"
        setIssues={setIssues}
        setLoadingMore={setLoadingMore}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="github-issues-container">
          <div className="github-issues-left-container">
            <GitHubIssuesTable issues={issues} />
            <div className="github-issues-container">
              <GitHubIssuesPagination
                pageInfo={data?.repository?.issues?.pageInfo} handlePageChange={handlePageChange}
                handlePrevPage={handlePrevPage}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '300px' }}>
            <Pie data={updatedPieChartData} options={chartOptions} />
            <div className="legend-container">
              <div className="column">
                {legendData.slice(0, 5).map((item) => (
                  <div key={item.label} className="legend-item">
                    <span className="legend-color" style={
                      { backgroundColor: item.color }
                    }></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="column">
                {legendData.slice(5, 10).map((item, index) => (
                  <div key={item.label} className="legend-item">
                    <span className="legend-color"
                    style={
                      { backgroundColor: item.color }
                    }
                    ></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default GitHubIssues;
