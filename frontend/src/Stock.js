const apiKey = process.env.API_KEY;

const Stock = {
    getSeriesIntraday: (symbol, interval) => {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}min&apikey=${apiKey}`;
        //const url = `${AlphaVantageURL}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data:", data);
                return data;
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }

};

export default Stock;