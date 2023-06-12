import requests
import yfinance as yf

def get_info(symbol):
    stock = yf.Ticker(symbol)
    return stock.info

def get_current_price(ticker):
    stock = yf.Ticker(ticker)
    return stock.info['currentPrice']

def get_current_prices(tickers):
    stocks = yf.Tickers(' '.join(tickers))
    prices = {}
    for ticker in tickers:
        prices[ticker] = stocks.tickers[ticker].info['currentPrice']
    print(prices)
    return(prices)

def get_stock_data(symbol):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    headers = {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error accessing stock data. Status code: {response.status_code}")
        return None

