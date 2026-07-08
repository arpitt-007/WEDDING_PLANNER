import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/guests', label: 'Guest list' },
  { to: '/budget', label: 'Budget' },
  { to: '/tasks', label: 'Checklist' },
  { to: '/vendors', label: 'Vendors' },
];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const days = daysUntil(user?.weddingDate);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 240,
          background: 'var(--forest-deep)',
          color: '#f3ecdf',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div>
          <div className="eyebrow" style={{ color: '#c9b98a', marginBottom: '0.3rem' }}>
            Evermore
          </div>
          <h2 style={{ color: '#fbf7f0', fontSize: '1.5rem', marginBottom: '1.8rem' }}>
            {user?.partner1Name}
            {user?.partner2Name ? ` & ${user.partner2Name}` : ''}
          </h2>

          {days !== null && (
            <div
              style={{
                border: '1px solid rgba(251,247,240,0.25)',
                borderRadius: 3,
                padding: '0.9rem',
                marginBottom: '1.8rem',
              }}
            >
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.1rem', lineHeight: 1 }}>
                {days >= 0 ? days : 0}
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', opacity: 0.8 }}>
                {days >= 0 ? 'days until the wedding' : 'the big day has passed \u2014 congratulations!'}
              </div>
            </div>
          )}

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  padding: '0.55rem 0.7rem',
                  borderRadius: 3,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  color: isActive ? 'var(--forest-deep)' : '#f3ecdf',
                  background: isActive ? '#f3ecdf' : 'transparent',
                  fontWeight: isActive ? 700 : 400,
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="btn secondary"
          style={{ color: '#f3ecdf', borderColor: 'rgba(251,247,240,0.35)' }}
        >
          Sign out
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2.5rem 3rem', maxWidth: 1100 }}>{children}</main>
    </div>
  );
}
