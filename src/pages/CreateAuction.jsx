// src/pages/CreateAuction.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGavel, faArrowLeft, faCalendarAlt, 
  faDollarSign, faMapMarkerAlt, faRobot, 
  faFileAlt, faFileUpload, faSpinner, faImage, faInfo
} from '@fortawesome/free-solid-svg-icons';
import DOGEAssist from '../utils/DOGEAssist';

export default function CreateAuction() {
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
    startingBid: '',
    reservePrice: '',
    minBidIncrement: '',
    currency: 'USDC',
    location: '',
    startDate: '',
    endDate: '',
    itemImages: [],
    itemDetails: '',
    termsFile: null,
    additionalFile: null
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // AI suggestions (mock data)
  const [aiSuggestions, setAiSuggestions] = useState({
    recommendedStartingBid: '',
    recommendedReservePrice: '',
    recommendedDuration: '',
    loading: false
  });
  
  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'GRAINS', label: 'Grains' },
    { value: 'VEGETABLES', label: 'Vegetables' },
    { value: 'REAL_ESTATE', label: 'Real Estate' },
    { value: 'SERVICES', label: 'Services' },
    { value: 'ART', label: 'Art & Collectibles' }
  ];
  
  const currencies = ['USDC', 'SOL', 'PLN', 'EUR', 'USD'];
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'itemImages' && files) {
      // Handle multiple file upload for images
      setFormData(prev => ({
        ...prev,
        [name]: [...prev.itemImages, ...Array.from(files)]
      }));
    } else if (files) {
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
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      itemImages: prev.itemImages.filter((_, i) => i !== index)
    }));
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
    
    if (!formData.startingBid) {
      newErrors.startingBid = 'Starting bid is required';
    } else if (isNaN(formData.startingBid) || parseFloat(formData.startingBid) <= 0) {
      newErrors.startingBid = 'Please enter a valid amount';
    }
    
    if (formData.reservePrice && (isNaN(formData.reservePrice) || parseFloat(formData.reservePrice) <= 0)) {
      newErrors.reservePrice = 'Please enter a valid amount';
    }
    
    if (!formData.minBidIncrement) {
      newErrors.minBidIncrement = 'Minimum bid increment is required';
    } else if (isNaN(formData.minBidIncrement) || parseFloat(formData.minBidIncrement) <= 0) {
      newErrors.minBidIncrement = 'Please enter a valid amount';
    }
    
    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const selectedEndDate = new Date(formData.endDate);
      const selectedStartDate = new Date(formData.startDate || Date.now());
      const now = new Date();
      
      if (selectedEndDate <= now) {
        newErrors.endDate = 'End date must be in the future';
      }
      
      if (selectedEndDate <= selectedStartDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (formData.itemImages.length === 0) {
      newErrors.itemImages = 'At least one image is required';
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
      let startingBid, reservePrice, duration;
      
      switch (formData.category) {
        case 'EQUIPMENT':
          startingBid = '1000';
          reservePrice = '3000';
          duration = '3-5 days';
          break;
        case 'CONSTRUCTION':
          startingBid = '5000';
          reservePrice = '15000';
          duration = '7-10 days';
          break;
        case 'GRAINS':
          startingBid = '500';
          reservePrice = '1200';
          duration = '2-3 days';
          break;
        case 'VEGETABLES':
          startingBid = '200';
          reservePrice = '800';
          duration = '1-2 days';
          break;
        case 'REAL_ESTATE':
          startingBid = '50000';
          reservePrice = '150000';
          duration = '14-21 days';
          break;
        case 'ART':
          startingBid = '100';
          reservePrice = '500';
          duration = '7-10 days';
          break;
        default:
          startingBid = '1000';
          reservePrice = '3000';
          duration = '5-7 days';
      }
      
      setAiSuggestions({
        recommendedStartingBid: startingBid,
        recommendedReservePrice: reservePrice,
        recommendedDuration: duration,
        loading: false
      });
    }, 2000);
  };
  
  const handleGenerateTerms = () => {
    if (!formData.title || !formData.category || !formData.description) {
      setErrors(prev => ({
        ...prev,
        termsGeneration: 'Please fill in the auction details to generate terms and conditions'
      }));
      return;
    }
    
    setIsGeneratingDocs(true);
    
    // Simulate document generation
    setTimeout(() => {
      setIsGeneratingDocs(false);
      
      // Mock a file download by creating a blob and link
      const blob = new Blob(['Mock terms and conditions for ' + formData.title], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'auction_terms_template.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Update the termsFile field
      setFormData(prev => ({
        ...prev,
        termsFile: new File([blob], 'auction_terms_template.txt', { type: 'text/plain' })
      }));
    }, 3000);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !address) { // Replace publicKey with address
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
      console.log('Creating auction with data:', formData);
      
      // Simulate transaction and processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success and redirect
      alert('Auction created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating auction:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create auction. Please try again.'
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
      
      <h1 className="text-3xl font-bold mb-6 text-gold">Create New Auction</h1>
      
      <div className="bg-brown-dark rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faGavel} className="mr-2 text-gold" />
                Auction Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Auction Title*
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
                    placeholder="Enter auction title"
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
                    placeholder="Describe the auction item, condition, and other relevant details"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Item Details & Images */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-gold" />
                Item Details & Images
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="itemDetails" className="block text-sm font-medium text-gray-300 mb-1">
                    Detailed Specifications
                  </label>
                  <textarea
                    id="itemDetails"
                    name="itemDetails"
                    value={formData.itemDetails}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-3 py-2 bg-brown-medium border ${
                      errors.itemDetails ? 'border-red-500' : 'border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200`}
                    placeholder="List technical specifications, dimensions, condition details, etc."
                  ></textarea>
                  {errors.itemDetails && (
                    <p className="mt-1 text-sm text-red-500">{errors.itemDetails}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Images* (at least one)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gold transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <FontAwesomeIcon icon={faImage} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="itemImages" className="relative cursor-pointer rounded-md font-medium text-gold hover:text-gold-light">
                          <span>Upload images</span>
                          <input
                            id="itemImages"
                            name="itemImages"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                  </div>
                  {errors.itemImages && (
                    <p className="mt-1 text-sm text-red-500">{errors.itemImages}</p>
                  )}
                  
                  {/* Image Previews */}
                  {formData.itemImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Uploaded Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.itemImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="h-24 w-full bg-brown-medium rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Upload ${index + 1}`}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Auction Settings */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gold" />
                Auction Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startingBid" className="block text-sm font-medium text-gray-300 mb-1">
                    Starting Bid*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="startingBid"
                      name="startingBid"
                      value={formData.startingBid}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.startingBid ? 'border-red-500' : 'border-gray-600'
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
                  {errors.startingBid && (
                    <p className="mt-1 text-sm text-red-500">{errors.startingBid}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-300 mb-1">
                    Reserve Price (Optional)
                    <span className="ml-1 text-gray-400 text-xs">
                      <FontAwesomeIcon icon={faInfo} className="mr-1" />
                      Minimum price to complete sale
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="reservePrice"
                      name="reservePrice"
                      value={formData.reservePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.reservePrice ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pr-16`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <span className="pr-3 text-gray-400">{formData.currency}</span>
                    </div>
                  </div>
                  {errors.reservePrice && (
                    <p className="mt-1 text-sm text-red-500">{errors.reservePrice}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="minBidIncrement" className="block text-sm font-medium text-gray-300 mb-1">
                    Minimum Bid Increment*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="minBidIncrement"
                      name="minBidIncrement"
                      value={formData.minBidIncrement}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.minBidIncrement ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pr-16`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <span className="pr-3 text-gray-400">{formData.currency}</span>
                    </div>
                  </div>
                  {errors.minBidIncrement && (
                    <p className="mt-1 text-sm text-red-500">{errors.minBidIncrement}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Item Location*
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
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date and Time*
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-brown-medium border ${
                        errors.startDate ? 'border-red-500' : 'border-gray-600'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-gray-200 pl-10`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Recommended Starting Bid:</p>
                      <p className="text-lg text-gray-200">{aiSuggestions.recommendedStartingBid} {formData.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recommended Reserve Price:</p>
                      <p className="text-lg text-gray-200">{aiSuggestions.recommendedReservePrice} {formData.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Recommended Duration:</p>
                      <p className="text-lg text-gray-200">{aiSuggestions.recommendedDuration}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Based on analysis of similar auctions in the {
                      categories.find(c => c.value === formData.category)?.label || formData.category
                    } category.
                  </p>
                </div>
              )}
            </div>
            
            {/* Terms & Documents */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gold" />
                Terms & Documents
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="termsFile" className="block text-sm font-medium text-gray-300">
                      Terms & Conditions
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateTerms}
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
                        <label htmlFor="termsFile" className="relative cursor-pointer rounded-md font-medium text-gold hover:text-gold-light">
                          <span>Upload a file</span>
                          <input
                            id="termsFile"
                            name="termsFile"
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
                  {formData.termsFile && (
                    <p className="mt-2 text-sm text-gray-300">
                      Selected: {formData.termsFile.name}
                    </p>
                  )}
                </div>
                
                <div>
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
                    Creating Auction...
                  </>
                ) : (
                  'Create Auction'
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