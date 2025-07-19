import React from 'react';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PrivacyRiskAssessment } from '../utils/privacyRiskAssessment';

interface PrivacyRiskIndicatorProps {
  assessment: PrivacyRiskAssessment;
  className?: string;
}

export const PrivacyRiskIndicator: React.FC<PrivacyRiskIndicatorProps> = ({ 
  assessment, 
  className = '' 
}) => {
  const getRiskIcon = () => {
    switch (assessment.riskLevel) {
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'High':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskColor = () => {
    switch (assessment.riskLevel) {
      case 'Low':
        return 'border-green-500 bg-green-500';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-500';
      case 'High':
        return 'border-red-500 bg-red-500';
      default:
        return 'border-gray-500 bg-gray-500';
    }
  };

  const getBackgroundColor = () => {
    switch (assessment.riskLevel) {
      case 'Low':
        return 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-30';
      case 'Medium':
        return 'bg-yellow-500 bg-opacity-10 border-yellow-500 border-opacity-30';
      case 'High':
        return 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30';
      default:
        return 'bg-gray-500 bg-opacity-10 border-gray-500 border-opacity-30';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getBackgroundColor()} ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <Shield className="h-6 w-6 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Privacy Risk Assessment</h3>
      </div>

      <div className="space-y-4">
        {/* Risk Score and Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRiskIcon()}
            <span className="font-medium text-white">
              Risk Level: {assessment.riskLevel}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Score:</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white">{assessment.riskScore}</span>
              <span className="text-gray-400">/10</span>
            </div>
          </div>
        </div>

        {/* Risk Score Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getRiskColor()} bg-opacity-80`}
            style={{ width: `${(assessment.riskScore / 10) * 100}%` }}
          ></div>
        </div>

        {/* Reason */}
        <div>
          <h4 className="font-medium text-white mb-1">Analysis:</h4>
          <p className="text-sm text-gray-300">{assessment.reason}</p>
        </div>

        {/* Recommendation */}
        <div>
          <h4 className="font-medium text-white mb-1">Recommendation:</h4>
          <p className="text-sm text-gray-300">{assessment.recommendation}</p>
        </div>

        {/* Concerns */}
        {assessment.concerns.length > 0 && (
          <div>
            <h4 className="font-medium text-red-400 mb-2">Concerns:</h4>
            <ul className="space-y-1">
              {assessment.concerns.map((concern, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-gray-300">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positives */}
        {assessment.positives.length > 0 && (
          <div>
            <h4 className="font-medium text-green-400 mb-2">Positive Aspects:</h4>
            <ul className="space-y-1">
              {assessment.positives.map((positive, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-gray-300">{positive}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};