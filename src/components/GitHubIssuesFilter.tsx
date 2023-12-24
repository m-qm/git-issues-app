import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { gql } from 'graphql-tag';
import SwitchButton from './SwitchButton';
import { GitHubIssuesFilterProps } from '../types';
import { GITHUB_ISSUES_QUERY } from './GitHubIssues';
import './GitHubIssuesFilter.css';
import { ButtonGroup, Button } from 'react-bootstrap';

const GitHubIssuesFilter: React.FC<GitHubIssuesFilterProps & { fetchIssues: (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: string | null }) => Promise<void> }> = ({
  labels,
  repo,
  owner,
  setIssues,
}) => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(labels || []); // Set all labels selected by default
  const [selectedStatus, setSelectedStatus] = useState<string>('OPEN');
  const [closedCount, setClosedCount] = useState(0);
  const [openCount, setOpenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const client = useApolloClient();

  const handleLabelChange = (selectedLabel: string) => {
    setSelectedLabels((prevLabels) => {
      const updatedLabels = prevLabels.includes(selectedLabel)
        ? prevLabels.filter((label) => label !== selectedLabel)
        : [...prevLabels, selectedLabel];


      fetchIssuesData(updatedLabels, selectedStatus);
      return updatedLabels;
    });
  };

  const fetchIssuesData = async (updatedLabels: string[], currentStatus: string) => {
    try {
      const result = await client.query({
        query: gql`
          query GetGitHubIssues($owner: String!, $repo: String!, $states: [IssueState!], $labels: [String!], $cursor: String) {
            repository(owner: $owner, name: $repo) {
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
        `,
        variables: {
          owner,
          repo,
          states: [currentStatus],
          labels: updatedLabels.length > 0 ? updatedLabels : null,
          cursor: null,
        },
      });
      const newData = result.data;
      setIssues(newData.repository.issues.nodes);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };
  
  
  const handleToggle = () => {
    const newStatus = isOpen ? 'CLOSED' : 'OPEN';
    setSelectedStatus(newStatus);
    fetchIssuesData(selectedLabels, newStatus);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const result = await client.query({
          query: GITHUB_ISSUES_QUERY,
          variables: {
            owner,
            repo,
            states: null,
          },
        });

        const data = result.data;
        const openIssuesCount = data.repository.open.totalCount;
        const closedIssuesCount = data.repository.closed.totalCount;

        setClosedCount(closedIssuesCount);
        setOpenCount(openIssuesCount);
      } catch (error) {
        console.error('Error fetching issue counts:', error);
      }
    };
    fetchCounts();
  }, [client, owner, repo]);

  return (
    <div>
      <ButtonGroup
        style={{
          flexWrap: 'wrap',
          width: '80%',
        }}
      >
        {labels?.map((label: string) => (
          <Button
            key={label}
            variant={selectedLabels.includes(label) ? 'primary' : 'outline-primary'}
            onClick={() => 
              handleLabelChange(label)
            }
            size="sm"
            role="checkbox"
            aria-checked={selectedLabels.includes(label)}
            style={{
              margin: '0.25rem',
              borderRadius: '0.25rem',
            }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>

      <SwitchButton onToggle={handleToggle} isOpen={isOpen} closedCount={closedCount} openCount={openCount} />

    </div>
  );
};

export default GitHubIssuesFilter;
