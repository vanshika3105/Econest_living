import { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) return;

    alert("Registered Successfully 🚀");
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: 'auto' }}>
      <h2>Create Account</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>

        <FormInput
          label="Full Name"
          id="displayName"
          value={form.displayName}
          onChange={handleChange}
          error={fieldErrors.displayName}
        />

        <FormInput
          label="Email"
          id="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <FormInput
          label="Password"
          id="password"
          value={form.password}
          onChange={handleChange}
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
          showToggle
          showPw={showConfirmPw}
          onToggle={() => setShowConfirmPw(!showConfirmPw)}
          error={fieldErrors.confirmPassword}
        />

        <button style={{
          width: '100%',
          padding: 12,
          background: T.green,
          color: 'white',
          border: 'none',
          borderRadius: 8,
          marginTop: 10
        }}>
          Create Account
        </button>

      </form>
    </div>
  );
}

export default Register;