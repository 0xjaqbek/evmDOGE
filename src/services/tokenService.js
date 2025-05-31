// src/services/tokenService.js - ERC-20 token service for Ethereum
import { ethers } from 'ethers';
import { parseEther, formatEther, parseUnits, formatUnits, isAddress } from 'viem';

// Standard ERC-20 ABI (minimal required functions)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

/**
 * Transfer ETH from the connected wallet to another address
 * @param {string} toAddress - Recipient wallet address
 * @param {string} amount - Amount to send in ETH
 * @param {ethers.Signer} signer - Connected wallet signer
 * @returns {Promise<string>} Transaction hash
 */
export const transferETH = async (toAddress, amount, signer) => {
  try {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }
    
    // Create transaction
    const transaction = {
      to: toAddress,
      value: parseEther(amount.toString()),
    };
    
    // Send transaction
    const txResponse = await signer.sendTransaction(transaction);
    
    // Wait for confirmation
    await txResponse.wait();
    
    return txResponse.hash;
  } catch (error) {
    console.error('Error transferring ETH:', error);
    throw error;
  }
};

/**
 * Transfer ERC-20 tokens from the connected wallet to another address
 * @param {string} toAddress - Recipient wallet address
 * @param {string} tokenAddress - Token contract address
 * @param {string} amount - Amount to send (in token units)
 * @param {number} decimals - Token decimals (default 18)
 * @param {ethers.Signer} signer - Connected wallet signer
 * @returns {Promise<string>} Transaction hash
 */
export const transferERC20Token = async (
  toAddress, 
  tokenAddress, 
  amount, 
  decimals = 18, 
  signer
) => {
  try {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }
    
    // Create contract instance
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    
    // Convert amount to proper decimals
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    // Send transaction
    const txResponse = await tokenContract.transfer(toAddress, tokenAmount);
    
    // Wait for confirmation
    await txResponse.wait();
    
    return txResponse.hash;
  } catch (error) {
    console.error('Error transferring ERC-20 token:', error);
    throw error;
  }
};

/**
 * Get token information for an ERC-20 token
 * @param {string} tokenAddress - Token contract address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} Token info
 */
export const getTokenInfo = async (tokenAddress, provider) => {
  try {
    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply(),
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals: parseInt(decimals.toString()),
      totalSupply: totalSupply.toString(),
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
};

/**
 * Get ERC-20 token balance for a specific wallet
 * @param {string} tokenAddress - Token contract address
 * @param {string} walletAddress - Wallet address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} Token balance info
 */
export const getTokenBalance = async (tokenAddress, walletAddress, provider) => {
  try {
    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }

    if (!isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [balance, decimals, symbol] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals(),
      tokenContract.symbol(),
    ]);

    const formattedBalance = formatUnits(balance, decimals);

    return {
      balance: formattedBalance,
      rawBalance: balance.toString(),
      decimals: parseInt(decimals.toString()),
      symbol,
      address: tokenAddress,
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Get ETH balance for a wallet
 * @param {string} walletAddress - Wallet address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} ETH balance info
 */
export const getETHBalance = async (walletAddress, provider) => {
  try {
    if (!isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    const balance = await provider.getBalance(walletAddress);
    const formattedBalance = formatEther(balance);

    return {
      balance: formattedBalance,
      rawBalance: balance.toString(),
      decimals: 18,
      symbol: 'ETH',
    };
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    throw error;
  }
};

/**
 * Approve token spending for a contract
 * @param {string} tokenAddress - Token contract address
 * @param {string} spenderAddress - Spender contract address
 * @param {string} amount - Amount to approve (in token units)
 * @param {number} decimals - Token decimals (default 18)
 * @param {ethers.Signer} signer - Connected wallet signer
 * @returns {Promise<string>} Transaction hash
 */
export const approveToken = async (
  tokenAddress, 
  spenderAddress, 
  amount, 
  decimals = 18, 
  signer
) => {
  try {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }

    if (!isAddress(spenderAddress)) {
      throw new Error('Invalid spender address');
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    
    // Convert amount to proper decimals
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    // Send approval transaction
    const txResponse = await tokenContract.approve(spenderAddress, tokenAmount);
    
    // Wait for confirmation
    await txResponse.wait();
    
    return txResponse.hash;
  } catch (error) {
    console.error('Error approving token:', error);
    throw error;
  }
};

/**
 * Check token allowance
 * @param {string} tokenAddress - Token contract address
 * @param {string} ownerAddress - Token owner address
 * @param {string} spenderAddress - Spender address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<object>} Allowance info
 */
export const getTokenAllowance = async (
  tokenAddress, 
  ownerAddress, 
  spenderAddress, 
  provider
) => {
  try {
    if (!isAddress(tokenAddress)) {
      throw new Error('Invalid token contract address');
    }

    if (!isAddress(ownerAddress)) {
      throw new Error('Invalid owner address');
    }

    if (!isAddress(spenderAddress)) {
      throw new Error('Invalid spender address');
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [allowance, decimals] = await Promise.all([
      tokenContract.allowance(ownerAddress, spenderAddress),
      tokenContract.decimals(),
    ]);

    const formattedAllowance = formatUnits(allowance, decimals);

    return {
      allowance: formattedAllowance,
      rawAllowance: allowance.toString(),
      decimals: parseInt(decimals.toString()),
    };
  } catch (error) {
    console.error('Error getting token allowance:', error);
    throw error;
  }
};

/**
 * Get multiple token balances for a wallet
 * @param {Array<string>} tokenAddresses - Array of token contract addresses
 * @param {string} walletAddress - Wallet address
 * @param {ethers.Provider} provider - Ethereum provider
 * @returns {Promise<Array>} Array of token balance objects
 */
export const getMultipleTokenBalances = async (tokenAddresses, walletAddress, provider) => {
  try {
    const balancePromises = tokenAddresses.map(async (tokenAddress) => {
      try {
        return await getTokenBalance(tokenAddress, walletAddress, provider);
      } catch (error) {
        console.error(`Error getting balance for token ${tokenAddress}:`, error);
        return {
          balance: '0',
          rawBalance: '0',
          decimals: 18,
          symbol: 'UNKNOWN',
          address: tokenAddress,
          error: error.message,
        };
      }
    });

    return await Promise.all(balancePromises);
  } catch (error) {
    console.error('Error getting multiple token balances:', error);
    throw error;
  }
};

export default {
  transferETH,
  transferERC20Token,
  getTokenInfo,
  getTokenBalance,
  getETHBalance,
  approveToken,
  getTokenAllowance,
  getMultipleTokenBalances,
};