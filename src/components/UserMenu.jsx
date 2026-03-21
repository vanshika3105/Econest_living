// ─── UserMenu.jsx ────────────────────────────────────────────────────────────
// Drop-in replacement for the UserMenu component used in the app header.
// Displays the current user's name and a logout button with EcoNest styling.

const T = {
  green: '#16a34a',
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

// If you have an AuthContext, swap these imports:
// import { useAuth } from '../context/AuthContext';

export function UserMenu({ user, onLogout }) {
  // If using AuthContext:
  // const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (onLogout) await onLogout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? 'U';

  const roleColor = {
    admin: '#3b82f6',
    supplier: T.amber,
    customer: T.green,
  }[user.role] || T.green;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '8px 16px 8px 8px',
      background: T.bg, borderRadius: 40,
      border: `1px solid ${T.borderMid}`,
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: 13, fontWeight: 800,
        fontFamily: "'Poppins', sans-serif", flexShrink: 0,
      }}>
        {initials}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700,
          color: T.navy, fontFamily: "'Poppins', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: 120,
        }}>
          {user.displayName || user.name || 'User'}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: T.muted, textTransform: 'capitalize' }}>
          {user.role || 'customer'}
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          padding: '7px 14px', background: T.white,
          color: T.red, border: `1.5px solid ${T.borderMid}`,
          borderRadius: 10, cursor: 'pointer',
          fontSize: 12, fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
          transition: 'all 0.2s ease',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
        onMouseOver={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.red + '40'; }}
        onMouseOut={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.borderColor = T.borderMid; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

export default UserMenu;
