import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Api from './Api';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbol, period }) => {
  const [chartData, setChartData] = useState(null);

  const createDatasets = (data) => {
    const prices = data.map(({y}) => y)
      return [{
        label: symbol,
        data: prices,
        fill: false,
        borderColor: 'black',
      }];
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Api.getChartData(symbol, period);
        console.log("Data:", data);
        const datasets = createDatasets(data);
        console.log("Datasets:", datasets);
        setChartData(datasets);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    labels: {
      color: 'white',
    },
    scales: {
      x: {},
    },
  };

    const data = {
      labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00','12:30','13:00','13:30','14:00','14:30','15:00', '15:30'],
      datasets: chartData,
    };

  return (
    <div className="chart-container">
      {chartData ? <Line data={data} options={options} /> : <div>Loading chart...</div>}
    </div>
  );
};

export default StockChart;
