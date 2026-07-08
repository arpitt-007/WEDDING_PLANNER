import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = {
  name: '',
  category: 'other',
  contactName: '',
  phone: '',
  email: '',
  cost: '',
  status: 'researching',
};

const categories = ['venue', 'catering', 'photography', 'decor', 'music', 'attire', 'transport', 'other'];

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/vendors');
    setVendors(data);
  };

  useEffect(() => {
    load();
  }, []);

  const addVendor = async (e) => {
    e.preventDefault();
    await api.post('/vendors', { ...form, cost: Number(form.cost) || 0 });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/vendors/${id}`, { status });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/vendors/${id}`);
    load();
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Vendors</div>
          <h1 style={{ fontSize: '2.4rem' }}>The people making it happen</h1>
        </div>
        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add vendor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addVendor} className="card" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label>Business name</label>
              <input required style={{ width: '100%' }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label>Category</label>
              <select style={{ width: '100%' }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Quoted cost</label>
              <input type="number" style={{ width: '100%' }} value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            </div>
            <div>
              <label>Contact name</label>
              <input style={{ width: '100%' }} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label>Phone</label>
              <input style={{ width: '100%' }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label>Email</label>
              <input style={{ width: '100%' }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Save vendor
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.6rem' }}>
        {vendors.map((v) => (
          <div key={v._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>{v.name}</h3>
                <div className="eyebrow" style={{ marginTop: '0.2rem' }}>{v.category}</div>
              </div>
              <span className={`tag ${v.status}`}>{v.status}</span>
            </div>
            <hr className="hairline" style={{ margin: '0.8rem 0' }} />
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>{v.contactName}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: 'var(--ink-soft)' }}>{v.phone}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: 'var(--ink-soft)' }}>{v.email}</p>
            <p style={{ fontSize: '0.9rem', margin: '0.6rem 0' }}>Quoted: ${v.cost.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
              <select value={v.status} onChange={(e) => updateStatus(v._id, e.target.value)} style={{ flex: 1, fontSize: '0.8rem' }}>
                <option value="researching">Researching</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
                <option value="paid">Paid</option>
              </select>
              <button className="btn danger" onClick={() => remove(v._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <p style={{ color: 'var(--ink-soft)' }}>No vendors yet. Add your first one above.</p>
        )}
      </div>
    </Layout>
  );
}
