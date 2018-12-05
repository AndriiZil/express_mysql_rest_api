const express = require('express');
const app = express();
const mysql = require('mysql');
const PORT = 4000;

// connection configurations
const mc = mysql.createConnection({
  host: 'localhost',
  user: 'testapi',
  password: 'admin123456789',
  database: 'testapi'
});
// connect to database
mc.connect(() => console.log('Connection created!'));

// default route
app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

// Retrieve all todos
app.get('/todos', function (req, res) {
  mc.query('SELECT * FROM tasks', (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Todos list.' });
  });
});

// Search for todos with ‘bug’ in their name
app.get('/todos/search/:keyword', (req, res) => {
  let keyword = req.params.keyword;
  mc.query('SELECT * FROM tasks WHERE task LIKE ? ', ['%' + keyword + '%'], (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Todos search list.' });
  });
});

// Retrieve todo with id
app.get('/todo/:id', (req, res) => {

  let task_id = req.params.id;

  mc.query('SELECT * FROM tasks where id=?', task_id, (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'Todos list.' });
  });

});

// Add a new todo
app.post('/todo', (req, res) => {
  let task = req.body.task;

  if (!task) {
    return res.status(400).send({ error:true, message: 'Please provide task' });
  }

  mc.query('INSERT INTO tasks SET ? ', { task: task }, (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New task has been created successfully.' });
  });
});

//  Update todo with id
app.put('/todo', function (req, res) {

  let task_id = req.body.task_id;
  let task = req.body.task;

  if (!task_id || !task) {
    return res.status(400).send({ error: task, message: 'Please provide task and task_id' });
  }

  mc.query('UPDATE tasks SET task = ? WHERE id = ?', [task, task_id], (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
  });
});

//  Delete todo
app.delete('/todo/:id', (req, res) => {
  let task_id = req.params.id;

  mc.query('DELETE FROM tasks WHERE id = ?', [task_id], (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
  });
});

// all other requests redirect to 404
app.all('*', (req, res, next) => {
  return res.send('page not found');
  next();
});

app.listen(PORT, console.log(`SERVER STARTED ON PORT ${PORT}`));