import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Api from '../Api';
import '../App.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlist, setNewWatchlist] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [currentStocks, setCurrentStocks] = useState([]);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    const getWatchlists = async () => {
      const response = await Api.getWatchlists();
      setLoading(false);
      setWatchlists(response);
      if (response.length > 0) {
        console.log('Selected watchlist:', response[0]);
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
    console.log('Current watchlist:', selectedWatchlist);
    Api.addToWatchlist(selectedWatchlist, newStock)
      .then(() => {
        setNewStock('');
        const getStocks = async () => {
          const response = await Api.getStocks(selectedWatchlist);
          setCurrentStocks(response);
        };
        getStocks();
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

  console.log(Api.getStockData('AAPL'));

  const columns = [
    {
      Header: 'Symbol',
      accessor: 'symbol',
    },
    {
      Header: 'Price',
      accessor: 'price',
    },
  ];

  const data = currentStocks.map((item) => ({
    symbol: item,
    price: 345.0,
  }));

  const Table = () => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-bluegrey-500 h-screen w-screen">
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
                  <input
                    className="text-black m-1 rounded-md bg-white"
                    type="text"
                    value={newWatchlist}
                    onChange={(e) => setNewWatchlist(e.target.value)}
                    placeholder="Enter watchlist name"
                  />
                  <button className="text-black m-1 rounded-md bg-white border-black border-solid" onClick={handleAddWatchlist}>Add Watchlist</button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow-md m2">
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard!</p>
                <div>
                  <h2>Watchlist</h2>
                  <div>
                    <label>Select watchlist:
                      <select
                        className="text-black m-1 rounded-md bg-white"
                        defaultValue={watchlists[0]}
                        value={selectedWatchlist}
                        onChange={(e) => setSelectedWatchlist(e.target.value)}
                      >
                        {watchlists.map((watchlist) => (
                          <option key={watchlist} value={watchlist}>{watchlist}</option>
                        ))}
                      </select>
                    </label>
                    <input
                      type="text"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="Enter stock symbol"
                    />
                    <button onClick={handleAddStock}>Add Stock</button>
                  </div>
                  {selectedWatchlist && currentStocks && currentStocks.length > 0 && (
                    <div>
                      <Table />
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

export default Dashboard;