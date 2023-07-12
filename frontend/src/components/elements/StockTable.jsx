import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import Api from '../../Api';
import '../../App.css';
import StockChart from './Chart';

const StockTable = ({symbols}) => {

  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState([]);


  const getStockData = async () => {
    const response = await Api.getFinancials(symbols);
    console.log("Response:", response)
    return response;
  }

  useEffect(() => {
      getStockData().then((stockData) => {
        setStockData(stockData);
        console.log("AAPL", stockData.AAPL)
        setLoading(false);
      })
  }, [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      {
      Header: 'Price',
      accessor: 'currentPrice',
      Cell: ({ value }) => `$${value}`,
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: 'Daily Chart',
      },
      {
        Header: '1 Week Chart',
      }
    ],
    []
  );


  const data = React.useMemo(() => {
    if(loading)  {
      return [];
    }
    console.log("Stock Data:", stockData)
    return Object.entries(stockData).map(([symbol, stock]) => ({
      symbol,
      currentPrice: stock.currentPrice,
      marketCap: stock.marketCap,
    }));
  }, [stockData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      {loading ?(
        <div>Loading...</div>
      ) : (
          <table className="border-black hover:border-spacing-2" {...getTableProps()}>
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
                const symbol = row.original.symbol;

                return (
                  <tr className="border border-black rounded-lg" key={symbol}>
                    <td>{symbol}</td>
                    <td>{row.original.currentPrice}</td>
                    <td>{row.original.marketCap}</td>
                    <td>
                      <StockChart symbol={symbol} period={'1d'} />
                    </td>
                    <td>
                      <StockChart symbol={symbol} period={'1w'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      )}
    </div>
  );
}

export default StockTable;
