
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

let users = [];

router.post('/signup', async (req, res) => {
    const { role, name, email, password } = req.body;
    if (!email || !password || !role || !name) {
        return res.status(400).json({ message: 'All fields required' });
    }
    const user = users.find(u => u.email === email || u.phone === email);
    if (user) return res.status(400).json({ message: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    users.push({ id: users.length + 1, role, name, email, password: hashed });
    res.status(201).json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email || u.phone === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, 'secret123');
    res.json({ token, role: user.role, name: user.name });
});

module.exports = router;
