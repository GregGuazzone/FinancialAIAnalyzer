import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Api from './Api';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbols, period }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Function to convert the chartData object into an array of datasets
    const createDatasets = (data) => {
      if (!data) return []; // Return an empty array if data is null or undefined

      return Object.entries(data).map(([symbol, values]) => {
        return {
          label: symbol,
          data: values,
          fill: false,
          borderColor: getRandomColor(), // Function to generate random color for each stock
        };
      });
    };

    // Generate a random color
    const getRandomColor = () => {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    // Fetch chart data and convert it into datasets
    const fetchData = async () => {
      try {
        // Fetch chartData using the provided symbols and period
        // Replace this with your API call or data retrieval logic
        const data = await Api.getChartData(symbols, period);

        // Convert chartData into datasets
        const datasets = createDatasets(data);

        setChartData(datasets);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();

  }, [symbols, period]);

  console.log("Chart data:", chartData);

  return (
    <div>
      {chartData !== null &&
        chartData.map((dataset) => (
          <div key={dataset.label}>
            <h3>{dataset.label}</h3>
            <Line
              data={{
                labels: Array.from({ length: dataset.data.length }).map((_, index) => `${index * 30} min`), // Example: ['0 min', '30 min', '60 min', ...]
                datasets: [dataset],
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default StockChart;
