import React from 'react';
import { ConnectButton } from '@mysten/wallet-kit';

function WalletInfo() {
  return (
    <div className="wallet-info">
      <h2>Wallet Connected!</h2>
      <div>
      <ConnectButton />
      </div>
    </div>
  );
}

export default WalletInfo;