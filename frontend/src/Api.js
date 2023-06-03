const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Replace with your Flask backend URL

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
        return { success: true, data };
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
        console.log('Success:', data.status);
        return data.status;
      })
  },

  getWatchlist: async () => {
    console.log("Watchlist Access Token:", localStorage.getItem('access_token'));
    return fetch(`${API_BASE_URL}/watchlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Watchlist:", data.watchlist);
        return data.watchlist;
      });

      },



};




export default Api;