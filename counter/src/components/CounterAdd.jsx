
import { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import PackageIdInput from './PackageIdInput';
import CounterList from './CounterList';
import CounterDetail from './CounterDetail';
import useCounterOperations from '../hooks/useCounterOperations';

const DEFAULT_PACKAGE_ID = '0x4621feb4912a8643b555e673ef5ed2ff9a4f53a8f509e4e455f9894a4f36e744';

function CounterApp() {
  const account = useCurrentAccount();
  const [counterObj, setCounterObj] = useState(null);
  const [packageId, setPackageId] = useState(DEFAULT_PACKAGE_ID);
  
  const { 
    counterObjects, 
    counterValue, 
    loading, 
    createCounter, 
    incrementCounter, 
    selectCounter 
  } = useCounterOperations(packageId, counterObj, setCounterObj);
  
  return (
    <div className="counter-container">
      <h1>Sui Counter dApp</h1>
      
      <PackageIdInput 
        packageId={packageId} 
        setPackageId={setPackageId} 
      />
      
      <div className="wallet-section">
        <ConnectButton />  
      </div>
      
      {account ? (
        <div className="counter-section">
          <p>Connected Address: {account.address}</p>
          
          {loading ? (
            <p>Loading...</p>
          ) : counterObjects.length > 0 ? (
            <div>
              {!counterObj ? (
                <CounterList 
                  counterObjects={counterObjects}
                  selectCounter={selectCounter}
                  createCounter={createCounter}
                />
              ) : (
                <CounterDetail 
                  counterObj={counterObj}
                  counterValue={counterValue}
                  incrementCounter={incrementCounter}
                  goBackToList={() => setCounterObj(null)}
                />
              )}
            </div>
          ) : (
            <div>
              <p>You don't have any counters yet</p>
              <button 
                onClick={createCounter} 
                className="counter-button create"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Counter'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="connect-prompt">Connect your wallet to use the counter</p>
      )}
    </div>
  );
}

export default CounterApp;