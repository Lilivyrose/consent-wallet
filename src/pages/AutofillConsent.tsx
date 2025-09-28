import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Globe, User, FileText, Calendar, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { normalizeAddress } from '../utils/addressUtils';
import { useWallet } from '../contexts/WalletContext';
import { assessPrivacyRisk, DataCollectionRequest } from '../utils/privacyRiskAssessment';
import { PrivacyRiskIndicator } from '../components/PrivacyRiskIndicator';

// Define proper types for form data
interface FormData {
  recipient: string;
  purpose: string;
  fields: string[];
  expiryDate: string;
  privacyUrl: string;
  sourceUrl: string;
  siteName: string;
}

export default function ShareData() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wallet } = useWallet();
  
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    purpose: '',
    fields: [],
    expiryDate: '',
    privacyUrl: '',
    sourceUrl: '',
    siteName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate privacy risk assessment
  const getPrivacyRiskAssessment = () => {
    if (!formData.purpose || formData.fields.length === 0) return null;

    const request: DataCollectionRequest = {
      websiteName: formData.siteName || 'Unknown Website',
      dataRequested: formData.fields,
      purpose: formData.purpose,
      website: formData.sourceUrl
    };

    return assessPrivacyRisk(request);
  };

  const riskAssessment = getPrivacyRiskAssessment();

  useEffect(() => {
    // Parse URL parameters
    const to = searchParams.get('to');
    const site = searchParams.get('site');
    const serviceName = searchParams.get('serviceName');
    const purpose = searchParams.get('purpose');
    const fields = searchParams.get('fields');
    const privacyUrl = searchParams.get('privacyUrl');
    const sourceUrl = searchParams.get('sourceUrl');
    const expiryDate = searchParams.get('expiryDate');

    const parsedFields = fields
      ? fields.split(',').map(field => field.trim()).filter(Boolean)
      : [];

    setFormData(prev => ({
      ...prev,
      recipient: to ? normalizeAddress(to) : '',
      purpose: purpose || '',
      fields: parsedFields,
      privacyUrl: privacyUrl || '',
      sourceUrl: sourceUrl || '',
      siteName: site || serviceName || '',
      expiryDate: expiryDate || '',
    }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit called. formData:', formData);
    
    if (!wallet.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!formData.recipient || !formData.purpose || formData.fields.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Here you would implement the actual data sharing logic
      // This could involve smart contract interactions, IPFS uploads, etc.
      
      console.log('Sharing data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or show success message
      navigate('/dashboard?shared=true');
      
    } catch (err) {
      setError('Failed to share data. Please try again.');
      console.error('Share data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const availableFields = [
    { id: 'name', label: 'Full Name', icon: User },
    { id: 'email', label: 'Email Address', icon: FileText },
    { id: 'phone', label: 'Phone Number', icon: FileText },
    { id: 'address', label: 'Physical Address', icon: Globe },
    { id: 'birthdate', label: 'Date of Birth', icon: Calendar },
    { id: 'occupation', label: 'Occupation', icon: FileText },
    { id: 'location', label: 'Location', icon: Globe },
    { id: 'cookies', label: 'Cookies', icon: FileText },
    { id: 'ip address', label: 'IP Address', icon: Globe },
    { id: 'analytics', label: 'Analytics Data', icon: FileText },
    { id: 'advertising', label: 'Advertising Data', icon: FileText },
    { id: 'personal information', label: 'Personal Information', icon: FileText },
  ];

  const toggleField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter(id => id !== fieldId)
        : [...prev.fields, fieldId]
    }));
  };

  const isFormValid = formData.recipient && formData.purpose && formData.fields.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Share Personal Data</h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Securely share your personal information with verified recipients
            </p>
          </div>

          {/* Privacy Risk Assessment */}
          {riskAssessment && (
            <div className="p-6 border-b border-gray-200">
              <PrivacyRiskIndicator assessment={riskAssessment} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address *
              </label>
              <input
                type="text"
                id="recipient"
                value={formData.recipient}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="0x..."
                required
              />
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Data Sharing *
              </label>
              <textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Describe why you're sharing this data..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Data Fields to Share *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableFields.map((field) => {
                  const Icon = field.icon;
                  const isSelected = formData.fields.includes(field.id);
                  
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => toggleField(field.id)}
                      className={`flex items-center space-x-3 p-3 border rounded-md transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{field.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Access Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty for permanent access
              </p>
            </div>

            {formData.privacyUrl && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Privacy Policy</span>
                </div>
                <a
                  href={formData.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center space-x-1 text-sm text-blue-700 hover:text-blue-800"
                >
                  <span>Review privacy policy</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {formData.siteName && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Consent Detection</span>
                </div>
                <p className="mt-2 text-sm text-orange-700">
                  This consent was detected from your interaction on <strong>{formData.siteName}</strong>. 
                  Review the details and set an expiry date to issue your blockchain consent token.
                </p>
              </div>
            )}

            {formData.sourceUrl && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Source Application</span>
                </div>
                <a
                  href={formData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-800"
                >
                  <span>Visit source application</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 px-6 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sharing...' : 'Share Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}