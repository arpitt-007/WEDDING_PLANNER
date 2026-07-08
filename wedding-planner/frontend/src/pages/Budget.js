import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = {
  category: 'other',
  item: '',
  estimatedCost: '',
  actualCost: '',
  amountPaid: '',
};

const categories = [
  'venue',
  'catering',
  'attire',
  'photography',
  'decor',
  'invitations',
  'entertainment',
  'transport',
  'honeymoon',
  'other',
];

export default function Budget() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/budget');
    setItems(data.items);
    setSummary(data.summary);
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    await api.post('/budget', {
      ...form,
      estimatedCost: Number(form.estimatedCost) || 0,
      actualCost: Number(form.actualCost) || 0,
      amountPaid: Number(form.amountPaid) || 0,
    });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/budget/${id}`);
    load();
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Budget</div>
          <h1 style={{ fontSize: '2.4rem' }}>Every rupee, accounted for</h1>
          {summary && (
            <p style={{ color: 'var(--ink-soft)', marginTop: '0.4rem' }}>
              ${summary.actualSpend.toLocaleString()} spent of ${summary.totalBudget.toLocaleString()} &middot; $
              {summary.remaining.toLocaleString()} remaining
            </p>
          )}
        </div>
        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add expense'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addItem} className="card" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.9rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label>Item</label>
              <input required style={{ width: '100%' }} value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} />
            </div>
            <div>
              <label>Category</label>
              <select style={{ width: '100%' }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c} style={{ textTransform: 'capitalize' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Estimated cost</label>
              <input type="number" style={{ width: '100%' }} value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} />
            </div>
            <div>
              <label>Actual cost</label>
              <input type="number" style={{ width: '100%' }} value={form.actualCost} onChange={(e) => setForm({ ...form, actualCost: e.target.value })} />
            </div>
            <div>
              <label>Amount paid</label>
              <input type="number" style={{ width: '100%' }} value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Save expense
          </button>
        </form>
      )}

      <div className="card" style={{ marginTop: '1.6rem', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              {['Item', 'Category', 'Estimated', 'Actual', 'Paid', ''].map((h) => (
                <th key={h} style={{ padding: '0.8rem 1.2rem', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '0.8rem 1.2rem' }}>{item.item}</td>
                <td style={{ padding: '0.8rem 1.2rem', textTransform: 'capitalize' }}>{item.category}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>${item.estimatedCost.toLocaleString()}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>${item.actualCost.toLocaleString()}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>${item.amountPaid.toLocaleString()}</td>
                <td style={{ padding: '0.8rem 1.2rem' }}>
                  <button className="btn danger" onClick={() => remove(item._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                  No expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
