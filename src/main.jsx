// src/main.jsx - Entry point with Ethereum setup
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/theme.css';
import './index.css';
import './styles/landingPage.css';

// Ethereum/Wagmi imports
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { mainnet, goerli, sepolia, polygon, arbitrum } from 'wagmi/chains';
import { MetaMaskConnector } from '@wagmi/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli, 
    sepolia,
    polygon,
    arbitrum
  ],
  [
    // Add your API keys in environment variables
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo' }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY || 'demo' }),
    publicProvider(),
  ]
);

// Configure wallet connectors
const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
      showQrModal: true,
    },
  }),
];

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);