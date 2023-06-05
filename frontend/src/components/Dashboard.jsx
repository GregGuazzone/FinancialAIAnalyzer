import React, { useState, useEffect } from 'react';
import Api from '../Api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newStock, setNewStock] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getWatchlist = async () => {
      const response = await Api.getWatchlist();
      setWatchlist(response);
    };
    getWatchlist();
  }, []);


  const handleAddStock = () => {
    // Assuming you have an API function to add a stock to the watchlist
    Api.addToWatchlist(newStock)
      .then(() => {
        setWatchlist([...watchlist, newStock]);
        setNewStock('');
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

  console.log("Watchlist:", watchlist)
  return (
    <div className="dashboard-container flex flex-col items-stretch min-w-screen justify-center h-screen bg-bluegrey-500 w-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Dashboard</h1>
      <p className="text-gray-300">Welcome to your dashboard!</p>
      <div className="flex flex-row justify-center my-4">
        <h2 className="text-lg font-semibold text-white mr-2 items-start">Watchlist</h2>
        <div className="flex flex-row items-center">
          <input
            type="text"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder="Enter stock symbol"
            className="px-2 py-1 mr-2 border border-gray-400 rounded-md"
          />
          <button
            onClick={handleAddStock}
            className="px-3 py-1 text-white bg-blue-500 rounded-md"
          >
            Add Stock
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto bg-white shadow-md rounded-lg m-3 ">
        {watchlist.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Symbol</th>
                <th scope="col" class="px-6 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr className="bg-white border-b"
                  key={item}>
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item}
                    </th>
                    <td class="px-6 py-4 text-gray-500 whitespace-nowrap">
                      $345.00
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-white">Loading watchlist...</p>
        )}
      </div>
      {/* Add your additional dashboard content here */}
    </div>
  );
};

export default Dashboard;