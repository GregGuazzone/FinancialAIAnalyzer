import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import Api from '../../Api';
import '../../App.css';
import StockChart from '../../Chart';

const StockTable = ({symbols}) => {
  const [loading, setLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState([]);

  const getCurrentPrices = async () => {
    const response = await Api.getCurrentPrices(symbols);
    return response;
  }

  useEffect(() => {
      getCurrentPrices().then((prices) => {
          setCurrentPrices(prices);
          console.log("Prices:", prices)
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
        accessor: 'price',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return Object.entries(currentPrices).map(([symbol, price]) => ({
      symbol: symbol,
      price: price,
    }));
  }, [currentPrices]);

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
                const symbol = row.original.symbol;

                return (
                  <tr key={symbol}>
                    <td>{symbol}</td>
                    <td>{row.original.price}</td>
                    <td>
                      <StockChart symbol={symbol} period={'1d'} />
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
