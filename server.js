const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mc2learn'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.redirect('/Home.students.html');
        } else {
          res.send('Incorrect username or password');
        }
      });
    } else {
      res.send('Incorrect username or password');
    }
  });
});

app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.query(query, [username, hash, email], (err, results) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});