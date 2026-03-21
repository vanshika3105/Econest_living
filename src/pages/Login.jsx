import { useState } from 'react';

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const T = {
  green: '#16a34a',
  greenDark: '#15803d',
  greenLight: '#f0fdf4',
  greenMid: '#dcfce7',
  navy: '#0f172a',
  navyMid: '#1e293b',
  muted: '#64748b',
  border: '#f1f5f9',
  borderMid: '#e2e8f0',
  bg: '#f8fafc',
  white: '#ffffff',
  red: '#ef4444',
  redLight: '#fef2f2',
};

// ─── ICON HELPERS ───────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a3.5 3.5 0 0 1-3.5 3.5c-1.2 0-2.31-.56-3.07-1.44M11 20H3c0-3.11 3.69-4.07 3.69-4.07M11 20c.1-.71.18-1.44.25-2.19.12-1.31.18-2.61.18-3.81 0-2.42-.45-4.83-1.63-7" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    }
  </svg>
);

// ─── SHARED INPUT COMPONENT ─────────────────────────────────────────────────
function FormInput({ label, id, type = 'text', value, onChange, placeholder, disabled, required, showToggle, onToggle, showPw }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={{
        display: 'block', marginBottom: 8,
        fontSize: 13, fontWeight: 700,
        color: T.navyMid, fontFamily: "'Poppins', sans-serif",
      }}>
        {label} {required && <span style={{ color: T.red }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showToggle ? (showPw ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%', padding: '13px 16px',
            paddingRight: showToggle ? 48 : 16,
            border: `1.5px solid ${T.borderMid}`,
            borderRadius: 12, fontSize: 14,
            outline: 'none', background: T.bg,
            color: T.navy, boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocus={e => {
            e.target.style.borderColor = T.green;
            e.target.style.background = T.white;
            e.target.style.boxShadow = `0 0 0 3px rgba(22,163,74,0.12)`;
          }}
          onBlur={e => {
            e.target.style.borderColor = T.borderMid;
            e.target.style.background = T.bg;
            e.target.style.boxShadow = 'none';
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.muted, display: 'flex', alignItems: 'center', padding: 0,
            }}
          >
            <EyeIcon show={showPw} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN COMPONENT ────────────────────────────────────────────────────────
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Demo users (mirrors App.jsx logic)
  const DEMO_USERS = [
    { email: 'user@econest.com', password: 'eco123', name: 'Eco User', role: 'customer' },
    { email: 'vendor@econest.com', password: 'vendor123', name: 'EcoVendor', role: 'supplier' },
    { email: 'admin@econest.com', password: 'admin123', name: 'Admin EcoNest', role: 'admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const found = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (found) {
        window.location.href = '/';
      } else {
        setError('Invalid email or password. Try user@econest.com / eco123');
      }
    }, 800);
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Left Panel — Branding */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #f7fee7 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(132,204,22,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400, width: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, background: 'white', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px rgba(22,163,74,0.2)`, color: T.green }}>
              <LeafIcon />
            </div>
            <span style={{ fontSize: 26, fontWeight: 900, color: T.navy, fontFamily: "'Poppins', sans-serif", letterSpacing: -0.5 }}>EcoNest</span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: T.navy, lineHeight: 1.15, marginBottom: 20, fontFamily: "'Poppins', sans-serif" }}>
            Welcome back to<br /><span style={{ color: T.green }}>sustainable living.</span>
          </h1>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, marginBottom: 48 }}>
            Sign in to explore eco-certified furniture, track your orders, and continue your zero-waste home journey.
          </p>

          {/* Feature list */}
          {[
            'Carbon-neutral furniture delivery',
            'FSC & ISO certified products',
            'Bamboo, reclaimed wood & recycled materials',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span style={{ fontSize: 14, color: T.navyMid, fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px', background: T.white,
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.navy, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Sign In</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 32 }}>Don't have an account? <a href="/register" style={{ color: T.green, fontWeight: 700 }}>Register</a></p>

          {error && (
            <div style={{
              background: T.redLight, color: T.red, borderRadius: 12,
              padding: '12px 16px', fontSize: 13, marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 8,
              border: `1px solid rgba(239,68,68,0.2)`,
            }}>
              <AlertIcon /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
            <FormInput
              label="Password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
              showToggle
              showPw={showPw}
              onToggle={() => setShowPw(p => !p)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -12, marginBottom: 24 }}>
              <a href="/forgot-password" style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px 24px',
                background: loading ? T.muted : `linear-gradient(135deg, ${T.green}, ${T.greenDark})`,
                color: 'white', border: 'none', borderRadius: 14,
                fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: loading ? 'none' : `0 8px 24px rgba(22,163,74,0.35)`,
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: 28, background: T.greenLight, borderRadius: 12,
            padding: '14px 16px', fontSize: 12, color: T.green,
            border: `1px solid rgba(22,163,74,0.15)`,
            lineHeight: 1.6,
          }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Demo Credentials</strong>
            User: user@econest.com / eco123<br />
            Vendor: vendor@econest.com / vendor123<br />
            Admin: admin@econest.com / admin123
          </div>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700;800;900&display=swap');
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            * { box-sizing: border-box; }
            body { margin: 0; }
            a { text-decoration: none; }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default Login;
