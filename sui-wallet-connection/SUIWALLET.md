# SUI WALLET CONNECTION

To create a simple Sui wallet connection using React.js, you can use the `@mysten/wallet-adapter` package. This package provides utilities to interact with Sui wallets like the Sui Wallet browser extension.

The steps to follow to use react to connect sui wallet: 

---

### **Step 1: Set Up the React Project application**
If you don't already have a React project, create one using 
1. `create-react-app`
2. `Vite`

1. ## create-react-app (using npx)
```bash
npx create-react-app sui-wallet-connection
cd sui-wallet-connection
```

2. ## Vite (using npm)
```bash
npm create vite@latest sui-wallet-connection --template react
cd sui-wallet-connection
npm install
```

---

### **Step 2: Install Required Dependencies **(important for the sui wallet to work)
Install the `@mysten/wallet-adapter` package and its dependencies.

```bash
npm install @mysten/wallet-adapter-react @mysten/wallet-adapter-base @mysten/wallet-adapter-sui-wallet
```

---

### **Step 3: Create the Wallet Connection Logic**
Create a simple React component to handle wallet connection logic.
 **Resources to use from sui doc**
 

#### **App.js**
Replace the content of `src/App.js` with the following code:

```javascript
import React from 'react';
import { WalletProvider, useWallet } from '@mysten/wallet-adapter-react';
import { SuiWalletAdapter } from '@mysten/wallet-adapter-sui-wallet';

function ConnectWalletButton() {
  const { connected, connecting, select, wallet, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    if (!connected) {
      await connect();
    }
  };

  return (
    <div>
      <h1>Sui Wallet Connection</h1>
      {connected ? (
        <div>
          <p>Connected to: {wallet?.adapter.name}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

function App() {
  const adapters = [new SuiWalletAdapter()];

  return (
    <WalletProvider adapters={adapters} autoConnect>
      <div className="App">
        <ConnectWalletButton />
      </div>
    </WalletProvider>
  );
}

export default App;
```

---

### **Step 4: Run the Application**
Start the development server to test the wallet connection.

```bash
npm start
```

---

### **Explanation of the Code**
1. **WalletProvider**: This wraps your application and provides the wallet connection context.
   - The `adapters` array specifies the wallet adapters to support (e.g., `SuiWalletAdapter`).
   - The `autoConnect` prop attempts to reconnect to the wallet automatically if previously connected.

2. **useWallet Hook**: Provides access to wallet-related data and methods:
   - `connected`: Indicates whether the wallet is currently connected.
   - `connecting`: Indicates whether a connection attempt is in progress.
   - `connect`: Initiates a connection to the wallet.
   - `disconnect`: Disconnects from the wallet.
   - `wallet`: Contains details about the connected wallet.

3. **ConnectWalletButton Component**: Handles the UI for connecting and disconnecting the wallet.

---

### **Step 5: Test the Wallet Connection**
1. Install the Sui Wallet browser extension (available for Chrome and Firefox).
2. Open the React app in your browser.
3. Click the "Connect Wallet" button.
4. Approve the connection request in the Sui Wallet extension.

Once connected, the app will display the name of the connected wallet and provide a "Disconnect" button.

---

### **Optional Enhancements**
1. **Display Wallet Address**:
   Use the `getAddress()` method from the wallet adapter to fetch and display the user's wallet address.

   ```javascript
   const { wallet, connected } = useWallet();

   const getAddress = async () => {
     if (connected && wallet) {
       const address = await wallet.adapter.getAddress();
       console.log('Wallet Address:', address);
     }
   };
   ```

2. **Handle Multiple Wallets**:
   Add support for additional wallets by including more adapters in the `adapters` array.

   ```javascript
   import { SuiWalletAdapter } from '@mysten/wallet-adapter-sui-wallet';
   import { EthosWalletAdapter } from '@mysten/wallet-adapter-ethos';

   const adapters = [new SuiWalletAdapter(), new EthosWalletAdapter()];
   ```

3. **Styling**:
   Use CSS or a library like TailwindCSS to style the wallet connection UI.

---

This setup provides a minimal yet functional implementation of a Sui wallet connection in a React application. You can expand it further based on your specific requirements.