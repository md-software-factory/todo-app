import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function readTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

const INTERVALS = { daily: 864e5, weekly: 6048e5 };

function nextRun(recurrence, from = Date.now()) {
  return new Date(from + INTERVALS[recurrence]).toISOString();
}

// Reset completed recurring todos whose scheduled time has passed.
// Advances nextRunAt by whole intervals so the schedule stays anchored.
function applyResets(todos) {
  const now = Date.now();
  let changed = false;
  for (const todo of todos) {
    if (todo.recurrence && todo.completed && todo.nextRunAt && Date.parse(todo.nextRunAt) <= now) {
      todo.completed = false;
      let next = Date.parse(todo.nextRunAt);
      while (next <= now) next += INTERVALS[todo.recurrence];
      todo.nextRunAt = new Date(next).toISOString();
      changed = true;
    }
  }
  return changed;
}

// GET /api/todos - list all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  if (applyResets(todos)) {
    writeTodos(todos);
  }
  res.json(todos);
});

// POST /api/todos - create a new todo
app.post('/api/todos', (req, res) => {
  const { text, recurrence } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (recurrence !== undefined && recurrence !== null && !INTERVALS[recurrence]) {
    return res.status(400).json({ error: "recurrence must be 'daily' or 'weekly'" });
  }
  const todos = readTodos();
  const todo = {
    id: uuidv4(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  if (recurrence) {
    todo.recurrence = recurrence;
    todo.nextRunAt = nextRun(recurrence);
  }
  todos.push(todo);
  writeTodos(todos);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id - update a todo
app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed, recurrence } = req.body;
  if (recurrence !== undefined && recurrence !== null && !INTERVALS[recurrence]) {
    return res.status(400).json({ error: "recurrence must be 'daily' or 'weekly'" });
  }
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const todo = todos[index];
  if (text !== undefined) todo.text = text.trim();
  if (completed !== undefined) todo.completed = completed;
  if (recurrence !== undefined) {
    if (recurrence === null) {
      delete todo.recurrence;
      delete todo.nextRunAt;
    } else {
      todo.recurrence = recurrence;
      todo.nextRunAt = nextRun(recurrence);
    }
  }
  // Completing an overdue recurring todo would instantly reset on next read;
  // push the schedule to the next future slot instead.
  if (todo.recurrence && todo.completed && todo.nextRunAt && Date.parse(todo.nextRunAt) <= Date.now()) {
    todo.nextRunAt = nextRun(todo.recurrence);
  }
  writeTodos(todos);
  res.json(todo);
});

// DELETE /api/todos/:id - delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const deleted = todos.splice(index, 1)[0];
  writeTodos(todos);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
