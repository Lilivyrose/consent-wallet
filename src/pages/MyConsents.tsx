import React from 'react';
import { Navigate } from 'react-router-dom';
import { ConsentList } from '../components/ConsentList';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';

export const MyConsents: React.FC = () => {
  const { wallet, provider } = useWallet();
  const { consents, revokeConsent, fetchConsents, loading, contractError, activateConsent, abandonConsent } = useContract(provider, wallet.account, wallet.isCorrectNetwork);
  if (!wallet.isConnected) {
    return <Navigate to="/" replace />;
  }

  const activeConsents = consents.filter(c => !c.isRevoked && c.expiryDate * 1000 > Date.now());
  const expiredConsents = consents.filter(c => !c.isRevoked && c.expiryDate * 1000 <= Date.now());
  const revokedConsents = consents.filter(c => c.isRevoked);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          My Consent Tokens
        </h1>
        <p className="text-xl text-orange-100 max-w-2xl mx-auto">
          Manage all your issued consent tokens in one place
        </p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-orange-500 border-opacity-10 shadow-lg shadow-orange-500/10">
          <div className="text-3xl font-bold text-orange-400">{consents.length}</div>
          <div className="text-orange-200">Total Tokens</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-orange-500 border-opacity-10 shadow-lg shadow-orange-500/10">
          <div className="text-3xl font-bold text-orange-400">{activeConsents.length}</div>
          <div className="text-orange-200">Active</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-orange-500 border-opacity-10 shadow-lg shadow-orange-500/10">
          <div className="text-3xl font-bold text-yellow-400">{expiredConsents.length}</div>
          <div className="text-orange-200">Expired</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-orange-500 border-opacity-10 shadow-lg shadow-orange-500/10">
          <div className="text-3xl font-bold text-red-400">{revokedConsents.length}</div>
          <div className="text-orange-200">Revoked</div>
        </div>
      </div>

      <ConsentList 
        consents={consents} 
        onRevoke={revokeConsent} 
        onActivate={activateConsent}
        onAbandon={abandonConsent}
        onRefresh={fetchConsents}
        loading={loading}
        contractError={contractError}
      />
    </div>
  );
};