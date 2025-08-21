import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FocusDataProvider } from './context/FocusDataContext';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './supabaseClient';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <FocusDataProvider>
        <App />
      </FocusDataProvider>
    </SessionContextProvider>
  </StrictMode>
);
