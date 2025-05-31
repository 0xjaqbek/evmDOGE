// src/utils/validators.js - Form validators
/**
 * Validate profile form fields
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with errors
 */
export const validateProfileForm = (formData) => {
    const errors = {};
    
    // Validate display name
    if (!formData.displayName) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }
    
    // Validate bio
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }
    
    // Add other field validations as needed
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
  
  /**
   * Validate a transaction form
   * @param {object} formData - Form data to validate
   * @returns {object} Validation result with errors
   */

  import { isValidSolanaAddress } from './helpers';
  export const validateTransactionForm = (formData) => {
    const errors = {};
    
    // Validate recipient address
    if (!formData.recipient) {
      errors.recipient = 'Recipient address is required';
    } else if (!isValidSolanaAddress(formData.recipient)) {
      errors.recipient = 'Invalid Solana address';
    }
    
    // Validate amount
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be a positive number';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };