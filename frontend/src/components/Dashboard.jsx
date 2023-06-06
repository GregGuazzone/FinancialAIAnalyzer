import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlist, setNewWatchlist] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState('');
  const [newStock, setNewStock] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getWatchlists = async () => {
      const response = await Api.getWatchlists();
      console.log("Response:", response)
      setLoading(false);
      setWatchlists(response);
      if (response.length > 0) {
        setSelectedWatchlist(response[0]);
      }
    };
    getWatchlists();
  }, []);

  const handleAddWatchlist = () => {
    // Assuming you have an API function to add a watchlist
    Api.addWatchlist()
      .then((response) => {
        setWatchlists([...watchlists, response]);
        setSelectedWatchlist(response);
      })
      .catch((error) => {
        console.error('Error adding watchlist:', error);
      });
  };


  const handleAddStock = () => {
    // Assuming you have an API function to add a stock to the selected watchlist
    Api.addToWatchlist(selectedWatchlist, newStock)
      .then(() => {
        setNewStock('');
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

    return (
      <div className="dashboard-container flex flex-col items-stretch min-w-screen justify-center h-screen bg-bluegrey-500 w-screen">
        <div className="text-2xl font-bold mb-4 text-white top-0">Dashboard</div>
        <div>
          {loading ? (
            <p className="text-white">Loading watchlists...</p>
          ) : (
            <div>
              {watchlists.length === 0 ? (
                <div>
                  <p className="text-white">No watchlists found.</p>
                  <form className="rounded-md bg-white inline-flex">
                    <input className= "text-black m-1 rounded-md bg-white"
                      type="text"
                      value={newWatchlist}
                      onChange={(e) => setNewWatchlist(e.target.value)}
                      placeholder="Enter watchlist name"
                    />  
                    <button className="text-black m-1 rounded-md bg-white border-black border-solid" onClick={handleAddWatchlist}>Add Watchlist</button>
                  </form>
                </div>
              ) : (
                <div>
                  <h1>Dashboard</h1>
                  <p>Welcome to your dashboard!</p>
                  <div>
                    <h2>Watchlist</h2>
                    <div>
                      <select
                        value={selectedWatchlist}
                        onChange={(e) => setSelectedWatchlist(e.target.value)}
                      >
                        {watchlists.map((watchlist) => (
                          <option key={watchlist} value={watchlist}>
                            {watchlist}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Enter stock symbol"
                      />
                      <button onClick={handleAddStock}>Add Stock</button>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render the stocks of the selected watchlist */}
                      {selectedWatchlist &&
                        selectedWatchlist.map((item) => (
                          <tr key={item}>
                            <td>{item}</td>
                            <td>$345.00</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

export default Dashboard;
