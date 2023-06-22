import Api from './Api';

const apiKey = process.env.API_KEY;

const Stock = {

    getDailyChartData: (symbol) => {
        const response = Api.getStockData(symbol);
        console.log("Response:", response);
        const timeSeriesData = response["Time Series (30min)"];
        console.log("Time Series Data:", timeSeriesData);

        return
    }

};

export default Stock;