import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlist, setNewWatchlist] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [currentStocks, setCurrentStocks] = useState([]);
  const [newStock, setNewStock] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getWatchlists = async () => {
      const response = await Api.getWatchlists();
      setLoading(false);
      setWatchlists(response);
      if (response.length > 0) {
        console.log("Selected watchlist:", response[0])
        setSelectedWatchlist(response[0]);
      }
    };
    getWatchlists();
  }, []);

  useEffect(() => {
    if (selectedWatchlist) {
      const getStocks = async () => {
        const response = await Api.getStocks(selectedWatchlist);
        setCurrentStocks(response);
      };
      getStocks();
    }
  }, [selectedWatchlist]);


  const handleAddWatchlist = () => {
    Api.addWatchlist(newWatchlist)
      .then((response) => {
        setWatchlists([...watchlists, response]);
        setSelectedWatchlist(response.name);
      })
      .catch((error) => {
        console.error('Error adding watchlist:', error);
      });
  };


  const handleAddStock = () => {
    console.log("Current watchlist:", selectedWatchlist)
    Api.addToWatchlist(selectedWatchlist, newStock)
      .then(() => {
        setNewStock('');
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

  console.log("Current stocks:", currentStocks)

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
                <div className="bg-white rounded-md shadow-md">
                  <h1>Dashboard</h1>
                  <p>Welcome to your dashboard!</p>
                  <div>
                    <h2>Watchlist</h2>
                    <div>
                      <select className= " text-black m-1 rounded-md bg-white"
                        value={selectedWatchlist ? selectedWatchlist.name : ''}
                        onChange={(e) => {
                          const selected = watchlists.find(
                            (watchlist) => watchlist.name === e.target.value
                          );
                          setSelectedWatchlist(selected);
                        }}
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
                  {selectedWatchlist && currentStocks && currentStocks.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStocks.map((item) => (
                          <tr key={item}>
                            <td>{item}</td>
                            <td>$345.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default Dashboard;
