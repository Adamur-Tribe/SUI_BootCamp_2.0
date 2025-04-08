// App.js
import React from 'react';
import './App.css';
import WalletInfo from './Components/ConnectWalletButton';


function App() {
  return (
    <div className="app">
      <h1>Simple Sui Wallet Connection</h1>
       <WalletInfo />
      
    </div>
  );
}

export default App;