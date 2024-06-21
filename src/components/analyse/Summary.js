import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Summary = ({ summary }) => {
  const confidenceIntervalData = {
    labels: [''],
    datasets: [
      {
        type: 'bar',
        label: 'Confidence Interval',
        data: [summary.confidenceInterval[1] - summary.confidenceInterval[0]],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      {
        type: 'scatter',
        label: 'Accuracy',
        data: [{ x: summary.accuracy, y: 0 }],
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 5,
      },
    ],
  };

  const confidenceIntervalOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Accuracy with Confidence Interval',
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
      },
      point: {
        radius: 5,
      },
    },
  };

  const predictionData = {
    labels: ['Correct Predictions', 'Incorrect Predictions'],
    datasets: [
      {
        label: '# of Predictions',
        data: [summary.correctPredictions, summary.incorrectPredictions],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const predictionOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Prediction Accuracy',
      },
    },
  };

  return (
    <div>
      <h3>Summary</h3>
      <p>Total Games: {summary.total}</p>
      <p>Correct Predictions: {summary.correctPredictions}</p>
      <p>Accuracy: {summary.accuracy}%</p>
      <p>95% Confidence Interval: {summary.confidenceInterval[0]}% - {summary.confidenceInterval[1]}%</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '100px' }}>
        <div style={{ width: '20%' }}>
          <Bar data={confidenceIntervalData} options={confidenceIntervalOptions} />
        </div>
        <div style={{ width: '20%' }}>
          <Bar data={predictionData} options={predictionOptions} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
