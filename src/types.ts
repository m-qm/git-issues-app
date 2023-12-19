export interface GitHubIssue {
  id: string;
  title: string;
  state: string;
  labels: {
    nodes: {
      name: string;
    }[];
  };
}

export interface GitHubIssuesData {
  repository: {
    issues: {
      __typename: string; // Add this line
      nodes: GitHubIssue[];
      totalCount: number;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}