import yfinance as yf
from pandas_datareader import data as pdr
import pandas as pd


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
    prices = {}
    for ticker in tickers:
        prices[ticker] = stocks.tickers[ticker].info['currentPrice']
    return(prices)


    
def get_charts_data(symbols, period):
    print("3_Symbols:", symbols)
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


def get_historical_data(symbol):
    yf.pdr_override()
    data = pdr.get_data_yahoo(symbol, start="2017-01-01", end="2017-04-30")
    df = pd.DataFrame(data)
    df.reset_index(inplace=True)  # Reset index to bring 'Date' back as a regular column
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    df.sort_index(inplace=True)
    return df

data = get_historical_data("TSLA").fillna(0)
print(data.head())
prices = data['Close'].values.reshape(-1, 1)
#scaler = MinMaxScaler()
prices_min= np.min(prices)
prices_max= np.max(prices)
prices_scaled = (prices - prices_min) / (prices_max - prices_min)    #scaler.fit_transform(prices)

# Split the data into train and test sets
train_size = int(len(prices_scaled) * 0.8)
train_data, test_data = prices_scaled[:train_size], prices_scaled[train_size:]

# Define the function to create the LSTM model
def create_lstm_model(input_shape):
    model = Sequential()
    model.add(LSTM(64, return_sequences=True, input_shape=input_shape))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(1))
    return model

# Prepare the training data
sequence_length = 20  # Adjust this value based on the desired sequence length
X_train, y_train = [], []
for i in range(len(train_data) - sequence_length):
    X_train.append(train_data[i:i+sequence_length])
    y_train.append(train_data[i+sequence_length])
X_train, y_train = np.array(X_train), np.array(y_train)

# Create and compile the LSTM model
model = create_lstm_model((X_train.shape[1], 1))
model.compile(loss='mean_squared_error', optimizer='adam', run_eagerly=True)

# Train the LSTM model
model.fit(X_train, y_train, epochs=10, batch_size=32)

# Prepare the test data
X_test, y_test = [], []
for i in range(len(test_data) - sequence_length):
    X_test.append(test_data[i:i+sequence_length])
    y_test.append(test_data[i+sequence_length])
X_test, y_test = np.array(X_test), np.array(y_test)

# Make predictions using the trained model
predictions = model.predict(X_test)

# Denormalize the predicted prices
predictions_denormalized = scaler.inverse_transform(predictions)

# Evaluate the model
mse = np.mean((predictions_denormalized - scaler.inverse_transform(y_test)) ** 2)
print('Mean Squared Error:', mse)