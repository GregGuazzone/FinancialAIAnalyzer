import yfinance as yf
import numpy as np
from pandas_datareader import data as pdr
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential, load_model
from keras.layers import LSTM, Dense, Dropout
import tensorflow as tf

tf.compat.v1.disable_eager_execution()

yf.pdr_override()
df = pdr.get_data_yahoo("TSLA", start="2017-01-01", end="2023-04-30")
last_date = pd.to_datetime(df[-1:].index[0])
df = df['Open'].values.reshape(-1, 1)

dataset_train = np.array(df[:int(df.shape[0]*0.8)])
dataset_test = np.array(df[int(df.shape[0]*0.8):])
print(dataset_train.shape)
print(dataset_test.shape)

scaler = MinMaxScaler(feature_range=(0,1))
dataset_train = scaler.fit_transform(dataset_train)

dataset_test = scaler.transform(dataset_test)
print(dataset_train[:5])

def create_dataset(df):
    x = []
    y = []
    for i in range(50, df.shape[0]):
        x.append(df[i-50:i, 0])
        y.append(df[i, 0])
    x = np.array(x)
    y = np.array(y)
    return x, y

x_train, y_train = create_dataset(dataset_train)
x_test, y_test = create_dataset(dataset_test)

model = Sequential()
model.add(LSTM(units=96, return_sequences=True, input_shape=(x_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(units=96, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=96, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(units=96))
model.add(Dropout(0.2))
model.add(Dense(units=1))

print(x_train.shape)
print(x_test.shape)

x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

model.compile(loss='mean_squared_error', optimizer='adam')

model.fit(x_train, y_train, epochs=50, batch_size=20)
model.save("price_prediction.h5")

model = load_model("price_prediction.h5")

# Predict the next one-month prices
x_future = x_test[-1:, :, :]
predictions = []
for _ in range(60):  # Predict one month (30 days)
    prediction = model.predict(x_future)
    x_future = np.append(x_future[:, 1:, :], [[[prediction[0][0]]]], axis=1)
    predictions.append(prediction[0][0])

predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

# Calculate the last date in the dataset

date_range = pd.date_range(start=last_date + pd.DateOffset(1), periods=60)

# Create a DataFrame to hold the predicted prices
predicted_df = pd.DataFrame({'Date': date_range, 'Predicted Price': predictions.flatten()})
predicted_df.set_index('Date', inplace=True)

print(predicted_df)
plt.plot(predicted_df)
plt.show()