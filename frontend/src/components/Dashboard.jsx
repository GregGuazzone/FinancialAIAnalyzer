import React, { useState } from 'react';
import Watchlists from './elements/Watchlists';
import Portfolio from './elements/Portfolio';

const Dashboard = () => {
  const [element, setElement] = useState('Watchlists');

  const renderComponent = () => {
    switch (element) {
      case 'Watchlists':
        return <Watchlists />;
      case 'Portfolio':
        return <Portfolio />;
      default:
        return <Watchlists />;
    }
  };

  const switchElement = (selectedElement) => {
    setElement(selectedElement);
  };

  const translateX = element === 'Watchlists' ? '-translate-x-16' : 'translate-x-16';
  console.log("Position: ", translateX)

  return (
    <div className="App flex flex-col justify-center items-center">
      <header className="App-header w-60 pt-4 flex flex-row justify-between">
        <div>
            <h1
            className="App-title p-2 text-2xl"
            onClick={() => switchElement('Watchlists')}
            >
            Watchlist
            </h1>
        </div>
        <div>
            <h1
            className="App-title p-2 text-2xl"
            onClick={() => switchElement('Portfolio')}
            >
            Portfolio
            </h1>
        </div>
      </header>
      <div className="box-content h-3 w-60 relative flex justify-center items-center">
        <div
          className={`box-content h-3 w-3 bg-blue-500 bottom-0 transform rotate-45 origin-bottom transition-transform duration-500 translate-y-1 ${translateX}`}
        ></div>
      </div>
      <div className="App-body">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;
