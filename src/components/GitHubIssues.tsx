import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { gql } from 'graphql-tag';

import GitHubIssuesDoughnutChart from './GitHubIssuesDoughnut';

import GitHubIssuesFilter from './GitHubIssuesFilter';
import GitHubIssuesTable from './GitHubIssuesTable';
import { GitHubIssuesData } from '../types';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import './GitHubIssues.css'; // Import the CSS file
import GitHubIssuesPagination from './GitHubIssuesPagination';
ChartJS.register(Tooltip, Legend, ArcElement);

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
          date: createdAt
          labels(first: 5) {
            nodes {
              name
            }
          }
        }
        pageInfo {
          startCursor
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
                nodes: fetchMoreResult.repository.issues.nodes,
                pageInfo: fetchMoreResult.repository.issues.pageInfo,
              },
            },
          };
        },
      }).then((result) => {
        const newIssues = result.data?.repository?.issues?.nodes || [];
        setIssues(newIssues);
        setLoadingMore(false);
      }).catch((error) => {
        console.error('Error fetching previous page issues:', error);
        setLoadingMore(false);
      });
    }
  }, [data, fetchMore, labels, status]);

  const handleNextPage = useCallback(() => {
    if (data?.repository?.issues?.pageInfo?.hasNextPage) {
      setLoadingMore(true);
      fetchMore({
        variables: {
          owner: 'facebook',
          repo: 'react',
          states: status,
          labels: labels || [],
          cursor: data.repository.issues.pageInfo.endCursor,
        },
        updateQuery: (
          prev,
          { fetchMoreResult, error }: { fetchMoreResult?: GitHubIssuesData; error?: ApolloError }
        ) => {
          if (error) {
            console.error('Error in fetchMore:', error);
            setLoadingMore(false);
            return prev;
          }
  
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
      })
        .then((result) => {
          const newIssues = result.data?.repository?.issues?.nodes || [];
          setIssues(newIssues);
          setLoadingMore(false);
        })
        .catch((error) => {
          console.error('Error in fetchMore promise:', error);
          setLoadingMore(false);
        });
    }
  }, [data, fetchMore, labels, status]);
  
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1>Public Issues</h1>
      <div className="top-bar">
        <h2>{data?.repository?.owner?.login}/
          {data?.repository?.name}
        </h2>
        <span className="top-bar-item">{data?.repository?.all?.totalCount} issues</span>
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
                pageInfo={data?.repository?.issues?.pageInfo}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                loadingMore={loadingMore}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '300px' }}>
            <GitHubIssuesDoughnutChart labelCounts={labelCounts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubIssues;
