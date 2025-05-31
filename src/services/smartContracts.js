// src/services/smartContracts.js - Utilities for interacting with Solana smart contracts

import { 
    PublicKey, 
    Transaction, 
    TransactionInstruction,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
  } from '@solana/web3.js';

  import { Buffer } from '../utils/buffer-polyfill';
  
  // Example program ID (replace with your actual program ID)
  export const EXAMPLE_PROGRAM_ID = 'ExampLEProGraMiDXXXXXXXXXXXXXXXXXXXXXXXXX';
  
  /**
   * Helper function to create a transaction for a program call
   * @param {string} programId - Program ID 
   * @param {Buffer|Uint8Array} data - Instruction data
   * @param {Array} accountMetas - Account metadata objects
   * @param {PublicKey} feePayer - Fee payer public key
   * @param {Connection} connection - Solana connection
   * @returns {Promise<Transaction>} - Transaction object
   */
  export const createProgramTransaction = async (
    programId,
    data,
    accountMetas,
    feePayer,
    connection
  ) => {
    const transaction = new Transaction();
    
    // Get a recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feePayer;
    
    // Create the program instruction
    const instruction = new TransactionInstruction({
      keys: accountMetas,
      programId: new PublicKey(programId),
      data: data,
    });
    
    // Add instruction to transaction
    transaction.add(instruction);
    
    return transaction;
  };
  
  /**
   * Helper function to create a transfer SOL transaction
   * @param {PublicKey} from - Sender public key
   * @param {PublicKey} to - Recipient public key
   * @param {number} amount - Amount in SOL
   * @param {Connection} connection - Solana connection
   * @returns {Promise<Transaction>} - Transaction object
   */
  export const createTransferTransaction = async (
    from,
    to,
    amount,
    connection
  ) => {
    const transaction = new Transaction();
    
    // Get a recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = from;
    
    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: amount * 1000000000, // Convert SOL to lamports
      })
    );
    
    return transaction;
  };
  
  // Example: Create a program instruction for a hypothetical "create profile" function
  export const createProfileInstruction = (
    programId,
    profileAccount,
    owner,
    displayName,
    bio
  ) => {
    // Create a buffer for the instruction data
    // Instruction 0 = Create Profile
    const instructionLayout = Buffer.alloc(1 + 32 + 32);
    instructionLayout.writeUInt8(0, 0); // Instruction index (0 = create profile)
    
    // Encode display name (max 32 bytes)
    const displayNameBuffer = Buffer.from(displayName);
    const displayNameLength = Math.min(displayNameBuffer.length, 32);
    displayNameBuffer.copy(instructionLayout, 1, 0, displayNameLength);
    
    // Encode bio (max 32 bytes - in a real app, this would be larger)
    const bioBuffer = Buffer.from(bio);
    const bioLength = Math.min(bioBuffer.length, 32);
    bioBuffer.copy(instructionLayout, 33, 0, bioLength);
    
    // Create account metas
    const accountMetas = [
      { pubkey: profileAccount, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: true, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];
    
    // Return the instruction
    return new TransactionInstruction({
      keys: accountMetas,
      programId: new PublicKey(programId),
      data: instructionLayout,
    });
  };
  
  // Example: Create a program instruction for a hypothetical "update profile" function
  export const updateProfileInstruction = (
    programId,
    profileAccount,
    owner,
    displayName,
    bio
  ) => {
    // Create a buffer for the instruction data
    // Instruction 1 = Update Profile
    const instructionLayout = Buffer.alloc(1 + 32 + 32);
    instructionLayout.writeUInt8(1, 0); // Instruction index (1 = update profile)
    
    // Encode display name (max 32 bytes)
    const displayNameBuffer = Buffer.from(displayName);
    const displayNameLength = Math.min(displayNameBuffer.length, 32);
    displayNameBuffer.copy(instructionLayout, 1, 0, displayNameLength);
    
    // Encode bio (max 32 bytes - in a real app, this would be larger)
    const bioBuffer = Buffer.from(bio);
    const bioLength = Math.min(bioBuffer.length, 32);
    bioBuffer.copy(instructionLayout, 33, 0, bioLength);
    
    // Create account metas
    const accountMetas = [
      { pubkey: profileAccount, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: true, isWritable: false },
    ];
    
    // Return the instruction
    return new TransactionInstruction({
      keys: accountMetas,
      programId: new PublicKey(programId),
      data: instructionLayout,
    });
  };
  
  // Example: Function to derive a profile account address from a user's public key
  export const deriveProfileAccount = (owner, programId) => {
    // This is a simplified version - in a real application, you would use findProgramAddress
    // to derive a PDA (Program Derived Address)
    const [profileAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('profile'), owner.toBuffer()],
      new PublicKey(programId)
    );
    
    return profileAccount;
  };
  
  export default {
    createProgramTransaction,
    createTransferTransaction,
    createProfileInstruction,
    updateProfileInstruction,
    deriveProfileAccount,
    EXAMPLE_PROGRAM_ID,
  };