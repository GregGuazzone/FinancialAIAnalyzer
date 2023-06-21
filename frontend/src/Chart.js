import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
import Stock from './Stock';



const ChartComponent = {

    getChart: async (symbol, period) => {
        const data = Stock.getSeriesIntraday(symbol, period);
        console.log("ChartData, time series:", data.TimeSeries);
        return data;
    }
}
  
  export default ChartComponent;