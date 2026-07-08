import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    partner1Name: '',
    partner2Name: '',
    weddingDate: '',
    venue: '',
    totalBudget: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ ...form, totalBudget: Number(form.totalBudget) || 0 });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(./images/back.jpg) no-repeat center center fixed',
        backgroundsize: 'cover',
        padding: '2rem 0',
      }}
    >
      <form onSubmit={handleSubmit} className="card" style={{ width: 700 ,borderRadius: '1rem', padding: '2rem'}}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.6rem' }}>Start planning</h1>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 0 }}>{error}</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
          <div>
            <label style={{ fontSize: '1.2rem' }}>Your name</label>
            <input required style={{ width: '100%' }} value={form.partner1Name} onChange={update('partner1Name')} />
          </div>
          <div>
            <label style={{ fontSize: '1.2rem' }}>Partner's name</label>
            <input style={{ width: '100%' }} value={form.partner2Name} onChange={update('partner2Name')} />
          </div>
        </div>

        <div style={{ marginBottom: '0.9rem' }}>
          <label style={{ fontSize: '1.2rem' }}>Email</label>
          <input type="email" required style={{ width: '100%' }} value={form.email} onChange={update('email')} />
        </div>

        <div style={{ marginBottom: '0.9rem' }}>
          <label style={{ fontSize: '1.2rem' }}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            style={{ width: '100%' }}
            value={form.password}
            onChange={update('password')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '0.9rem' }}>
          <div>
            <label style={{ fontSize: '1.2rem' }}>Wedding date</label>
            <input type="date" style={{ width: '100%' }} value={form.weddingDate} onChange={update('weddingDate')} />
          </div>
          <div>
            <label style={{ fontSize: '1.2rem' }}>Total budget</label>
            <input type="number" min="0" style={{ width: '100%' }} value={form.totalBudget} onChange={update('totalBudget')} />
          </div>
        </div>

        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ fontSize: '1.2rem' }}>Venue (optional)</label>
          <input style={{ width: '100%' }} value={form.venue} onChange={update('venue')} />
        </div>

        <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' , fontSize: '1.5rem' }} disabled={submitting}>
          {submitting ? 'Creating account\u2026' : 'Create account'}
        </button>

        <p style={{ fontSize: '1.2rem', marginTop: '1.2rem', color: 'var(--ink-soft)' }}>
          Already planning with us? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
