import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { gql } from 'graphql-tag';
import { GitHubIssuesFilterProps } from '../types';


const GitHubIssuesFilter: React.FC<GitHubIssuesFilterProps & { fetchIssues: (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: string | null }) => Promise<void> }> = ({
  labels,
  setLabels,
  repo,
  owner,
  status,
  setIssues,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('OPEN');
  const client = useApolloClient();

  const handleLabelChange = (selectedLabels: string[]) => {
    setLabels(selectedLabels);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await client.query(
        {
          query: gql`
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
          `,
          variables: {
            owner,
            repo,
            states: [selectedStatus],
            labels: labels.length > 0 ? labels : null,
            cursor: null,
          },
        }
      )
        console.log(result, 'result')
      const newData = result.data; // Adjust this based on the structure of your response
      setIssues(newData.repository.issues.nodes);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Labels:
        <select
          multiple
          value={labels || []}
          onChange={(e) => handleLabelChange(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
          {labels?.map((label: string) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status:
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
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
