import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ConsentForm } from '../components/ConsentForm';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { FileText } from 'lucide-react';

export const IssueConsent: React.FC = () => {
  const { wallet, provider } = useWallet();
  const { mintConsent, loading, contractError } = useContract(provider, wallet.account);
  const location = useLocation();
  const [autofill, setAutofill] = useState<any>({});

  useEffect(() => {
    // Parse URL params for autofill
    const params = new URLSearchParams(location.search);
    const recipient = params.get('to') || '';
    const purpose = params.get('purpose') || '';
    const expiryDate = params.get('expiryDate') || '';
    const termsSummary = params.get('termsSummary') || '';
    setAutofill({ recipient, purpose, expiryDate, termsSummary });
  }, [location.search]);

  if (!wallet.isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Issue New Consent Token
        </h1>
        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
          Create a new consent token on the blockchain with your specified terms and conditions
        </p>
        {/* Show summary if present */}
        {autofill.termsSummary && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md inline-block text-left max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Summary of Terms/Consent</span>
            </div>
            <p className="text-sm text-yellow-800 whitespace-pre-line">{autofill.termsSummary}</p>
          </div>
        )}
      </div>
      <ConsentForm onSubmit={mintConsent} loading={loading} contractError={contractError} autofill={autofill} />
      <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-2xl p-8 border border-orange-500 border-opacity-10 shadow-lg shadow-orange-500/10">
        <h3 className="text-2xl font-semibold mb-4 text-orange-400">Important Notes</h3>
        <ul className="space-y-3 text-orange-100">
          <li className="flex items-start space-x-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>Consent tokens are immutable once created on the blockchain</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>You can revoke consent at any time before expiration</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>All transactions require a small BNB fee for gas</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-orange-400 mt-1">•</span>
            <span>Recipient addresses must be valid Ethereum addresses</span>
          </li>
        </ul>
      </div>
    </div>
  );
};