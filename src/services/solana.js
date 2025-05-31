// src/services/solana.js
import { 
    Connection, 
    PublicKey, 
    Transaction, 
    SystemProgram, 
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
  } from '@solana/web3.js';
  
  // Default connection to Solana devnet
  const getConnection = (endpoint) => {
    return new Connection(endpoint || import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
  };
  
  /**
   * Get the SOL balance for a wallet address
   * @param {string} address - Wallet address
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<number>} Balance in SOL
   */
  export const getBalance = async (address, connection = null) => {
    try {
      const conn = connection || getConnection();
      const publicKey = new PublicKey(address);
      const balance = await conn.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };
  
  /**
   * Get recent transactions for a wallet address
   * @param {string} address - Wallet address
   * @param {object} options - Options like limit, before, etc.
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<Array>} Array of transactions
   */
  export const getTransactions = async (address, options = { limit: 10 }, connection = null) => {
    try {
      const conn = connection || getConnection();
      const publicKey = new PublicKey(address);
      
      // Get signatures
      const signatures = await conn.getSignaturesForAddress(publicKey, options);
      
      // Get transaction details
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await conn.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            confirmationStatus: sig.confirmationStatus,
            err: sig.err,
            memo: tx?.meta?.logMessages?.find(msg => msg.startsWith('Program log: Memo')) || '',
            // You can extract more information from tx if needed
          };
        })
      );
      
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  };
  
  /**
   * Send SOL to another wallet
   * @param {object} payerKeypair - Keypair of sender (must be loaded from private key)
   * @param {string} toAddress - Recipient's wallet address
   * @param {number} amount - Amount to send in SOL
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<string>} Transaction signature
   */
  export const sendSol = async (payerKeypair, toAddress, amount, connection = null) => {
    try {
      const conn = connection || getConnection();
      const recipient = new PublicKey(toAddress);
      
      // Create a simple transaction to transfer SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payerKeypair.publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
        })
      );
      
      // Send transaction and confirm
      const signature = await sendAndConfirmTransaction(conn, transaction, [payerKeypair]);
      return signature;
    } catch (error) {
      console.error('Error sending SOL:', error);
      throw error;
    }
  };
  
  /**
   * Interact with a smart contract (program)
   * @param {string} programId - Program/contract ID
   * @param {object} payerKeypair - Keypair of transaction signer
   * @param {Buffer|Uint8Array} data - Instruction data
   * @param {Array} accounts - Accounts involved in the transaction
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<string>} Transaction signature
   */
  export const callProgram = async (programId, payerKeypair, data, accounts, connection = null) => {
    try {
      const conn = connection || getConnection();
      const program = new PublicKey(programId);
      
      // Create a custom instruction
      const instruction = {
        programId: program,
        keys: accounts.map(acc => ({
          pubkey: new PublicKey(acc.pubkey),
          isSigner: !!acc.isSigner,
          isWritable: !!acc.isWritable
        })),
        data: data
      };
      
      // Create transaction and add the instruction
      const transaction = new Transaction().add(instruction);
      
      // Set recent blockhash
      transaction.recentBlockhash = (await conn.getRecentBlockhash()).blockhash;
      transaction.feePayer = payerKeypair.publicKey;
      
      // Sign transaction
      transaction.sign(payerKeypair);
      
      // Send transaction
      const signature = await conn.sendRawTransaction(transaction.serialize());
      
      // Confirm transaction
      await conn.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error('Error calling program:', error);
      throw error;
    }
  };
  
  /**
   * Create a new account for a smart contract
   * @param {object} payerKeypair - Keypair of transaction signer
   * @param {number} space - Space to allocate for the account (in bytes)
   * @param {string} programId - Program that will own the new account
   * @param {object} newAccountKeypair - Keypair for the new account
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<string>} Transaction signature
   */
  export const createProgramAccount = async (
    payerKeypair, 
    space, 
    programId, 
    newAccountKeypair, 
    connection = null
  ) => {
    try {
      const conn = connection || getConnection();
      const program = new PublicKey(programId);
      
      // Calculate rent exemption amount
      const rentExemptionAmount = await conn.getMinimumBalanceForRentExemption(space);
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payerKeypair.publicKey,
          newAccountPubkey: newAccountKeypair.publicKey,
          lamports: rentExemptionAmount,
          space: space,
          programId: program
        })
      );
      
      // Send and confirm transaction
      const signature = await sendAndConfirmTransaction(
        conn,
        transaction,
        [payerKeypair, newAccountKeypair]
      );
      
      return signature;
    } catch (error) {
      console.error('Error creating program account:', error);
      throw error;
    }
  };
  
  /**
   * Get all token accounts for a wallet
   * @param {string} ownerAddress - Owner's wallet address
   * @param {Connection} connection - Optional custom connection
   * @returns {Promise<Array>} Array of token accounts
   */
  export const getTokenAccounts = async (ownerAddress, connection = null) => {
    try {
      const conn = connection || getConnection();
      const owner = new PublicKey(ownerAddress);
      
      // Get token accounts
      const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
        owner,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') } // SPL Token program ID
      );
      
      return tokenAccounts.value.map(account => ({
        address: account.pubkey.toString(),
        mint: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
      }));
    } catch (error) {
      console.error('Error getting token accounts:', error);
      throw error;
    }
  };
  
  export default {
    getConnection,
    getBalance,
    getTransactions,
    sendSol,
    callProgram,
    createProgramAccount,
    getTokenAccounts
  };