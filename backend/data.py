import yfinance as yf
from datetime import datetime, timedelta
from pandas_datareader import data as pdr
import pandas_datareader.data as web
import pandas as pd
import requests
import json


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
    print("1_Tickers:", tickers)
    stocks = yf.Tickers(' '.join(tickers))
    print("2_Stocks:", stocks)
    prices = {}
    for ticker in tickers:
        prices[ticker] = stocks.tickers[ticker].info['currentPrice']
    return(prices)

def get_chart_data(symbols, period):
    tickers = ' '.join(symbols)
    print("Symbols:", symbols)
    if period == '1d':
        interval = '30m'
    elif period == '1w':
        interval = '90m'
    elif period == '1m':
        interval = '1d'
    elif period == '3m':
        interval = '5d'
    data = yf.download(tickers, period=period, interval=interval)
    for symbol in symbols:
        data[f'{symbol}'] = data['Open'][f'{symbol}'].fillna(method='ffill')
    chart_data = {
        symbol: list(data['Open'][symbol].values)
        for symbol in symbols
    }
    return json.dumps(chart_data)


def get_historical_data(symbol):
    yf.pdr_override()
    data = pdr.get_data_yahoo(symbol, start="2017-01-01", end="2017-04-30")
    df = pd.DataFrame(data)
    df.reset_index(inplace=True)  # Reset index to bring 'Date' back as a regular column
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    df.sort_index(inplace=True)
    return df

def get_financials(tickers):
    print("Tickers:", tickers)
    stocks = yf.Tickers(' '.join(tickers))
    print("Stocks:", stocks)
    info = {}
    for ticker in tickers:
        info[ticker] = stocks.tickers[ticker].info
    return(info)