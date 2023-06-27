import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const StockChart = ({ symbols, period }) => {
  const [chartData, setChartData] = useState(null);

  console.log("Symbols:", symbols);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/data/chart/?tickers=${symbols.join(',')}&period=${period}`);
        const data = await response.json();
        console.log("API Response:", data)
        if (data.status === true) {
          setChartData(data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [symbols, period]);

  console.log("Chart Data:", chartData);

  return (
    <div>
      {symbols.map((symbol, index) => (
        <div key={index}>
          <h3>{symbol}</h3>
          <Line data={chartData[symbol]} />
        </div>
      ))}
    </div>
  );
};

export default StockChart;
