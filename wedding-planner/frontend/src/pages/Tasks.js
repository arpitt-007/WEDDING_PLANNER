import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = { title: '', category: 'other', dueDate: '', priority: 'medium' };

const categories = [
  'venue',
  'catering',
  'attire',
  'photography',
  'decor',
  'invitations',
  'legal',
  'honeymoon',
  'other',
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data.tasks);
    setSummary(data.summary);
  };

  useEffect(() => {
    load();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const toggle = async (task) => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  const isOverdue = (task) => !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="eyebrow">Checklist</div>
          <h1 style={{ fontSize: '2.4rem' }}>One task at a time</h1>
          {summary && (
            <p style={{ color: 'var(--ink-soft)', marginTop: '0.4rem' }}>
              {summary.completed}/{summary.total} complete &middot; {summary.overdue} overdue
            </p>
          )}
        </div>
        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addTask} className="card" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label>Task</label>
              <input required style={{ width: '100%' }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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
              <label>Due date</label>
              <input type="date" style={{ width: '100%' }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label>Priority</label>
              <select style={{ width: '100%' }} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>
            Save task
          </button>
        </form>
      )}

      <div className="card" style={{ marginTop: '1.6rem' }}>
        {tasks.map((task, i) => (
          <div key={task._id}>
            {i > 0 && <hr className="hairline" style={{ margin: '0.8rem 0' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <input type="checkbox" checked={task.completed} onChange={() => toggle(task)} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--ink-soft)' : 'var(--ink)',
                  }}
                >
                  {task.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: isOverdue(task) ? 'var(--danger)' : 'var(--ink-soft)', textTransform: 'capitalize' }}>
                  {task.category} &middot; {task.priority} priority
                  {task.dueDate && ` \u00b7 due ${new Date(task.dueDate).toLocaleDateString()}`}
                  {isOverdue(task) && ' \u00b7 overdue'}
                </div>
              </div>
              <button className="btn danger" onClick={() => remove(task._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p style={{ color: 'var(--ink-soft)', textAlign: 'center' }}>No tasks yet. Add your first one above.</p>
        )}
      </div>
    </Layout>
  );
}
