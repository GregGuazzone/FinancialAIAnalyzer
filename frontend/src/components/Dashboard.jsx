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

  return (
    <div className="App flex flex-col items-center">
      <header className="App-header w-full flex justify-between items-center p-4">
        <div className="flex items-center">
          <h1
            className="App-title text-xl cursor-pointer"
            onClick={() => switchElement('Watchlists')}
          >
            Watchlist
          </h1>
          <h1
            className="App-title text-xl cursor-pointer ml-4"
            onClick={() => switchElement('Portfolio')}
          >
            Portfolio
          </h1>
        </div>
        <div className="flex-grow"></div>
        <h1 className="App-title text-xl">Account</h1>
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
