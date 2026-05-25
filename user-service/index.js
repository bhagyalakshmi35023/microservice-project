const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol', email: 'carol@example.com' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'up', service: 'user-service' });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.listen(port, () => {
  console.log(`user-service listening on port ${port}`);
});
