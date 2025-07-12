@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useSearchParams, useNavigate } from 'react-router-dom';
 import { Shield, Globe, User, FileText, Calendar, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
+import { normalizeAddress } from '../utils/addressUtils';
 import { useWallet } from '../contexts/WalletContext';