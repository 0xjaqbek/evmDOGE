// src/hooks/useSolana.js - Custom hook for Solana blockchain interactions
import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import solanaService from '../services/solana';

export function useSolana() {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [connected, publicKey, connection]);

  // Function to fetch wallet balance
  const fetchBalance = async () => {
    if (!publicKey || !connection) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1000000000); // Convert lamports to SOL
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get recent transactions
  const getRecentTransactions = async (limit = 10) => {
    if (!publicKey || !connection) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await solanaService.getTransactions(
        publicKey.toString(), 
        { limit }, 
        connection
      );
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send SOL
  const sendSol = async (recipientAddress, amount) => {
    if (!publicKey || !connection || !sendTransaction) {
      throw new Error('Wallet not connected');
    }
    
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const toPublicKey = new PublicKey(recipientAddress);
      
      // Create transaction
      const transaction = await solanaService.createTransferTransaction(
        publicKey,
        toPublicKey,
        amount,
        connection
      );
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Refresh balance
      await fetchBalance();
      
      return signature;
    } catch (err) {
      console.error('Error sending SOL:', err);
      setError(err.message || 'Failed to send SOL. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to interact with a program (smart contract)
  const interactWithProgram = async (programId, instruction, accounts) => {
    if (!publicKey || !connection || !signTransaction) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create transaction to interact with the program
      const transaction = await solanaService.createProgramTransaction(
        programId,
        instruction,
        accounts,
        publicKey,
        connection
      );
      
      // Request user to sign the transaction
      const signedTransaction = await signTransaction(transaction);
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (err) {
      console.error('Error interacting with program:', err);
      setError(err.message || 'Failed to interact with program. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get token accounts
  const getTokenAccounts = async () => {
    if (!publicKey || !connection) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await solanaService.getTokenAccounts(
        publicKey.toString(), 
        connection
      );
    } catch (err) {
      console.error('Error fetching token accounts:', err);
      setError('Failed to fetch token accounts. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connected,
    publicKey: publicKey?.toString(),
    balance,
    isLoading,
    error,
    fetchBalance,
    getRecentTransactions,
    sendSol,
    interactWithProgram,
    getTokenAccounts,
  };
}

// Export the hook as default
export default useSolana;