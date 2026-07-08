import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = {
  name: '',
  group: 'both',
  email: '',
  phone: '',
  mealPreference: 'none',
  plusOne: false,
};

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/guests');
    setGuests(data.guests);
    setSummary(data.summary);
  };

  useEffect(() => {
    load();
  }, []);

  const addGuest = async (e) => {
    e.preventDefault();
    await api.post('/guests', form);
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const updateRsvp = async (id, rsvpStatus) => {
    await api.put(`/guests/${id}`, { rsvpStatus });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/guests/${id}`);
    load();
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Guest list</div>
          <h1 style={{ fontSize: '2.4rem' }}>Who's celebrating with you</h1>
          {summary && (
            <p style={{ color: 'var(--ink-soft)', marginTop: '0.4rem' }}>
              {summary.confirmed} confirmed &middot; {summary.pending} pending &middot;{' '}
              {summary.declined} declined &middot; {summary.headCount} expected head count
            </p>
          )}
        </div>
        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add guest'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addGuest} className="card" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label>Name</label>
              <input required style={{ width: '100%' }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label>Side</label>
              <select style={{ width: '100%' }} value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
                <option value="both">Shared</option>
                <option value="partner1">Partner 1's side</option>
                <option value="partner2">Partner 2's side</option>
              </select>
            </div>
            <div>
              <label>Meal preference</label>
              <select
                style={{ width: '100%' }}
                value={form.mealPreference}
                onChange={(e) => setForm({ ...form, mealPreference: e.target.value })}
              >
                <option value="none">Not set</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-vegetarian</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Email</label>
              <input style={{ width: '100%' }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label>Phone</label>
              <input style={{ width: '100%' }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={form.plusOne}
                  onChange={(e) => setForm({ ...form, plusOne: e.target.checked })}
                />
                Bringing a plus-one
              </label>
            </div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Save guest
          </button>
        </form>
      )}

      <div className="card" style={{ marginTop: '1.6rem', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Name', 'Side', 'Meal', 'Plus-one', 'RSVP', ''].map((h) => (
                <th key={h} style={{ padding: '0.8rem 1.2rem', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g._id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '0.8rem 1.2rem' }}>{g.name}</td>
                <td style={{ padding: '0.8rem 1.2rem', textTransform: 'capitalize' }}>{g.group}</td>
                <td style={{ padding: '0.8rem 1.2rem', textTransform: 'capitalize' }}>{g.mealPreference}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>{g.plusOne ? 'Yes' : 'No'}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>
                  <select
                    value={g.rsvpStatus}
                    onChange={(e) => updateRsvp(g._id, e.target.value)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </td>
                <td style={{ padding: '0.8rem 1.2rem' }}>
                  <button className="btn danger" onClick={() => remove(g._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                  No guests yet. Add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
