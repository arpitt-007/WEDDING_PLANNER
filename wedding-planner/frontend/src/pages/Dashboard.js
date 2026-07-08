import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, sub }) {
  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="eyebrow">{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', margin: '0.3rem 0' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [guestSummary, setGuestSummary] = useState(null);
  const [taskSummary, setTaskSummary] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    partner1Name: user?.partner1Name || '',
    partner2Name: user?.partner2Name || '',
    weddingDate: user?.weddingDate ? user.weddingDate.substring(0, 10) : '',
    venue: user?.venue || '',
    totalBudget: user?.totalBudget || 0,
  });

  useEffect(() => {
    const load = async () => {
      const [guestsRes, tasksRes, budgetRes] = await Promise.all([
        api.get('/guests'),
        api.get('/tasks'),
        api.get('/budget'),
      ]);
      setGuestSummary(guestsRes.data.summary);
      setTaskSummary(tasksRes.data.summary);
      setBudgetSummary(budgetRes.data.summary);
      setUpcomingTasks(
        tasksRes.data.tasks.filter((t) => !t.completed).slice(0, 5)
      );
    };
    load();
  }, []);

  const saveDetails = async (e) => {
    e.preventDefault();
    await updateProfile({ ...form, totalBudget: Number(form.totalBudget) || 0 });
    setEditing(false);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Overview</div>
          <h1 style={{ fontSize: '2.4rem',  }}>Your wedding, at a glance</h1>
          {user?.venue && (
            <p style={{ color: 'var(--ink-soft)', marginTop: '0.4rem' }}>{user.venue}</p>
          )}
        </div>
        <button className="btn secondary" onClick={() => setEditing((v) => !v)}>
          {editing ? 'Close' : 'Edit details'}
        </button>
      </div>

      {editing && (
        <form onSubmit={saveDetails} className="card" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label>Your name</label>
              <input
                style={{ width: '100%' }}
                value={form.partner1Name}
                onChange={(e) => setForm({ ...form, partner1Name: e.target.value })}
              />
            </div>
            <div>
              <label>Partner's name</label>
              <input
                style={{ width: '100%' }}
                value={form.partner2Name}
                onChange={(e) => setForm({ ...form, partner2Name: e.target.value })}
              />
            </div>
            <div>
              <label>Wedding date</label>
              <input
                type="date"
                style={{ width: '100%' }}
                value={form.weddingDate}
                onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
              />
            </div>
            <div>
              <label>Total budget</label>
              <input
                type="number"
                style={{ width: '100%' }}
                value={form.totalBudget}
                onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Venue</label>
              <input
                style={{ width: '100%' }}
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
          </div>
          <button className="btn" style={{ marginTop: '1rem' }} type="submit">
            Save
          </button>
        </form>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.6rem' }}>
        <StatCard
          label="Guests confirmed"
          value={guestSummary ? `${guestSummary.confirmed}/${guestSummary.total}` : '\u2013'}
          sub={guestSummary ? `${guestSummary.headCount} expected head count` : ''}
        />
        <StatCard
          label="Checklist"
          value={taskSummary ? `${taskSummary.completed}/${taskSummary.total}` : '\u2013'}
          sub={taskSummary ? `${taskSummary.overdue} overdue` : ''}
        />
        <StatCard
          label="Budget remaining"
          value={budgetSummary ? `$${budgetSummary.remaining.toLocaleString()}` : '\u2013'}
          sub={budgetSummary ? `of $${budgetSummary.totalBudget.toLocaleString()} total` : ''}
        />
      </div>

      <div className="card" style={{ marginTop: '1.6rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.9rem' }}>Next up on the checklist</h3>
        {upcomingTasks.length === 0 && (
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            Nothing pending — add tasks from the Checklist tab.
          </p>
        )}
        {upcomingTasks.map((task, i) => (
          <div key={task._id}>
            {i > 0 && <hr className="hairline" style={{ margin: '0.7rem 0' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{task.title}</span>
              <span style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
