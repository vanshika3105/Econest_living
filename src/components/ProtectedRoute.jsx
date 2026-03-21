// ─── ProtectedRoute.jsx ──────────────────────────────────────────────────────
// Protects routes that require authentication.
// If the user is not logged in, redirects to /login.
// Shows a branded loading screen while auth state is being checked.

import { Navigate } from 'react-router-dom';

// If using AuthContext, swap in:
// import { useAuth } from '../context/AuthContext';

const T = {
  green: '#16a34a',
  greenLight: '#f0fdf4',
  navy: '#0f172a',
  muted: '#64748b',
  bg: '#f8fafc',
};

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: T.greenLight,
    }}>
      {/* Leaf Logo */}
      <div style={{
        width: 64, height: 64, background: 'white', borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, color: T.green,
        boxShadow: `0 8px 24px rgba(22,163,74,0.2)`,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a3.5 3.5 0 0 1-3.5 3.5c-1.2 0-2.31-.56-3.07-1.44M11 20H3c0-3.11 3.69-4.07 3.69-4.07M11 20c.1-.71.18-1.44.25-2.19.12-1.31.18-2.61.18-3.81 0-2.42-.45-4.83-1.63-7" />
        </svg>
      </div>

      <p style={{
        fontSize: 18, fontWeight: 700, color: T.navy,
        fontFamily: "'Poppins', sans-serif", marginBottom: 8,
      }}>
        EcoNest
      </p>
      <p style={{ fontSize: 14, color: T.muted }}>Checking your session...</p>

      {/* Spinner dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: T.green,
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(22,163,74,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(22,163,74,0.35); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
// Usage:
//   <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><Dashboard /></ProtectedRoute>} />
//
// Or with AuthContext:
//   export function ProtectedRoute({ children }) {
//     const { user, loading } = useAuth();
//     ...
//   }

export function ProtectedRoute({ children, user, loading }) {
  // If using AuthContext, replace props with:
  // const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
