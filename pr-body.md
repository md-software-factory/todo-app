## Summary
Implements issue #1 - a complete todo application.

**Backend**
- Express server with REST API: GET/POST/PATCH/DELETE `/api/todos`
- Todos persisted to `data/todos.json`
- CORS enabled for local frontend dev

**Frontend**
- React + Vite single-page app
- Add, complete, edit, and delete todos
- Warm visual design with serif headings and minimal UI

## Test Plan
1. Start server: `cd server && npm install && npm start`
2. Start client: `cd client && npm install && npm run dev`
3. Open http://localhost:5173
4. Verify you can add, complete, edit, and delete todos
5. Restart server - todos persist

## Changes
- `server/server.js` - Express API
- `server/package.json` - Backend deps
- `client/index.html` - Entry point
- `client/src/main.jsx` - React app
- `client/src/styles.css` - Styling
- `client/package.json` - Frontend deps
- `data/todos.json` - Persistence file
- `.gitignore` - Ignore node_modules, dist, data file

Closes #1
