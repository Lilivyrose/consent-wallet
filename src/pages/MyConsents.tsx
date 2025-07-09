import React from 'react';
import { Navigate } from 'react-router-dom';
import { ConsentList } from '../components/ConsentList';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';

export const MyConsents: React.FC = () => {
  const { wallet, provider } = useWallet();
  const { consents, revokeConsent, fetchConsents, loading } = useContract(provider, wallet.account);

  if (!wallet.isConnected) {
    return <Navigate to="/" replace />;
  }

  const activeConsents = consents.filter(c => !c.isRevoked && c.expiryDate * 1000 > Date.now());
  const expiredConsents = consents.filter(c => !c.isRevoked && c.expiryDate * 1000 <= Date.now());
  const revokedConsents = consents.filter(c => c.isRevoked);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
          My Consent Tokens
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Manage all your issued consent tokens in one place
        </p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="text-3xl font-bold text-cyan-400">{consents.length}</div>
          <div className="text-gray-300">Total Tokens</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="text-3xl font-bold text-green-400">{activeConsents.length}</div>
          <div className="text-gray-300">Active</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="text-3xl font-bold text-yellow-400">{expiredConsents.length}</div>
          <div className="text-gray-300">Expired</div>
        </div>
        <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
          <div className="text-3xl font-bold text-red-400">{revokedConsents.length}</div>
          <div className="text-gray-300">Revoked</div>
        </div>
      </div>

      <ConsentList consents={consents} onRevoke={revokeConsent} loading={loading} />
      <ConsentList 
        consents={consents} 
        onRevoke={revokeConsent} 
        onRefresh={fetchConsents}
        loading={loading} 
      />
    </div>
  );
};