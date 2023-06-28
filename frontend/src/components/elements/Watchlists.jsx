import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Api from '../../Api';
import '../../App.css';
import StockChart from '../../Chart';

const Watchlists = () => {
  const [loading, setLoading] = useState(true);
  const [watchlists, setWatchlists] = useState(null);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [currentPrices, setCurrentPrices] = useState([]);
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
      setSelectedWatchlist(watchlists[3]);
      getStocksInWatchlist(watchlists[3]).then((stocks) => {
        setStocksInSelectedWatchlist(stocks)
      })
    });
  }, []);

  useEffect(() => {
    console.log("Selected watchlist:", selectedWatchlist)
    getStocksInWatchlist(selectedWatchlist).then((stocks) => {
    updateCurrentPrices(stocks)
    })
  }, [selectedWatchlist]);


  const getStocksInWatchlist = async (watchlist) => {
    const response = await Api.getStocks(watchlist)
    console.log("Response:", response)
    return await Api.getStocks(watchlist);
  };

  const updateCurrentPrices = async (stocks) => {
    console.log("Stocks:", stocks)
    const currentPrices = await Api.getCurrentPrices(stocks);
    console.log("currentPrices:", currentPrices)
    const promises = Object.entries(currentPrices).map(async([symbol, prices])=> ({
      symbol: symbol,
      price: await currentPrices[symbol],
    }));
    const updatedData = await Promise.all(promises);
    setCurrentPrices(updatedData);
  };

  useEffect(() => {
    console.log("useEffect2")
    let intervalId;

    const startPeriodicUpdates = () => {
      intervalId = setInterval(() => {
        //getStocks();
      }, 15000); // 15 seconds interval
    };
  
    return () => {
      clearInterval(intervalId);
    };
  },[selectedWatchlist]);


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

  console.log(selectedWatchlist)
  console.log(currentPrices)

  const data = currentPrices;

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
                  {selectedWatchlist && (
                    <div className="border-black border-2 rounded-sm p-1 m-4 flex flex-row">
                      {stocksInSelectedWatchlist.length > 0 ? (
                        <>
                          <Table />
                            <StockChart symbols={stocksInSelectedWatchlist} period='1d' />
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