// src/hooks/useEthereum.js - Custom hook for Ethereum blockchain interactions
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export function useEthereum() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider when component mounts
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!provider) {
      setError('Please install MetaMask or another Ethereum wallet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const account = accounts[0];
      const network = await provider.getNetwork();

      setAccount(account);
      setSigner(signer);
      setChainId(network.chainId);

      // Get balance
      await fetchBalance(account);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setBalance('0');
    setChainId(null);
    setError(null);
  };

  // Fetch wallet balance
  const fetchBalance = async (address = account) => {
    if (!provider || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send ETH transaction
  const sendEth = async (recipientAddress, amount) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amount.toString())
      });

      // Wait for transaction confirmation
      await tx.wait();

      // Refresh balance
      await fetchBalance();

      return tx.hash;
    } catch (err) {
      console.error('Error sending ETH:', err);
      setError(err.message || 'Failed to send ETH. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Interact with smart contract
  const interactWithContract = async (contractAddress, abi, methodName, args = [], value = '0') => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      const txOptions = {};
      if (value !== '0') {
        txOptions.value = ethers.utils.parseEther(value);
      }

      const tx = await contract[methodName](...args, txOptions);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      console.error('Error interacting with contract:', err);
      setError(err.message || 'Failed to interact with contract. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Read from smart contract
  const readFromContract = async (contractAddress, abi, methodName, args = []) => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const result = await contract[methodName](...args);
      return result;
    } catch (err) {
      console.error('Error reading from contract:', err);
      setError(err.message || 'Failed to read from contract. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get recent transactions
  const getRecentTransactions = async (limit = 10) => {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentBlock = await provider.getBlockNumber();
      const transactions = [];

      // Search through recent blocks for transactions involving the account
      for (let i = 0; i < Math.min(limit * 10, 100) && transactions.length < limit; i++) {
        const blockNumber = currentBlock - i;
        if (blockNumber < 0) break;

        const block = await provider.getBlockWithTransactions(blockNumber);
        
        const userTransactions = block.transactions.filter(tx => 
          tx.from?.toLowerCase() === account.toLowerCase() || 
          tx.to?.toLowerCase() === account.toLowerCase()
        );

        transactions.push(...userTransactions);
      }

      return transactions.slice(0, limit);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Switch network
  const switchNetwork = async (chainId) => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: ethers.utils.hexValue(chainId) }
      ]);
    } catch (err) {
      console.error('Error switching network:', err);
      throw err;
    }
  };

  // Add network
  const addNetwork = async (networkConfig) => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    try {
      await provider.send('wallet_addEthereumChain', [networkConfig]);
    } catch (err) {
      console.error('Error adding network:', err);
      throw err;
    }
  };

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  // Utility functions
  const weiToEth = (wei) => {
    return ethers.utils.formatEther(wei);
  };

  const ethToWei = (eth) => {
    return ethers.utils.parseEther(eth.toString());
  };

  const isValidAddress = (address) => {
    return ethers.utils.isAddress(address);
  };

  return {
    provider,
    signer,
    account,
    balance,
    chainId,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    sendEth,
    interactWithContract,
    readFromContract,
    getRecentTransactions,
    switchNetwork,
    addNetwork,
    weiToEth,
    ethToWei,
    isValidAddress,
    connected: !!account
  };
}

export default useEthereum;