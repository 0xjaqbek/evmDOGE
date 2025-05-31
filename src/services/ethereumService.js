// src/services/ethereumService.js - Ethereum blockchain service
import { ethers } from 'ethers';
import { parseEther, formatEther, isAddress } from 'viem';

/**
 * Get Ethereum provider
 * @param {string} rpcUrl - RPC URL
 * @returns {ethers.JsonRpcProvider} Ethereum provider
 */
export const getProvider = (rpcUrl) => {
  return new ethers.JsonRpcProvider(rpcUrl);
};

/**
 * Get account balance in ETH
 * @param {string} address - Ethereum address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<string>} Balance in ETH
 */
export const getBalance = async (address, provider) => {
  try {
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

/**
 * Send ETH transaction
 * @param {string} to - Recipient address
 * @param {string} amount - Amount in ETH
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {Promise<string>} Transaction hash
 */
export const sendEthTransaction = async (to, amount, signer) => {
  try {
    if (!isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    const transaction = {
      to,
      value: parseEther(amount.toString()),
    };

    const txResponse = await signer.sendTransaction(transaction);
    return txResponse.hash;
  } catch (error) {
    console.error('Error sending ETH:', error);
    throw error;
  }
};

/**
 * Get transaction details
 * @param {string} txHash - Transaction hash
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} Transaction details
 */
export const getTransaction = async (txHash, provider) => {
  try {
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: formatEther(tx.value),
      gasPrice: tx.gasPrice ? formatEther(tx.gasPrice) : null,
      gasLimit: tx.gasLimit ? tx.gasLimit.toString() : null,
      gasUsed: receipt ? receipt.gasUsed.toString() : null,
      status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
      blockNumber: receipt ? receipt.blockNumber : null,
      timestamp: tx.blockNumber ? (await provider.getBlock(tx.blockNumber)).timestamp : null,
    };
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
};

/**
 * Get recent transactions for an address (requires Etherscan API or similar)
 * @param {string} address - Ethereum address
 * @param {object} options - Options like limit, page
 * @returns {Promise<Array>} Array of transactions
 */
export const getTransactions = async (address, options = {}) => {
  const { limit = 10 } = options;
  
  try {
    // In a real application, you would use Etherscan API or similar service
    // For now, return mock data
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: '0x742d35cc6bb44c9e2e33f2b8d2e6c8df5b03b9a3',
        to: address,
        value: '0.1',
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'success',
        type: 'receive'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: address,
        to: '0x853d955acef822db058eb8505911ed77f175b99e',
        value: '0.05',
        timestamp: Date.now() - 172800000, // 2 days ago
        status: 'success',
        type: 'send'
      }
    ].slice(0, limit);
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

/**
 * Create ERC-20 token contract instance
 * @param {string} tokenAddress - Token contract address
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @returns {ethers.Contract} Token contract instance
 */
export const getTokenContract = (tokenAddress, providerOrSigner) => {
  const abi = [
    // ERC-20 standard functions
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
    // Events
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
  ];

  return new ethers.Contract(tokenAddress, abi, providerOrSigner);
};

/**
 * Get ERC-20 token balance
 * @param {string} tokenAddress - Token contract address
 * @param {string} walletAddress - Wallet address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} Token balance and info
 */
export const getTokenBalance = async (tokenAddress, walletAddress, provider) => {
  try {
    const contract = getTokenContract(tokenAddress, provider);
    
    const [balance, name, symbol, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return {
      balance: formatEther(balance), // Note: This assumes 18 decimals, adjust for actual decimals
      rawBalance: balance.toString(),
      name,
      symbol,
      decimals: decimals.toString(),
      address: tokenAddress,
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Send ERC-20 token transaction
 * @param {string} tokenAddress - Token contract address
 * @param {string} to - Recipient address
 * @param {string} amount - Amount in token units
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {Promise<string>} Transaction hash
 */
export const sendTokenTransaction = async (tokenAddress, to, amount, signer) => {
  try {
    if (!isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    const contract = getTokenContract(tokenAddress, signer);
    const decimals = await contract.decimals();
    
    // Convert amount to proper decimals
    const tokenAmount = ethers.parseUnits(amount.toString(), decimals);
    
    const txResponse = await contract.transfer(to, tokenAmount);
    return txResponse.hash;
  } catch (error) {
    console.error('Error sending token:', error);
    throw error;
  }
};

/**
 * Create smart contract instance
 * @param {string} contractAddress - Contract address
 * @param {Array} abi - Contract ABI
 * @param {ethers.Provider|ethers.Signer} providerOrSigner - Provider or signer
 * @returns {ethers.Contract} Contract instance
 */
export const getContract = (contractAddress, abi, providerOrSigner) => {
  return new ethers.Contract(contractAddress, abi, providerOrSigner);
};

/**
 * Estimate gas for a transaction
 * @param {object} transaction - Transaction object
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<string>} Estimated gas
 */
export const estimateGas = async (transaction, provider) => {
  try {
    const gasEstimate = await provider.estimateGas(transaction);
    return gasEstimate.toString();
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

/**
 * Get current gas price
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<string>} Gas price in Gwei
 */
export const getGasPrice = async (provider) => {
  try {
    const gasPrice = await provider.getFeeData();
    return formatEther(gasPrice.gasPrice || '0');
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

export default {
  getProvider,
  getBalance,
  sendEthTransaction,
  getTransaction,
  getTransactions,
  getTokenContract,
  getTokenBalance,
  sendTokenTransaction,
  getContract,
  estimateGas,
  getGasPrice,
};