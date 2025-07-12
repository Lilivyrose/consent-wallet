import React from 'react';
import { Shield, User, FileText, Calendar, X, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { ConsentToken } from '../types';
import { useWallet } from '../contexts/WalletContext';

interface ConsentListProps {
  consents: ConsentToken[];
  onRevoke: (tokenId: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
  loading: boolean;
  contractError?: string | null;
}

export const ConsentList: React.FC<ConsentListProps> = ({ consents, onRevoke, onRefresh, loading, contractError }) => {
  const { wallet } = useWallet();
  const [revokingTokens, setRevokingTokens] = React.useState<Set<number>>(new Set());

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatus = (consent: ConsentToken) => {
    if (consent.isRevoked) return 'revoked';
    if (consent.expiryDate * 1000 < Date.now()) return 'expired';
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-orange-400" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'revoked':
        return <X className="h-5 w-5 text-red-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-orange-400 bg-orange-400 bg-opacity-20';
      case 'expired':
        return 'text-yellow-400 bg-yellow-400 bg-opacity-20';
      case 'revoked':
        return 'text-red-400 bg-red-400 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-400 bg-opacity-20';
    }
  };

  const handleRevoke = async (tokenId: number) => {
    // Prevent default form submission behavior
    event?.preventDefault();
    
    if (!wallet.isConnected || !wallet.isCorrectNetwork) {
      alert('Please connect to BNB Smart Chain Testnet');
      return;
    }

    setRevokingTokens(prev => new Set(prev).add(tokenId));
    try {
      await onRevoke(tokenId);
    } catch (error) {
      console.error('Error revoking consent:', error);
      alert('Failed to revoke consent. Please try again.');
    } finally {
      setRevokingTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRefresh) {
      await onRefresh();
    }
  };
  
  if (contractError) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
          <h3 className="text-2xl font-semibold text-red-400">Contract Configuration Error</h3>
          <p className="text-gray-400 max-w-md mx-auto">{contractError}</p>
          <p className="text-orange-300 text-sm">Please check your contract address and ABI configuration.</p>
        </div>
      </div>
    );
  }
  
  if (consents.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="space-y-4">
          <Shield className="h-16 w-16 text-gray-400 mx-auto" />
          <h3 className="text-2xl font-semibold text-orange-200">No Consent Tokens Yet</h3>
          <p className="text-gray-400">Issue your first consent token to get started</p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 bg-opacity-20 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 mx-auto disabled:opacity-50 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Your Consent Tokens
        </h2>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 bg-opacity-20 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-50 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {consents.map((consent) => {
          const status = getStatus(consent);
          const statusColor = getStatusColor(status);

          return (
            <div
              key={consent.tokenId}
              className="backdrop-blur-md bg-white bg-opacity-5 rounded-xl p-6 border border-orange-500 border-opacity-20 hover:bg-opacity-10 transition-all duration-200 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-orange-400" />
                  <span className="text-lg font-semibold">Token #{consent.tokenId}</span>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusColor}`}>
                  {getStatusIcon(status)}
                  <span className="text-sm capitalize">{status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-orange-200">Recipient:</span>
                  <span className="font-mono text-orange-400">
                    {formatAddress(consent.recipient)}
                  </span>
                </div>

                <div className="flex items-start space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-orange-200">Purpose:</span>
                    <p className="text-white mt-1 leading-relaxed">
                      {consent.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-orange-200">Expires:</span>
                  <span className="text-white">
                    {formatDate(consent.expiryDate)}
                  </span>
                </div>
              </div>

              {status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleRevoke(consent.tokenId)}
                  disabled={loading || revokingTokens.has(consent.tokenId) || !wallet.isCorrectNetwork || !!contractError}
                  className={`w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 bg-opacity-20 text-red-400 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20 ${
                    loading || revokingTokens.has(consent.tokenId) || !wallet.isCorrectNetwork || !!contractError
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-red-500 hover:text-white hover:shadow-red-500/40'
                  }`}
                >
                  {revokingTokens.has(consent.tokenId) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span>
                        {!wallet.isCorrectNetwork 
                          ? 'Switch Network' 
                          : contractError 
                          ? 'Contract Error' 
                          : 'Revoke Consent'
                        }
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};