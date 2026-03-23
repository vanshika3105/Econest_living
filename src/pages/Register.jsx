import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const T = {
  green: '#16a34a',
  greenDark: '#15803d',
  greenLight: '#f0fdf4',
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

// ─── FORM INPUT ──────────────────────────────────────────────────────────────
function FormInput({ label, id, type = 'text', value, onChange, placeholder, disabled, required, showToggle, onToggle, showPw, error }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
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
            width: '100%',
            padding: '12px',
            borderRadius: 10,
            border: `1px solid ${error ? T.red : T.borderMid}`,
            outline: 'none'
          }}
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
          >
            👁
          </button>
        )}
      </div>

      {error && <p style={{ color: T.red, fontSize: 12 }}>{error}</p>}
    </div>
  );
}

// ─── REGISTER COMPONENT ──────────────────────────────────────────────────────
export function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ FIXED HANDLER (IMPORTANT)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.displayName.trim()) errs.displayName = 'Name required';
    if (!form.email.includes('@')) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'Min 6 chars';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords mismatch';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errs = validate();
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    try {
      await register(form.email, form.password, form.displayName);

      setSuccess(true);

      // Redirect to home after a brief moment
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: 'auto' }}>
      <h2>Create Account</h2>

      {error && (
        <div style={{
          background: T.redLight, color: T.red, borderRadius: 10,
          padding: '10px 14px', fontSize: 13, marginBottom: 16,
          border: `1px solid rgba(239,68,68,0.2)`,
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: T.greenLight, color: T.green, borderRadius: 10,
          padding: '10px 14px', fontSize: 13, marginBottom: 16,
          border: `1px solid rgba(22,163,74,0.2)`,
        }}>
          🎉 Account created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <FormInput
          label="Full Name"
          id="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Enter your full name"
          disabled={loading}
          error={fieldErrors.displayName}
        />

        <FormInput
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled={loading}
          error={fieldErrors.email}
        />

        <FormInput
          label="Password"
          id="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min 6 characters"
          disabled={loading}
          showToggle
          showPw={showPw}
          onToggle={() => setShowPw(!showPw)}
          error={fieldErrors.password}
        />

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          disabled={loading}
          showToggle
          showPw={showConfirmPw}
          onToggle={() => setShowConfirmPw(!showConfirmPw)}
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={loading || success}
          style={{
            width: '100%',
            padding: 12,
            background: loading ? T.muted : T.green,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            marginTop: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {loading ? 'Creating Account...' : success ? '✓ Account Created!' : 'Create Account'}
        </button>

      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: T.muted }}>
        Already have an account? <a href="/login" style={{ color: T.green, fontWeight: 600 }}>Sign In</a>
      </p>
    </div>
  );
}

export default Register;