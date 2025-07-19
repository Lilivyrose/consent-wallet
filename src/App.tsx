import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { IssueConsent } from './pages/IssueConsent';
import { MyConsents } from './pages/MyConsents';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/issue" element={<IssueConsent />} />
            <Route path="/my-consents" element={<MyConsents />} />
          </Routes>
        </Layout>
      </Router>
    </WalletProvider>
  );
}

export default App;