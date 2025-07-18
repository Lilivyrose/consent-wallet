import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { Shield, Globe, User, FileText, Calendar, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { validateConsentForm, formatTransactionError } from '../utils/validation';

export default function AutofillConsent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { wallet, provider } = useWallet();
  const { mintConsent, loading: contractLoading, contractError } = useContract(provider, wallet.account);
  
  const [formData, setFormData] = useState({
    recipient: '',
    purpose: '',
    expiryDate: '',
    website: '',
    dataFields: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!wallet.isConnected) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    // Parse URL parameters
    const to = searchParams.get('to');
    const site = searchParams.get('site');
    const serviceName = searchParams.get('serviceName');
    const purpose = searchParams.get('purpose');
    const fields = searchParams.get('fields');
    const privacyUrl = searchParams.get('privacyUrl');
    const sourceUrl = searchParams.get('sourceUrl');

    console.log('AutofillConsent URL params:', { to, site, serviceName, purpose, fields, privacyUrl, sourceUrl });
    
    if (to) {
      setFormData(prev => ({ ...prev, recipient: to }));
    }
    
    if (purpose) {
      setFormData(prev => ({ ...prev, purpose }));
    }
    
    if (fields) {
      setFormData(prev => ({ ...prev, dataFields: fields }));
    }
    
    if (site || serviceName) {
      setFormData(prev => ({ ...prev, website: site || serviceName }));
    }

    // Set default expiry date to 1 year from now
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
    setFormData(prev => ({ 
      ...prev, 
      expiryDate: defaultExpiry.toISOString().slice(0, 16) 
    }));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wallet.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!wallet.isCorrectNetwork) {
      setError('Please switch to BNB Smart Chain Testnet');
      return;
    }

    // Validate form data
    const validation = validateConsentForm({
      recipient: formData.recipient,
      purpose: formData.purpose,
      expiryDate: formData.expiryDate
    });

    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0] || 'Please check your input');
      return;
    }

    setError('');

    try {
      console.log('🚀 Issuing consent with data:', formData);
      await mintConsent({
        recipient: formData.recipient,
        purpose: formData.purpose,
        expiryDate: formData.expiryDate
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-consents');
      }, 2000);
    } catch (err) {
      const errorMessage = formatTransactionError(err);
      setError(`Transaction failed: ${errorMessage}`);
      console.error('Consent issuance error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Issue Consent Token
        </h1>
        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
          Consent detected from website - Review and issue blockchain token
        </p>
      </div>
          </div>

      {success && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-30 rounded-lg shadow-lg shadow-orange-500/20">
          <CheckCircle className="h-6 w-6 text-orange-400" />
          <div>
            <p className="text-orange-400 font-semibold">Consent Token Issued Successfully!</p>
            <p className="text-orange-300 text-sm">Your consent token has been minted on the blockchain. Redirecting...</p>
          </div>
        </div>
      )}

      {!wallet.isCorrectNetwork && wallet.isConnected && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">Wrong Network</p>
            <p className="text-red-300 text-sm">Please switch to BNB Smart Chain Testnet to continue.</p>
          </div>
        </div>
      )}

      {contractError && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">Contract Configuration Error</p>
            <p className="text-red-300 text-sm">{contractError}</p>
          </div>
        </div>
      )}

      <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-2xl p-8 border border-orange-500 border-opacity-20 shadow-2xl shadow-orange-500/10">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Detected Consent Information
        </h2>

        {formData.website && (
          <div className="mb-6 p-4 bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-semibold">Consent Detected From: {formData.website}</span>
            </div>
            <p className="mt-2 text-orange-300 text-sm">
              This consent was automatically detected from your interaction on the website.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-orange-200 mb-2">
              <User className="h-4 w-4" />
              <span>Recipient Wallet Address</span>
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white bg-opacity-5 rounded-lg border border-orange-500 border-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-inner"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-orange-200 mb-2">
              <FileText className="h-4 w-4" />
              <span>Purpose of Consent</span>
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              placeholder="Describe the purpose of this consent..."
              rows={4}
              className="w-full px-4 py-3 bg-white bg-opacity-5 rounded-lg border border-orange-500 border-opacity-30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 resize-none shadow-inner"
              required
            />
          </div>

          {formData.dataFields && (
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-orange-200 mb-2">
                <FileText className="h-4 w-4" />
                <span>Detected Data Fields</span>
              </label>
              <div className="p-3 bg-white bg-opacity-5 rounded-lg border border-orange-500 border-opacity-30">
                <p className="text-orange-300 text-sm">{formData.dataFields}</p>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-orange-200 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Expiry Date</span>
            </label>
            <input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-4 py-3 bg-white bg-opacity-5 rounded-lg border border-orange-500 border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-inner"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 backdrop-blur-md bg-white bg-opacity-5 rounded-lg font-semibold border border-orange-500 border-opacity-20 hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={contractLoading || !wallet.isConnected || !wallet.isCorrectNetwork || !!contractError}
              className={`flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-semibold text-black transition-all duration-200 transform shadow-lg shadow-orange-500/30 ${
                contractLoading || !wallet.isConnected || !wallet.isCorrectNetwork || !!contractError
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-orange-400 hover:to-yellow-400 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40'
              }`}
            >
              {contractLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Issue Consent Token'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );