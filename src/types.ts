import { Dispatch, SetStateAction } from "react";

export interface GitHubIssue {
  id: string;
  title: string;
  state: string;
  date: string;
  __typename: string;
  error: string;
  labels: {
    nodes: {
      name: string;
    }[];
  };
}

export interface GitHubIssuesData {
  repository: {
    __typename: string;
    name: string;
    owner: {
      __typename: string;
      login: string;
    };
    all: {
      __typename: string;
      totalCount: number;
    }
    open: {
      __typename: string;
      totalCount: number;
    }
    closed: {
      __typename: string;
      totalCount: number;
    }
    issues: {
      nodes: GitHubIssue[];
      totalCount: number;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
        startCursor: string;
        hasPreviousPage: boolean;
      };
    };
  };
}

export interface GitHubIssuesFilterProps {
  labels: string[];
  setLabels: Dispatch<SetStateAction<string[]>>;
  setStatus: Dispatch<SetStateAction<string[]>>;
  fetchIssues: (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: string | null }) => Promise<void>;
  cursor: string | null;
  setCursor: Dispatch<SetStateAction<string | null>>;
  setLoadingMore: Dispatch<SetStateAction<boolean>>;
  setIssues: Dispatch<SetStateAction<GitHubIssue[]>>;
  repo: string;
  status: string[];
  owner: string;
}

export interface GitHubIssuesPaginationProps {
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | undefined;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  loadingMore: boolean;
}

export interface GitHubIssuesTableProps {
  issues: GitHubIssue[];
}

export interface GitHubIssuesDoughnutChartProps {
    labelCounts: Record<string, number>;
}
