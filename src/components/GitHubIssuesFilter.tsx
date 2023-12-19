import React, { useState, useEffect } from 'react';

interface GitHubIssuesFilterProps {
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;
  fetchIssues: (variables: { owner: string; repo: string; labels: string[]; status: string[]; cursor: null | string }) => Promise<any>;
  owner: string;
  repo: string;
  cursor: string | null;
  status: string[];
  setCursor: React.Dispatch<React.SetStateAction<string | null>>;
  setIssues: React.Dispatch<React.SetStateAction<any[]>>; // Add this line
}

const GitHubIssuesFilter: React.FC<GitHubIssuesFilterProps> = ({
  labels,
  setLabels,
  setStatus,
  fetchIssues,
  owner,
  repo,
  cursor,
  status,
  setIssues, // Add this line
  setCursor,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('OPEN');
  const [labelOptions, setLabelOptions] = useState<string[]>([]);

  const handleLabelChange = (selectedLabels: string[]) => {
    setLabels(selectedLabels);
  };

  const renderLabelOptions = () => {
    return labelOptions.map((label: string) => (
      <option key={label} value={label}>
        {label}
      </option>
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLabels = labels.length > 0 ? labels : [];

    try {
      const data = await fetchIssues({ owner, repo, labels: updatedLabels, status: [selectedStatus], cursor: null });
      const uniqueLabelOptions = Array.from(new Set(data?.repository?.issues?.nodes.flatMap((issue: any) => issue.labels.nodes.map((label: any) => label.name))) || []) as string[];
      setLabelOptions(uniqueLabelOptions);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await fetchIssues({
          owner,
          repo,
          status,
          labels: labels.filter((label) => label.trim() !== ''),
          cursor: cursor,
        });

        const newIssues = newData?.repository?.issues?.nodes || [];
        setIssues((prevIssues: any) => [...prevIssues, ...newIssues]);

        if (newData?.repository?.issues?.pageInfo.hasNextPage) {
          setCursor(newData?.repository?.issues?.pageInfo.endCursor || null);
        } else {
          setCursor(null);
        }
      } catch (error) {
        console.error('Error fetching more issues:', error);
      }
    };

    if (cursor) {
      fetchData();
    }
  }, [cursor, fetchIssues, labels, status, setIssues, setCursor]); // Add setIssues and setCursor to dependencies


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Labels:
        <select
          multiple
          value={labels}
          onChange={(e) => handleLabelChange(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
          {renderLabelOptions()}
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
