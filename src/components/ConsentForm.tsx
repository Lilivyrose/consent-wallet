import React, { useState } from 'react';
import { Send, User, FileText, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { ConsentFormData } from '../types';
import { useWallet } from '../hooks/useWallet';
import { validateConsentForm, formatTransactionError } from '../utils/validation';

interface ConsentFormProps {
  onSubmit: (data: ConsentFormData) => Promise<void>;
  loading: boolean;
}

export const ConsentForm: React.FC<ConsentFormProps> = ({ onSubmit, loading }) => {
  const { wallet } = useWallet();
  const [formData, setFormData] = useState<ConsentFormData>({
    recipient: '',
    purpose: '',
    expiryDate: ''
  });

  const [errors, setErrors] = useState<Partial<ConsentFormData>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const validation = validateConsentForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!wallet.isCorrectNetwork) {
      alert('Please switch to BNB Smart Chain Testnet');
      return;
    }

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({ recipient: '', purpose: '', expiryDate: '' });
      setErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = formatTransactionError(error);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ConsentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {success && (
        <div className="mb-6 flex items-center space-x-3 p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <div>
            <p className="text-green-400 font-semibold">Consent Token Issued Successfully!</p>
            <p className="text-green-300 text-sm">Your consent token has been minted on the blockchain.</p>
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

      <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
          Issue New Consent Token
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <User className="h-4 w-4" />
              <span>Recipient Wallet Address</span>
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            />
            {errors.recipient && (
              <p className="text-red-400 text-sm mt-1">{errors.recipient}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="h-4 w-4" />
              <span>Purpose of Consent</span>
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of this consent..."
              rows={4}
              className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 resize-none"
            />
            {errors.purpose && (
              <p className="text-red-400 text-sm mt-1">{errors.purpose}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Expiry Date</span>
            </label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            />
            {errors.expiryDate && (
              <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !wallet.isConnected || !wallet.isCorrectNetwork}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg font-semibold text-black transition-all duration-200 transform ${
              loading || !wallet.isConnected || !wallet.isCorrectNetwork
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-cyan-300 hover:to-green-300 hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>
                  {!wallet.isConnected 
                    ? 'Connect Wallet First' 
                    : !wallet.isCorrectNetwork 
                    ? 'Switch to BNB Testnet' 
                    : 'Issue Consent Token'
                  }
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};