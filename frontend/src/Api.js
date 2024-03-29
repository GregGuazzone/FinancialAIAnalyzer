const API_BASE_URL = 'http://127.0.0.1:5000/api';

const Api = {
  signup: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    }
  },

  login: async (formData) => {
    return fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          console.log('Access Token:', data.access_token)
          localStorage.setItem('access_token', data.access_token);
        }
        return data.status;
      })
  },

  getWatchlists: async () => {
    return fetch(`${API_BASE_URL}/watchlists_names`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true)  {
          return data.watchlists;
        }
        return data.message;
      });
      },

  getStocks: async (watchlist) => {
    return fetch(`${API_BASE_URL}/stocks/?watchlist=${watchlist}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true)  {
          console.log("Stocks:", data.stocks)
          return data.stocks;
        }
        return data.message;
      });
      },


  addWatchlist: async (watchlist) => {
    return fetch(`${API_BASE_URL}/watchlists/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(watchlist),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.status;
      });
  },

  addToWatchlist: async (watchlist, ticker) => {
    const formData = {  watchlist: watchlist, ticker: ticker };
    return fetch(`${API_BASE_URL}/watchlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.status;
      });
    },

  removeFromWatchlist: async (watchlist, ticker) => {
    const formData = {  watchlist: watchlist, ticker: ticker };
    return fetch(`${API_BASE_URL}/watchlist/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.status;
      });
  },

  getStockData: async (ticker) => {
    return fetch(`${API_BASE_URL}/data/info/?ticker=${ticker}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true)  {
          return data.data;
        }
        return data.message;
      }
      );
    },


    getFinancials: async (tickers) => {
      return fetch(`${API_BASE_URL}/data/financials/?tickers=${tickers}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === true)  {
            return data.financials;
          }
          return data.message;
        }
        );
    },


    getChartData: async (tickers, period) => {
      return fetch(`${API_BASE_URL}/data/chart/?tickers=${tickers}&period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === true)  {
            return data.chart;
            
          }
          return data.message;
        }
        );
    },


};




export default Api;