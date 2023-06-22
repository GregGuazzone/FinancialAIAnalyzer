import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

const StockChart = ({ symbol, period }) => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/data/chart/?ticker=AAPl&period=1d`);
          const data = await response.json();
          if (data.status === true) {
            console.log('Stock Data:', data.data);
            const formattedData = {
              labels: Array.from({ length: data.data.length }, (_, i) => i + 1),
              datasets: [
                {
                  label: 'AAPL',
                  data: data.data,
                  fill: false,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgba(255, 99, 132, 0.2)',
                },
              ],
            };
            setChartData(formattedData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [symbol, period]);
  
    console.log('chartData:', chartData);
  
    if (!chartData) {
      return <p>Loading chart data...</p>;
    }
  
    return (
      <div>
        <Line data={chartData} />
      </div>
    );
  };

export default StockChart;