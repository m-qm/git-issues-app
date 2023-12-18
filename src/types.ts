export interface GitHubIssuesData {
  repository: {
    issues: {
      nodes: GitHubIssue[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

export interface GitHubIssue {
  id: string;
  title: string;
  state: 'OPEN' | 'CLOSED'; // Add this line
  labels: {
    nodes: {
      name: string;
    }[];
  };
}
