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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password, school } = req.body;
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
  console.log(`Username: ${username}, Password: ${password}, School: ${school}`);
});

app.post('/signup', (req, res) => {
  const { username, password, email, school } = req.body;
  const query = 'INSERT INTO users (username, password, email, school) VALUES (?, ?, ?, ?)';
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.query(query, [username, hash, email, school], (err, results) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
  console.log(`Username: ${username}, Password: ${password}, Email: ${email}, School: ${school}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});