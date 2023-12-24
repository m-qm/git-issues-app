// GitHubIssuesPagination.tsx
import React from 'react';
import { GitHubIssuesPaginationProps } from '../types';

const GitHubIssuesPagination: React.FC<GitHubIssuesPaginationProps> = ({ pageInfo, handlePrevPage, handleNextPage, loadingMore }) => {
  console.log(pageInfo);
  return (
    <div className="button-container">
      {loadingMore && <p>Loading more...</p>}
      {pageInfo?.hasPreviousPage && (
        <button onClick={() => handlePrevPage()} disabled={false}>
          Previous Page
        </button>
      )}
      {pageInfo?.hasNextPage && (
        <button onClick={() => handleNextPage()} disabled={false}>
          Next Page
        </button>
      )}
    </div>
  );
};

export default GitHubIssuesPagination;
