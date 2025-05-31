// src/utils/constants.js - Application constants for Ethereum
export const ETHEREUM_NETWORK = 'goerli'; // 'mainnet', 'goerli', 'sepolia', 'polygon', 'arbitrum'

export const ETHEREUM_RPC_URLS = {
  'mainnet': 'https://mainnet.infura.io/v3/',
  'goerli': 'https://goerli.infura.io/v3/',
  'sepolia': 'https://sepolia.infura.io/v3/',
  'polygon': 'https://polygon-mainnet.infura.io/v3/',
  'arbitrum': 'https://arbitrum-mainnet.infura.io/v3/',
  'localhost': 'http://localhost:8545',
};

// Default RPC URL
export const DEFAULT_RPC_URL = 
  import.meta.env.VITE_ETHEREUM_RPC_URL || ETHEREUM_RPC_URLS[ETHEREUM_NETWORK];

// Explorer URL prefixes
export const EXPLORER_URL = {
  'mainnet': 'https://etherscan.io',
  'goerli': 'https://goerli.etherscan.io',
  'sepolia': 'https://sepolia.etherscan.io',
  'polygon': 'https://polygonscan.com',
  'arbitrum': 'https://arbiscan.io',
  'localhost': 'https://etherscan.io', // fallback
};

// Contract addresses - replace with your actual contract addresses
export const CONTRACT_ADDRESSES = {
  AUCTION_CONTRACT: import.meta.env.VITE_AUCTION_CONTRACT || '0x742d35cc6bb44c9e2e33f2b8d2e6c8df5b03b9a3',
  TENDER_CONTRACT: import.meta.env.VITE_TENDER_CONTRACT || '0x853d955acef822db058eb8505911ed77f175b99e',
  TOKEN_CONTRACT: import.meta.env.VITE_TOKEN_CONTRACT || '0xa0b86a33e6471e0e5b79bdfc1b635ad9d8b9ee98', // MyCompanyDOGE token
};

// Common ERC-20 token addresses
export const TOKEN_ADDRESSES = {
  USDC: '0xA0b86a33E6471E0E5B79bDfC1b635AD9d8B9ee98', // USDC on mainnet
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on mainnet
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI on mainnet
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Wrapped ETH
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILES: 'ethereum_dapp_user_profiles',
  WALLET_AUTOCONNECT: 'ethereum_dapp_wallet_autoconnect',
};

// Gas limits for different operations
export const GAS_LIMITS = {
  SIMPLE_TRANSFER: 21000,
  ERC20_TRANSFER: 65000,
  CONTRACT_INTERACTION: 150000,
  CREATE_TENDER: 200000,
  CREATE_AUCTION: 200000,
  PLACE_BID: 100000,
};

// Chain IDs
export const CHAIN_IDS = {
  MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  POLYGON: 137,
  ARBITRUM: 42161,
};