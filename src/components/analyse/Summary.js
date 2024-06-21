import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Chart } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// Custom Plugin to Draw Confidence Interval
const ConfidenceIntervalBar = {
    id: 'confidenceIntervalBar',
    afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        chart.data.datasets.forEach((dataset) => {
            if (dataset.label === 'Confidence Interval') {
                const data = dataset.data[0];
                const xMin = x.getPixelForValue(data.x);
                const xMax = x.getPixelForValue(data.x2);
                const yPos = y.getPixelForValue(0);

                ctx.save();
                ctx.fillStyle = dataset.backgroundColor;
                ctx.strokeStyle = dataset.borderColor;
                ctx.lineWidth = dataset.borderWidth;
                ctx.fillRect(xMin, yPos - 10, xMax - xMin, 20);
                ctx.strokeRect(xMin, yPos - 10, xMax - xMin, 20);
                ctx.restore();
            }
        });
    }
};

const Summary = ({ summary, confidenceLevel, onConfidenceLevelChange }) => {
    const confidenceIntervalData = {
        labels: [''],
        datasets: [
            {
                type: 'scatter',
                label: 'Confidence Interval',
                data: [{
                    x: summary.confidenceInterval[0],
                    x2: summary.confidenceInterval[1],
                    y: 0
                }],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 0, // Remove the point for the confidence interval
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
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                },
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
            <h3>Evaluation Results</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', flexWrap: 'wrap' }}>
                <div style={{ width: '20%', textAlign: 'left' }}>
                    <p><strong>Accuracy:</strong> {summary.accuracy}%</p>
                    <p><strong>{confidenceLevel}% Confidence Interval:</strong> {summary.confidenceInterval[0]}% - {summary.confidenceInterval[1]}%</p>
                </div>
                <div style={{ width: '20%', textAlign: 'left' }}>
                    <p><strong>Total Games:</strong> {summary.total}</p>
                    <p><strong>Correct Predictions:</strong> {summary.correctPredictions}</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ width: '300px' }}>
                    <Bar data={confidenceIntervalData} options={confidenceIntervalOptions} plugins={[ConfidenceIntervalBar]} />
                </div>
                <div style={{ width: '300px' }}>
                    <Bar data={predictionData} options={predictionOptions} />
                </div>
            </div>
        </div>
    );
};

export default Summary;
