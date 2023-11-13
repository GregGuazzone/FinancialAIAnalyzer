import yfinance as yf

class request:
    def __init__(self, stocks):
        self.stocks = stocks
        requested_stocks = ' '.join(self.stocks)
        self.tickers = yf.Tickers(requested_stocks);

    def metrics(self):
        for ticker in self.stocks:
            print(ticker, self.tickers.tickers[ticker].info['']);
