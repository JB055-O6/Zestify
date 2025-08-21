import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ZestyMatch from './components/ZestyMatch/ZestyMatch';
import FocusFlow from './components/FocusFlow/FocusFlow';
import ZpendLite from './components/ZpendLite/ZpendLite';
import { ZpendProvider } from './context/ZpendContext'; // ✅ Import the context provider
import Auth from './components/Auth';
import { useUser } from '@supabase/auth-helpers-react';

function App() {
  const user = useUser();

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <p>👋 Hello, {user.email}</p>
        <button
          onClick={() =>
            import('./supabaseClient').then(({ supabase }) =>
              supabase.auth.signOut()
            )
          }
          className="text-red-500 underline"
        >
          Logout
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ZestyMatch />} />
        <Route path="/focus" element={<FocusFlow />} />
        <Route
          path="/expenses"
          element={
            <ZpendProvider> {/* ✅ Wrap ZpendLite with context */}
              <ZpendLite />
            </ZpendProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
