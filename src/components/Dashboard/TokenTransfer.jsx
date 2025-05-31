// src/components/Dashboard/TokenTransfer.jsx
import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { transferSOL, transferSPLToken } from '../../services/tokenService';

export default function TokenTransfer() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, connected } = wallet;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState('SOL');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(9); // Default for SOL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txSignature, setTxSignature] = useState('');

  // Common tokens on Solana - you can expand this list
  const commonTokens = [
    { name: 'SOL', address: 'Native', decimals: 9 },
    { name: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
    { name: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
    { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5 },
  ];

  // Handle token selection change
  const handleTokenChange = (e) => {
    const selectedToken = e.target.value;
    setTokenType(selectedToken);

    // Set token address and decimals based on selection
    if (selectedToken === 'SOL') {
      setTokenAddress('');
      setTokenDecimals(9);
    } else if (selectedToken === 'Custom') {
      setTokenAddress('');
      setTokenDecimals(0);
    } else {
      const token = commonTokens.find(t => t.name === selectedToken);
      if (token) {
        setTokenAddress(token.address);
        setTokenDecimals(token.decimals);
      }
    }
  };

  // Validate recipient address
  const isValidAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  // Handle token transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    
    // Reset status
    setError('');
    setSuccess('');
    setTxSignature('');
    
    // Validation
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!recipient) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!isValidAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (tokenType !== 'SOL' && tokenType !== 'Custom' && !tokenAddress) {
      setError('Token address is required');
      return;
    }
    
    if (tokenType === 'Custom' && !tokenAddress) {
      setError('Please enter a token address for custom token');
      return;
    }
    
    if (tokenType === 'Custom' && !isValidAddress(tokenAddress)) {
      setError('Invalid token address');
      return;
    }
    
    try {
      setLoading(true);
      
      let signature;
      const parsedAmount = parseFloat(amount);
      
      if (tokenType === 'SOL') {
        // Transfer SOL
        signature = await transferSOL(
          recipient,
          parsedAmount,
          wallet,
          connection
        );
      } else {
        // Transfer SPL token
        signature = await transferSPLToken(
          recipient,
          tokenAddress,
          parsedAmount,
          tokenDecimals,
          wallet,
          connection
        );
      }
      
      setTxSignature(signature);
      setSuccess(`Successfully transferred ${amount} ${tokenType} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
      
      // Reset form after successful transfer
      setAmount('');
      setRecipient('');
      
    } catch (err) {
      console.error('Transfer error:', err);
      setError(err.message || 'Failed to transfer tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Token Transfer</h2>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-900 bg-opacity-50 text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 rounded-md bg-green-900 bg-opacity-50 text-green-200">
          {success}
        </div>
      )}
      
      {txSignature && (
        <div className="mb-4 p-4 bg-gray-700 rounded-md">
          <p className="text-sm font-medium mb-1 text-gray-300">Transaction Signature:</p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 break-all font-mono text-xs"
          >
            {txSignature}
          </a>
        </div>
      )}
      
      {/* Transfer Form */}
      <form onSubmit={handleTransfer}>
        {/* Token Selection */}
        <div className="mb-4">
          <label htmlFor="tokenType" className="block text-sm font-medium text-gray-300 mb-1">
            Token Type
          </label>
          <select
            id="tokenType"
            value={tokenType}
            onChange={handleTokenChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
          >
            {commonTokens.map(token => (
              <option key={token.name} value={token.name}>
                {token.name}
              </option>
            ))}
            <option value="Custom">Custom Token</option>
          </select>
        </div>
        
        {/* Custom Token Address (shown only for custom token) */}
        {tokenType === 'Custom' && (
          <div className="mb-4">
            <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-300 mb-1">
              Token Address
            </label>
            <input
              type="text"
              id="tokenAddress"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
              placeholder="Enter token mint address"
            />
          </div>
        )}
        
        {/* Token Decimals (shown only for custom token) */}
        {tokenType === 'Custom' && (
          <div className="mb-4">
            <label htmlFor="tokenDecimals" className="block text-sm font-medium text-gray-300 mb-1">
              Token Decimals
            </label>
            <input
              type="number"
              id="tokenDecimals"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
              placeholder="Enter token decimals"
              min="0"
              max="18"
            />
          </div>
        )}
        
        {/* Recipient Address */}
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
            placeholder="Enter recipient's Solana address"
          />
        </div>
        
        {/* Amount */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000000001"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 pr-16"
              placeholder={`Enter amount in ${tokenType}`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <span className="text-gray-400">{tokenType}</span>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !connected}
          className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
            ${!connected 
              ? 'bg-gray-600 cursor-not-allowed' 
              : loading 
                ? 'bg-blue-700 opacity-70 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
        >
          {!connected 
            ? 'Connect Wallet First' 
            : loading 
              ? 'Processing...' 
              : `Send ${tokenType}`}
        </button>
      </form>
      
      {/* Wallet Connection Status */}
      {!connected && (
        <p className="mt-4 text-center text-sm text-gray-400">
          Please connect your wallet to transfer tokens.
        </p>
      )}
    </div>
  );
}