import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in.');
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
      }}
    >
      <form onSubmit={handleSubmit} className="card" style={{ width: 500 , borderRadius: '1rem', padding: '2rem'}}>
        {/* <div className="eyebrow" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Evermore
        </div> */}
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.6rem' }}>Welcome Back!!!</h1>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 0 }}>{error}</p>
        )}

        <div style={{ marginBottom: '1rem'}}>
          <label htmlFor="email" style={{fontSize: '1.2rem'}}>Email</label>
          <input
            id="email"
            type="email"
            required
            style={{ width: '100%' }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: '1.4rem' }}>
          <label htmlFor="password" style={{fontSize: '1.2rem'}}>Password</label>
          <input
            id="password"
            type="password"
            required
            style={{ width: '100%' }}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center', fontSize: '1.5rem' }} disabled={submitting}>
          {submitting ? 'Signing in\u2026' : 'Sign in'}
        </button>

        <p style={{ fontSize: '0.85rem', marginTop: '1.2rem', color: 'var(--ink-soft)' , fontSize: '1.2rem' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
