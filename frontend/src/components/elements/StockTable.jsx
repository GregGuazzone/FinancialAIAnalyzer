import React, { useEffect, useState } from 'react';
import { useTable, usePagination, pageCount } from 'react-table';
import Api from '../../Api';
import '../../App.css';
import StockChart from '../../Chart';

const StockTable = ({symbols}) => {
  const [loading, setLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState([]);
  const [chartData, setChartData] = useState({});

  const getPricesData = async () => {
    try {
      const response = await Api.getCurrentPrices(symbols); // Replace with your API call for fetching price data
      setCurrentPrices(response.data); // Assuming the price data is in the 'data' field of the response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  const getChartData = async () => {
    try {
      console.log("Symbols:", symbols)
      const response = await Api.getChartData(symbols); // Replace with your API call for fetching chart data
      setChartData(response.data); // Assuming the chart data is in the 'data' field of the response
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    getPricesData();
  }, []);

  useEffect(() => {
    getChartData();
  }, []);

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

  const data = currentPrices;

  const renderStockChart = (symbol) => {
    if (chartData.hasOwnProperty(symbol)) {
      // Assuming the chart data for a specific symbol is available in chartData object
      return <StockChart data={chartData[symbol]} />;
    }
    return null;
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index and page size
    },
    usePagination // Add the usePagination plugin
  );

  const { pageIndex } = state; // Get the current page index

  return (
    <div>
      <table {...getTableProps()}>
        {/* Table header */}
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Table body */}
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const stockSymbol = row.original.symbol;

            return (
              <tr className="border-2 border-black m-10" {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  if (index === 0) {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  } else if (index === 1) {
                    return <td>{renderStockChart(stockSymbol)}</td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default StockTable;
