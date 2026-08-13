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

// GET /api/todos - list all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST /api/todos - create a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const todos = readTodos();
  const todo = {
    id: uuidv4(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  writeTodos(todos);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id - update a todo
app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  if (text !== undefined) todos[index].text = text.trim();
  if (completed !== undefined) todos[index].completed = completed;
  writeTodos(todos);
  res.json(todos[index]);
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
