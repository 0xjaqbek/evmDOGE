// src/utils/helpers.js - Helper functions for Ethereum
import { isAddress } from 'viem';
import { EXPLORER_URL, ETHEREUM_NETWORK } from './constants';

/**
 * Truncate an Ethereum address for display
 * @param {string} address - Ethereum address to truncate
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format an ETH amount with commas and fixed decimals
 * @param {number|string} amount - Amount in ETH
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount
 */
export const formatEth = (amount, decimals = 4) => {
  if (amount === undefined || amount === null) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numAmount);
};

/**
 * Format token amount with proper decimals
 * @param {string|number} amount - Raw token amount
 * @param {number} decimals - Token decimals (default 18 for most ERC-20)
 * @param {number} displayDecimals - Number of decimals to display
 * @returns {string} Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 18, displayDecimals = 4) => {
  if (!amount) return '0';
  
  const divisor = Math.pow(10, decimals);
  const formattedAmount = parseFloat(amount) / divisor;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  }).format(formattedAmount);
};

/**
 * Validate an Ethereum wallet address
 * @param {string} address - Address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidEthereumAddress = (address) => {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Generate an explorer URL for a transaction or address
 * @param {string} type - 'tx', 'address', 'token', or 'block'
 * @param {string} value - Transaction hash, wallet address, token address, or block number
 * @param {string} network - Network name (optional, defaults to current network)
 * @returns {string} Explorer URL
 */
export const getExplorerUrl = (type, value, network = ETHEREUM_NETWORK) => {
  const baseUrl = EXPLORER_URL[network] || EXPLORER_URL.mainnet;
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    case 'block':
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
};

/**
 * Convert Wei to ETH
 * @param {string|number} wei - Amount in Wei
 * @returns {number} Amount in ETH
 */
export const weiToEth = (wei) => {
  return parseFloat(wei) / Math.pow(10, 18);
};

/**
 * Convert ETH to Wei
 * @param {number} eth - Amount in ETH
 * @returns {string} Amount in Wei
 */
export const ethToWei = (eth) => {
  return (eth * Math.pow(10, 18)).toString();
};

/**
 * Convert Wei to Gwei
 * @param {string|number} wei - Amount in Wei
 * @returns {number} Amount in Gwei
 */
export const weiToGwei = (wei) => {
  return parseFloat(wei) / Math.pow(10, 9);
};

/**
 * Convert Gwei to Wei
 * @param {number} gwei - Amount in Gwei
 * @returns {string} Amount in Wei
 */
export const gweiToWei = (gwei) => {
  return (gwei * Math.pow(10, 9)).toString();
};

/**
 * Format gas price from Wei to Gwei
 * @param {string|number} gasPrice - Gas price in Wei
 * @returns {string} Formatted gas price in Gwei
 */
export const formatGasPrice = (gasPrice) => {
  const gwei = weiToGwei(gasPrice);
  return `${gwei.toFixed(2)} Gwei`;
};

/**
 * Calculate transaction fee
 * @param {string|number} gasUsed - Gas used
 * @param {string|number} gasPrice - Gas price in Wei
 * @returns {string} Transaction fee in ETH
 */
export const calculateTransactionFee = (gasUsed, gasPrice) => {
  const feeInWei = parseFloat(gasUsed) * parseFloat(gasPrice);
  return weiToEth(feeInWei).toFixed(6);
};

/**
 * Get short network name for display
 * @param {number} chainId - Chain ID
 * @returns {string} Network name
 */
export const getNetworkName = (chainId) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 5:
      return 'Goerli';
    case 11155111:
      return 'Sepolia';
    case 137:
      return 'Polygon';
    case 42161:
      return 'Arbitrum';
    default:
      return 'Unknown';
  }
};

/**
 * Check if address is a contract
 * @param {string} address - Ethereum address
 * @param {object} provider - Ethereum provider
 * @returns {Promise<boolean>} Whether address is a contract
 */
export const isContract = async (address, provider) => {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error('Error checking if address is contract:', error);
    return false;
  }
};