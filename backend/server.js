const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());  // VERY IMPORTANT!!

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'justride_db'
});

// Connect Database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database.');
});

// Login API
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received login:', username, password);

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      console.log('Admin not found.');
      return res.status(401).send('Invalid username or password');
    }

    const admin = results[0];

    bcrypt.compare(password, admin.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Bcrypt error:', err);
        return res.status(500).send('Server error');
      }

      console.log('Password match?', isMatch);

      if (isMatch) {
        const token = jwt.sign({ id: admin.id }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).send('Invalid username or password');
      }
    });
  });
});

// Start Server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
