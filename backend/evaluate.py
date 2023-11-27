import numpy as np
import pandas as pd
import yfinance as yf

class evaluate:
    def __init__(self, holdings, risk_free_rate=0.02):
        self.holdings = holdings
        requested_tickers = ' '.join(self.holdings.keys())
        self.ytickers = yf.Tickers(requested_tickers);
        self.stocks = stocks(self.ytickers, self.holdings)
        print(self.stocks.metrics(risk_free_rate))

class stocks:
    def __init__(self, ytickers, holdings):
        self.ystocks = ytickers
        self.holdings = holdings
        self.stocks_dict = {}

        total_value = 0
        for ticker in self.holdings.keys():
            price = self.ystocks.tickers[ticker].info['currentPrice']
            total_value += price * self.holdings[ticker]

        for ticker in self.ystocks.tickers:
            price = self.ystocks.tickers[ticker].info['currentPrice']
            weight = (price * self.holdings[ticker]) / total_value
            info = self.ystocks.tickers[ticker].info
            info['weight'] = weight
            self.stocks_dict[ticker] = info

    def metrics(self, risk_free_rate):
        portfolio_returns = pd.Series(dtype=float)

        for ticker in self.stocks_dict.keys():
            data = self.ystocks.tickers[ticker].history(period="1y")
            data['Return'] = data['Close'].pct_change()
            
            if portfolio_returns.empty:
                portfolio_returns = data['Return'] * self.stocks_dict[ticker]['weight']
            else:
                portfolio_returns += data['Return'] * self.stocks_dict[ticker]['weight']

        benchmark_data = yf.Ticker('^GSPC').history(period="1y") #Get S&P 500 data
        benchmark_data['Return'] = benchmark_data['Close'].pct_change()
        benchmark_returns = benchmark_data['Return']

        mean_return = portfolio_returns.mean()
        std_dev = portfolio_returns.std()
        sharpe_ratio = mean_return / std_dev

        covar = portfolio_returns.cov(benchmark_returns)
        var = benchmark_returns.var()
        beta = covar / var

        excess_return = mean_return - risk_free_rate
        treynor_ratio = excess_return / beta

        cumulative_returns = (1 + portfolio_returns).cumprod()
        running_max = cumulative_returns.cummax()
        drawdowns = (cumulative_returns - running_max) / running_max
        max_drawdown = drawdowns.min()

        return {
            "Mean Return": mean_return,
            "Standard Deviation": std_dev,
            "Sharpe Ratio": sharpe_ratio,
            "Beta": beta,
            "Treynor Ratio": treynor_ratio,
            "Maximum Drawdown": max_drawdown,
        }

holdings = {'AAPL': 50, 'MSFT': 30, 'TSLA': 20}
evaluate(holdings, risk_free_rate=0.02)