import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { GitHubIssuesDoughnutChartProps } from '../types';

const GitHubIssuesDoughnutChart = ({ labelCounts }: GitHubIssuesDoughnutChartProps) => {
  const updatedDoughnutChartData = {
    labels: Object.keys(labelCounts),
    datasets: [
      {
        data: Object.values(labelCounts),
        backgroundColor: [
          '#5D6FCF',
          '#86E8A1',
          '#EF5DA8',
          '#FFC75F',
          '#FF5F5F',
          '#5D6FCF',
          '#86E8A1',
          '#EF5DA8',
          '#FFC75F',
          '#FF5F5F',
          '#5D6FCF',
        ],
        hoverOffset: 4,
        borderWidth: 0.5,
        cutout: '85%',
        spacing: 20,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    legend: {
      display: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const legendData = updatedDoughnutChartData.labels.map((label, index) => ({
    label,
    color: updatedDoughnutChartData.datasets[0].backgroundColor[index],
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '300px' }}>
      <Doughnut data={updatedDoughnutChartData} options={chartOptions} />
      <div className="legend-container">
        <div className="column">
          {legendData.slice(0, 5).map((item) => (
            <div key={item.label} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="column">
          {legendData.slice(5, 10).map((item, index) => (
            <div key={item.label} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubIssuesDoughnutChart;
