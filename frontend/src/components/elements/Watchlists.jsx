import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Api from '../../Api';
import '../../App.css';
import Stock from '../../Stock';
import StockChart from '../../Chart';


const Watchlists = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState([]);
  const [newWatchlist, setNewWatchlist] = useState('');
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [stockData, setStockData] = useState([]);
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

  const getStocks = async () => {
    const response = await Api.getStocks(selectedWatchlist);
    console.log('Current tickers:', response);
    if (response.length < 1) {
      return;
    }
    const currentPrices = await Api.getCurrentPrices(response);
    console.log('Current prices:', currentPrices);
    const promises = response.map(async (stock) => ({
      symbol: stock,
      price: await currentPrices[stock],
    }));
    const updatedData = await Promise.all(promises);
    console.log('Data:', updatedData);
    setStockData(updatedData);
  };

  useEffect(() => {
    let intervalId;

    const startPeriodicUpdates = () => {
      intervalId = setInterval(() => {
        getStocks();
      }, 5000); // 5 seconds interval
    };
  
    if (selectedWatchlist) {
      getStocks();
      startPeriodicUpdates();
    }
  
    return () => {
      clearInterval(intervalId); // Clear the interval when component unmounts
    };
  }, [selectedWatchlist]);


  const handleAddWatchlist = () => {
    Api.addWatchlist(newWatchlist)
      .then((response) => {
        setWatchlists([...watchlists, response]);
        console.log('New watchlist:', response);
        setSelectedWatchlist(response);
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
        getStocks();
      })
      .catch((error) => {
        console.error('Error adding stock to watchlist:', error);
      });
  };

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

  const data = stockData;

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
              <tr className=" border-2 border-black m-10" {...row.getRowProps()}>
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
      <h2 className="text-2xl font-bold text-white p-4">Dashboard</h2>
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
              <div className="bg-white rounded-md shadow-md m-2 ">
                <p className="p-2">Welcome to your dashboard!</p>
                <div>
                  <h2>Watchlist</h2>
                  <div>
                    <label>Select watchlist:
                      <select
                        className="text-black m-1 rounded-md bg-white"
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
                  {selectedWatchlist && stockData && stockData.length > 0 && (
                    <div className=" border-black border-2 rounded-sm p-1 m-4 flex flex-row">
                          <Table />
                          <StockChart />
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