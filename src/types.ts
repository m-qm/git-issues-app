// src/types.ts
export interface GitHubIssue {
    id: string;
    title: string;
    labels: {
      nodes: {
        name: string;
      }[];
    };
  }
  
  export interface GitHubIssuesData {
    repository: {
      openIssues: {
        nodes: GitHubIssue[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
      closedIssues: {
        nodes: GitHubIssue[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    };
  }
  