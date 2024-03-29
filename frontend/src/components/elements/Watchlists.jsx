import React, { useState, useEffect } from 'react';
import Api from '../../Api';
import '../../App.css';
import StockTable from './StockTable';

const Watchlists = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState(null);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [stocksInSelectedWatchlist, setStocksInSelectedWatchlist] = useState([]);
  const [newWatchlist, setNewWatchlist] = useState('');
  const [newStock, setNewStock] = useState('');

  const getWatchlists = async () => {
    const response = await Api.getWatchlists();
    setLoading(false);
    return response;
  };

  useEffect(() => {
    console.log("useEffect1")
    getWatchlists().then((watchlists) => {
      setWatchlists(watchlists);
      setSelectedWatchlist(watchlists[0]);
      getStocksInWatchlist(watchlists[0]).then((stocks) => {
        setStocksInSelectedWatchlist(stocks)
      })
    });
  }, []);

  useEffect(() => {
    console.log("useEffect2")
    if (selectedWatchlist) {
      getStocksInWatchlist(selectedWatchlist).then((stocks) => {
        setStocksInSelectedWatchlist(stocks)
      })
    }
  }, [selectedWatchlist]);



  const getStocksInWatchlist = async (watchlist) => {
    const response = await Api.getStocks(watchlist)
    console.log("Response:", response)
    return await Api.getStocks(watchlist);
  };


  const handleAddWatchlist = () => {
    Api.addWatchlist(newWatchlist)
      .then((response) => {
        setWatchlists([...watchlists, response]);
        setSelectedWatchlist(response);
      })
      .catch((error) => {
        console.error('Error adding watchlist:', error);
      });
  };

  const handleAddStock = () => {
    Api.addToWatchlist(selectedWatchlist, newStock)
      .then(() => {
        setNewStock('');
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

  
  

  return (
    <div className="bg-bluegrey-500 w-screen">
      
      <div>
        {loading ? (
          <p className="text-white">Loading watchlists...</p>
        ) : (
        <div>
          <div>
            <label className= "text-white relative left-1">Watchlist:
              <select
                className="text-black m-1 rounded-md bg-white"
                onChange={(e) => setSelectedWatchlist(e.target.value)}
              >
                {watchlists.map((watchlist) => (
                  <option key={watchlist} value={watchlist}>{watchlist}</option>
                ))}
              </select>
            </label>
          </div>

                {watchlists.length === 0 ? (
                  <div>
                    <p className="text-white">No watchlists found.</p>
                    <form className="rounded-md bg-white inline-flex">
                      <input
                        className="text-black m-1 rounded-md bg-white"
                        type="text"
                        value={newWatchlist}
                        onChange={(e) => setNewWatchlist(e.target.value)}
                        placeholder="Enter watchlist name" />
                      <button className="text-black m-1 rounded-md bg-white border-black border-solid" onClick={handleAddWatchlist}>Add Watchlist</button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-md shadow-md m-2 ">
                    <p className="p-2">Welcome to your dashboard!</p>
                    <div>
                      <div className="content-end">
                        <input
                          type="text"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          placeholder="Enter stock symbol" />
                        <button onClick={handleAddStock}>Add Stock</button>
                      </div>
                      {selectedWatchlist && (
                        <div className="border-black border-2 rounded-sm p-1 m-4">
                          {stocksInSelectedWatchlist.length > 0 ? (
                            <>
                              <div className="object-fill w-screen">
                                <StockTable symbols={stocksInSelectedWatchlist} />
                              </div>
                            </>
                          ) : (
                            <p>No stocks found in the watchlist.</p>
                          )}
                        </div>
                      )}
                    </div>
                    <form className="rounded-md bg-white inline-flex">
                      <input className="text-black m-1 rounded-md bg-white"
                        type="text"
                        value={newWatchlist}
                        onChange={(e) => setNewWatchlist(e.target.value)}
                        placeholder="Enter watchlist name" />
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

export default Watchlists;