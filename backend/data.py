import requests
import yfinance as yf
'''
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
# Bring in streamlit for UI/app interface
import streamlit as st

# Import PDF document loaders...there's other ones as well!
from langchain.document_loaders import PyPDFLoader
# Import chroma as the vector store 
from langchain.vectorstores import Chroma

# Import vector store stuff
from langchain.agents.agent_toolkits import (
    create_vectorstore_agent,
    VectorStoreToolkit,
    VectorStoreInfo
)

'''

def get_info(symbol):
    stock = yf.Ticker(symbol)
    return stock.info

def valid_ticker(ticker):
    try:
        stock = yf.Ticker(ticker)
        stock_info = stock.info
        if 'currentPrice' in stock_info and stock_info['currentPrice'] is not None:
            return True
        else:
            return False
    except requests.exceptions.HTTPError as e:
        print(f"Error accessing stock data. HTTP error: {e.response.status_code}")
        return False

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

def get_chart_data(symbol, period):
    if period == '1d':
        interval = '30m'
    elif period == '1wk':
        interval = '90m'
    elif period == '1mo':
        interval = '1d'
    elif period == '3mo':
        interval = '5d'
    data = yf.download(symbol, period=period, interval=interval)
    print("data:", data)
    open_prices = data['Open'].tolist()
    print(open_prices)
    return open_prices

    
def get_charts_data(symbols, period):
    print("Symbols:", symbols)
    if period == '1d':
        interval = '30m'
    elif period == '1wk':
        interval = '90m'
    elif period == '1mo':
        interval = '1d'
    elif period == '3mo':
        interval = '5d'
    data = yf.download(symbols, period=period, interval=interval)
    open_prices = {}
    for symbol in symbols:
        open_prices[symbol] = data['Open'][symbol].tolist()
    return open_prices
