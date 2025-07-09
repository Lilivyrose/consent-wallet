import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Users, Zap, Plus, FileText, ArrowRight } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const Home: React.FC = () => {
  const { wallet } = useWallet();

  const features = [
    {
      icon: Shield,
      title: "Secure Consent Management",
      description: "Issue tamper-proof consent tokens on the blockchain with complete transparency and immutability."
    },
    {
      icon: Lock,
      title: "Revocable Permissions",
      description: "Maintain full control over your consent with the ability to revoke permissions at any time."
    },
    {
      icon: Users,
      title: "Multi-Party Transparency",
      description: "All parties can verify consent status and validity through blockchain verification."
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Real-time consent validation with expiration tracking and automated status updates."
    }
  ];

  const stats = [
    { label: "Consent Tokens Issued", value: "10,000+" },
    { label: "Active Users", value: "2,500+" },
    { label: "Organizations", value: "150+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Consent Wallet
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The future of digital consent management on the blockchain. Issue, manage, and revoke consent tokens with complete transparency and control.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          {wallet.isConnected ? (
            <>
              <Link
                to="/issue"
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl font-semibold text-black hover:from-cyan-300 hover:to-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-6 w-6" />
                <span>Issue Consent Token</span>
              </Link>
              <Link
                to="/my-consents"
                className="flex items-center space-x-3 px-8 py-4 backdrop-blur-md bg-white bg-opacity-10 rounded-xl font-semibold border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
              >
                <FileText className="h-6 w-6" />
                <span>View My Consents</span>
              </Link>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-400">Connect your wallet to get started</p>
              <div className="flex items-center justify-center space-x-2 text-cyan-400">
                <ArrowRight className="h-5 w-5" />
                <span>Look for the "Connect Wallet" button in the top right</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Why Choose Consent Wallet?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built on the BNB Smart Chain for fast, secure, and cost-effective consent management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group backdrop-blur-md bg-white bg-opacity-5 rounded-2xl p-8 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">{feature.title}</h3>
                  <p className="text-gray-300 text-center leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="backdrop-blur-md bg-white bg-opacity-5 rounded-3xl p-12 border border-white border-opacity-10">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Simple, secure, and transparent consent management in three steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Connect Wallet",
              description: "Connect your MetaMask wallet to the BNB Smart Chain Testnet to get started."
            },
            {
              step: "02",
              title: "Issue Consent",
              description: "Create a consent token by specifying the recipient, purpose, and expiration date."
            },
            {
              step: "03",
              title: "Manage & Revoke",
              description: "View all your consent tokens and revoke them instantly when needed."
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="backdrop-blur-md bg-white bg-opacity-5 rounded-2xl p-8 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                <div className="space-y-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-cyan-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-20">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Ready to Start?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of users who trust Consent Wallet for their digital consent management needs.
          </p>
        </div>

        {!wallet.isConnected && (
          <div className="flex items-center justify-center space-x-2 text-cyan-400">
            <ArrowRight className="h-5 w-5" />
            <span>Connect your wallet to get started</span>
          </div>
        )}
      </section>
    </div>
  );
};