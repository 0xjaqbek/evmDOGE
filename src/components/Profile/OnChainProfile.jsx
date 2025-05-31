// src/components/Profile/OnChainProfile.jsx
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useSolana from '../../hooks/useSolana';
import smartContracts from '../../services/smartContracts';
import { validateProfileForm } from '../../utils/validators';
import { PROGRAM_ID } from '../../utils/constants';

export default function OnChainProfile() {
  const { publicKey } = useWallet();
  const { interactWithProgram, isLoading } = useSolana();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [txSignature, setTxSignature] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    if (!publicKey) {
      setMessage({ type: 'error', text: 'Please connect your wallet first.' });
      return;
    }
    
    setMessage({ type: '', text: '' });
    setTxSignature('');
    setFormErrors({});
    
    try {
      // Derive the profile account address
      const owner = new PublicKey(publicKey);
      const profileAccount = smartContracts.deriveProfileAccount(owner, PROGRAM_ID);
      
      // Check if the profile account exists
      // This would typically require an on-chain call
      // For this demo, we'll assume it might not exist and create an instruction accordingly
      const doesProfileExist = false; // In a real app, you would check this
      
      let instruction;
      if (!doesProfileExist) {
        // Create a new profile
        instruction = smartContracts.createProfileInstruction(
          PROGRAM_ID,
          profileAccount,
          owner,
          formData.displayName,
          formData.bio
        );
      } else {
        // Update existing profile
        instruction = smartContracts.updateProfileInstruction(
          PROGRAM_ID,
          profileAccount,
          owner,
          formData.displayName,
          formData.bio
        );
      }
      
      // Set up account metas - different depending on create vs. update
      const accounts = doesProfileExist
        ? [
            { pubkey: profileAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: false },
          ]
        : [
            { pubkey: profileAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: true },
            { pubkey: smartContracts.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: smartContracts.SystemProgram.programId, isSigner: false, isWritable: false },
          ];
      
      // Call the program
      const signature = await interactWithProgram(PROGRAM_ID, instruction, accounts);
      
      setMessage({
        type: 'success',
        text: `Profile successfully ${doesProfileExist ? 'updated' : 'created'} on-chain!`
      });
      setTxSignature(signature);
    } catch (err) {
      console.error('Error updating on-chain profile:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update on-chain profile. Please try again.'
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">On-Chain Profile</h2>
      <p className="text-gray-600 mb-6">
        This profile information will be stored directly on the Solana blockchain.
        Updates require a transaction and may incur a small network fee.
      </p>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {txSignature && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm font-medium mb-1">Transaction Signature:</p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 break-all font-mono text-xs"
          >
            {txSignature}
          </a>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="onchain-displayName" className="block text-gray-700 font-medium mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="onchain-displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              formErrors.displayName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your display name"
          />
          {formErrors.displayName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.displayName}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="onchain-bio" className="block text-gray-700 font-medium mb-2">
            Bio
          </label>
          <textarea
            id="onchain-bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className={`w-full px-3 py-2 border ${
              formErrors.bio ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Tell us about yourself"
          ></textarea>
          {formErrors.bio && (
            <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Note: Due to blockchain storage costs, keep your bio concise. 
            Extended content should be stored off-chain.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Save On-Chain'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Technical Details</h3>
        <p className="text-xs text-gray-600">
          This component demonstrates how to interact with a Solana program.
          In a production application, you would need to deploy an actual Solana program
          and replace the example program ID in the constants file.
        </p>
      </div>
    </div>
  );
}