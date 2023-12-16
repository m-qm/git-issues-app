// src/components/GitHubIssuesPagination.tsx
import React from 'react';

interface GitHubIssuesPaginationProps {
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  } | null;
  handlePageChange: (newCursor: string) => void;
}

const GitHubIssuesPagination: React.FC<GitHubIssuesPaginationProps> = ({ pageInfo, handlePageChange }) => {
  return (
    <div>
      {pageInfo?.hasNextPage && (
        <button onClick={() => handlePageChange(pageInfo.endCursor)} disabled={false /* Add condition based on your needs */}>
          Next Page
        </button>
      )}
    </div>
  );
};

export default GitHubIssuesPagination;
