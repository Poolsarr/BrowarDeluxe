import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BatchStatusChart = ({ batches }) => {
  const statusCounts = batches.reduce((acc, batch) => {
    acc[batch.status] = (acc[batch.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Liczba partii',
        data: Object.values(statusCounts),
        backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statusy partii' },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BatchStatusChart;
