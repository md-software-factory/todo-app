import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = 'http://localhost:3001/api/todos';

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  function save() {
    const value = text.trim();
    if (value && value !== todo.text) onEdit(todo.id, value);
    setEditing(false);
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button className="check" onClick={() => onToggle(todo)} aria-label="Toggle completion">
        {todo.completed ? '✓' : ''}
      </button>
      {editing ? (
        <input autoFocus value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} />
      ) : <span className="todo-text">{todo.text}</span>}
      <div className="actions">
        {editing ? <button onClick={save}>Save</button> : <button onClick={() => setEditing(true)}>Edit</button>}
        <button className="delete" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API)
      .then(response => { if (!response.ok) throw new Error('Unable to load todos'); return response.json(); })
      .then(setTodos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const response = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    if (response.ok) { setTodos([...todos, await response.json()]); setText(''); }
  }

  async function updateTodo(todo, changes) {
    const response = await fetch(`${API}/${todo.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) });
    if (response.ok) { const updated = await response.json(); setTodos(todos.map(item => item.id === todo.id ? updated : item)); }
  }

  async function deleteTodo(id) {
    const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (response.ok) setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <main className="app">
      <header><p className="eyebrow">FOCUS / TODAY</p><h1>My tasks</h1><p className="subtitle">{todos.filter(todo => !todo.completed).length} remaining</p></header>
      <form className="todo-form" onSubmit={addTodo}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="What needs to be done?" aria-label="New todo" />
        <button type="submit">Add task</button>
      </form>
      {error && <p className="error">{error}. Is the server running?</p>}
      {loading ? <p className="empty">Loading…</p> : todos.length === 0 ? <p className="empty">Your list is clear. Add a task to get started.</p> : <ul>{todos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={todo => updateTodo(todo, { completed: !todo.completed })} onEdit={(id, value) => updateTodo({ id }, { text: value })} onDelete={deleteTodo} />)}</ul>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
