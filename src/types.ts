import { OperationVariables, UpdateQueryOptions, ApolloQueryResult } from "@apollo/client";
import { DocumentNode } from "graphql";
import { Dispatch, SetStateAction } from "react";

export interface GitHubIssue {
  id: string;
  title: string;
  state: string;
  date: string;
  __typename: string;
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

type TFetchVars = {
  owner: string;
  repo: string;
  labels: string[];
  states: string[];
  cursor: string | null;
};

type FetchMoreQueryOptions<TFetchVars extends OperationVariables, TFetchData> = {
  query?: DocumentNode; // The GraphQL query document
  variables?: TFetchVars; // Variables used in the query
  context?: Record<string, any>; // Context passed to the link chain
  updateQuery?: (previousQueryResult: TFetchData, options: UpdateQueryOptions<TFetchVars>) => TFetchData; // Update function for the query result
};

type TFetchData = {
  repository: {
    __typename: string;
    owner: string;
    issues: {
      nodes: GitHubIssue[];
      totalCount: number;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
};

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
  handlePageChange: (newCursor: string) => void;
  handlePrevPage: () => void;
}
