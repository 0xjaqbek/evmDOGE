// src/components/Dashboard/SmartContractInteraction.jsx - Complete file with color updates
import { useState } from 'react';
import { useAccount } from 'wagmi'; // Replace Solana imports
import useEthereum from '../../hooks/useEthereum'; // Use Ethereum hook

export default function SmartContractInteraction() {
  const { address, isConnected } = useAccount(); // Replace useWallet
  const { isLoading } = useEthereum(); // Replace useSolana
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [txSignature, setTxSignature] = useState('');
  
  const handleInteractWithContract = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !address) { // Replace publicKey
      setMessage({ type: 'error', text: 'Please connect your wallet first.' });
      return;
    }
    
    setMessage({ type: '', text: '' });
    setTxSignature('');
    
    try {
      // Log variables to console for demonstration
      console.log("Contract interaction initiated with wallet:", address);
      
      // Simulate transaction
      const signature = await Promise.resolve('0x' + 'SimulatedTxSignature'.repeat(4));
      
      setMessage({
        type: 'success',
        text: 'Transaction successful! Your profile has been updated.'
      });
      setTxSignature(signature);
    } catch (err) {
      console.error('Error interacting with smart contract:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to interact with smart contract. Please try again.'
      });
    }
  };
  
  const handleSendEth = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !address) { // Replace publicKey
      setMessage({ type: 'error', text: 'Please connect your wallet first.' });
      return;
    }
    
    if (!recipient || !amount) {
      setMessage({ type: 'error', text: 'Please enter both recipient address and amount.' });
      return;
    }
    
    setMessage({ type: '', text: '' });
    setTxSignature('');
    
    try {
      // Simulate sending ETH
      const signature = '0x' + 'SimulatedSendEthTxSignature'.repeat(3);
      
      setMessage({
        type: 'success',
        text: `Successfully sent ${amount} ETH to ${recipient.slice(0, 8)}...`
      });
      setTxSignature(signature);
    } catch (err) {
      console.error('Error sending ETH:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to send ETH. Please try again.'
      });
    }
  };
  
  return (
    <div className="bg-brown-dark rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gold">Smart Contract Interaction</h2>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-900 bg-opacity-50 text-green-200' : 'bg-red-900 bg-opacity-50 text-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {txSignature && (
        <div className="mb-4 p-4 bg-brown-medium rounded-md">
          <p className="text-sm font-medium mb-1 text-gray-300">Transaction Hash:</p>
          <a 
            href={`https://etherscan.io/tx/${txSignature}`} // Update for Ethereum
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold-light break-all font-mono text-xs"
          >
            {txSignature}
          </a>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Send ETH Form */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gold">Send ETH</h3>
          <form onSubmit={handleSendEth}>
            <div className="mb-3">
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-brown-medium border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                placeholder="Enter recipient address"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-brown-medium border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200"
                placeholder="Enter amount"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Send ETH'}
            </button>
          </form>
        </div>
        
        {/* Smart Contract Interaction Form */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-gold">Update Profile On-Chain</h3>
          <p className="text-sm text-gray-400 mb-4">
            This demo simulates interacting with an Ethereum smart contract to update your profile data on-chain.
          </p>
          
          <button
            onClick={handleInteractWithContract}
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-gold text-black rounded-md hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Update Profile On-Chain'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Note: This is a demo button. In a real application, you would have actual inputs to
            configure the transaction.
          </p>
        </div>
      </div>
    </div>
  );
}