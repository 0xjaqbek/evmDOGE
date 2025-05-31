// src/pages/CreateTender.jsx - Updated for Ethereum
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileContract, faArrowLeft, faCalendarAlt, 
  faDollarSign, faMapMarkerAlt, faRobot, 
  faFileAlt, faFileUpload, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import DOGEAssist from '../utils/DOGEAssist';

export default function CreateTender() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    maxAmount: '',
    currency: 'USDC',
    location: '',
    endDate: '',
    requirementFile: null,
    contractFile: null,
    additionalFile: null
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // AI suggestions (mock data)
  const [aiSuggestions, setAiSuggestions] = useState({
    recommendedAmount: '',
    recommendedTimeframe: '',
    loading: false
  });
  
  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'GRAINS', label: 'Grains' },
    { value: 'VEGETABLES', label: 'Vegetables' },
    { value: 'REAL_ESTATE', label: 'Real Estate' },
    { value: 'SERVICES', label: 'Services' }
  ];
  
  const currencies = ['USDC', 'ETH', 'DAI', 'EUR', 'USD'];
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.maxAmount) {
      newErrors.maxAmount = 'Maximum amount is required';
    } else if (isNaN(formData.maxAmount) || parseFloat(formData.maxAmount) <= 0) {
      newErrors.maxAmount = 'Please enter a valid amount';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const selectedDate = new Date(formData.endDate);
      const now = new Date();
      
      if (selectedDate <= now) {
        newErrors.endDate = 'End date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAiSuggest = () => {
    if (!formData.category || !formData.description) {
      setErrors(prev => ({
        ...prev,
        aiSuggestion: 'Please enter a category and description to get AI suggestions'
      }));
      return;
    }
    
    setAiSuggestions(prev => ({ ...prev, loading: true }));
    setShowAiSuggestions(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate mock suggestions based on category
      let amount, timeframe;
      
      switch (formData.category) {
        case 'EQUIPMENT':
          amount = '25000-35000';
          timeframe = '14-21 days';
          break;
        case 'CONSTRUCTION':
          amount = '85000-120000';
          timeframe = '30-45 days';
          break;
        case 'GRAINS':
          amount = '5000-15000';
          timeframe = '7-14 days';
          break;
        case 'VEGETABLES':
          amount = '2000-8000';
          timeframe = '5-10 days';
          break;
        case 'REAL_ESTATE':
          amount = '250000-500000';
          timeframe = '45-60 days';
          break;
        case 'SERVICES':
          amount = '10000-25000';
          timeframe = '21-30 days';
          break;
        default:
          amount = '15000-30000';
          timeframe = '14-30 days';
      }
      
      setAiSuggestions({
        recommendedAmount: amount,
        recommendedTimeframe: timeframe,
        loading: false
      });
    }, 2000);
  };
  
  const handleGenerateContract = () => {
    if (!formData.title || !formData.category || !formData.description) {
      setErrors(prev => ({
        ...prev,
        contractGeneration: 'Please fill in the tender details to generate a contract'
      }));
      return;
    }
    
    setIsGeneratingDocs(true);
    
    // Simulate document generation
    setTimeout(() => {
      setIsGeneratingDocs(false);
      
      // Mock a file download by creating a blob and link
      const blob = new Blob(['Mock contract template for ' + formData.title], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tender_contract_template.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Update the contractFile field
      setFormData(prev => ({
        ...prev,
        contractFile: new File([blob], 'tender_contract_template.txt', { type: 'text/plain' })
      }));
    }, 3000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be an actual blockchain transaction in a real app
      console.log('Creating tender with data:', formData);
      
      // Simulate transaction and processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success and redirect
      alert('Tender created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating tender:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create tender. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-gold transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-gold">Create New Tender</h1>
      
      <div className="bg-brown-dark rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gold" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Tender Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-brown-medium border ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200`}
                    placeholder="Enter tender title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-brown-medium border ${
                      errors.category ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200`}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 bg-brown-medium border ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200`}
                    placeholder="Describe the tender details, requirements, and specifications"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Financial Details */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gold" />
                Financial Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-300 mb-1">
                    Maximum Amount*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="maxAmount"
                      name="maxAmount"
                      value={formData.maxAmount}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.maxAmount ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pr-16`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="h-full rounded-r-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-300 focus:outline-none focus:ring-0"
                      >
                        {currencies.map((currency) => (
                          <option key={currency} value={currency} className="bg-brown-dark">
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.maxAmount && (
                    <p className="mt-1 text-sm text-red-500">{errors.maxAmount}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.location ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pl-10`}
                      placeholder="City, Country"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                    </div>
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date and Time*
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.endDate ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pl-10`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
                
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={handleAiSuggest}
                    className={`w-full flex items-center justify-center px-4 py-2 bg-brown-medium border border-gold text-gold rounded-md hover:bg-brown-light transition-colors ${
                      aiSuggestions.loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={aiSuggestions.loading}
                  >
                    {aiSuggestions.loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Getting AI Suggestions...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faRobot} className="mr-2" />
                        Get AI Suggestions
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* AI Suggestions */}
              {showAiSuggestions && !aiSuggestions.loading && (
                <div className="mt-4 p-4 bg-brown-medium border border-gold rounded-md">
                  <h3 className="text-lg font-medium mb-2 text-gold">AI Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Recommended Amount Range:</p>
                      <p className="text-lg text-gray-200">{aiSuggestions.recommendedAmount} {formData.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recommended Timeframe:</p>
                      <p className="text-lg text-gray-200">{aiSuggestions.recommendedTimeframe}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Based on analysis of similar tenders in the {
                      categories.find(c => c.value === formData.category)?.label || formData.category
                    } category.
                  </p>
                </div>
              )}
            </div>
            
            {/* Documents & Attachments */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                Documents & Attachments
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="requirementFile" className="block text-sm font-medium text-gray-300 mb-1">
                    Requirements Specification
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gold transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <FontAwesomeIcon icon={faFileUpload} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="requirementFile" className="relative cursor-pointer rounded-md font-medium text-gold hover:text-gold-light">
                          <span>Upload a file</span>
                          <input
                            id="requirementFile"
                            name="requirementFile"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.requirementFile && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {formData.requirementFile.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="contractFile" className="block text-sm font-medium text-gray-300">
                      Contract Template
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateContract}
                      className={`text-xs text-gold hover:text-gold-light ${
                        isGeneratingDocs ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={isGeneratingDocs}
                    >
                      {isGeneratingDocs ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faRobot} className="mr-1" />
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gold transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <FontAwesomeIcon icon={faFileUpload} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="contractFile" className="relative cursor-pointer rounded-md font-medium text-gold hover:text-gold-light">
                          <span>Upload a file</span>
                          <input
                            id="contractFile"
                            name="contractFile"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.contractFile && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {formData.contractFile.name}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="additionalFile" className="block text-sm font-medium text-gray-300 mb-1">
                    Additional Documents
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gold transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <FontAwesomeIcon icon={faFileUpload} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="additionalFile" className="relative cursor-pointer rounded-md font-medium text-gold hover:text-gold-light">
                          <span>Upload a file</span>
                          <input
                            id="additionalFile"
                            name="additionalFile"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF, DOCX, XLSX up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.additionalFile && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {formData.additionalFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Section */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mr-4 px-6 py-3 bg-brown-medium text-gray-200 rounded-md hover:bg-brown-light transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gold text-black rounded-md hover:bg-gold-dark transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Creating Tender...
                  </>
                ) : (
                  'Create Tender'
                )}
              </button>
            </div>
            
            {errors.submit && (
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 text-red-200 rounded-md">
                {errors.submit}
              </div>
            )}
          </div>
        </form>
      </div>
      
      {/* DOGEAssist Integration */}
      <DOGEAssist />
    </div>
  );
}