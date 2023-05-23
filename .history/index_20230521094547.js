// Import required libraries
const express = require('express');
const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abc123',
  database: 'classicmodels',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Create an Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// TABLE

// Create new entry row
app.post('/newEntry', (req, res) => {
  // Retrieve the request data
  const requestData = req.body;

  // Construct the SQL query
  const request1 = Object.getOwnPropertyNames(requestData);
  const request2 = Object.values(requestData).map(value => `'${value}'`);

  console.log("Connected!", req.body);
  const sql = `INSERT INTO test (${request1.join(',')}) VALUES (${request2.join(',')})`;

  connection.query(sql, function (err, result) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving records' });
    } else {
      res.json(sql);
    }
  });
});


// Retrieve table contents
app.get('/:table/info', (req, res) => {
  const { table } = req.params
  const query = `SELECT * FROM ${table}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving records' });
    } else {
      res.json(results);
    }
  });
});

// Retrieve table information
app.get('/:table/contents', (req, res) => {
  const { table } = req.params;
  const query = `DESCRIBE ${table}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err); 
      res.status(500).json({ error: 'Error retrieving column information' });
    } else {
      const columns = results.map((result) => ({
        table: result.Field,
        type: result.Type,
      }));
      res.json(columns);
    }
  });
});

// Update table value
app.put('/:table/:columnName/:row', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE records SET name = ?, email = ? WHERE id = ?';
  connection.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating record' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json({ message: 'Record updated successfully' });
    }
  });
});

// Delete row
app.delete('/records/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM records WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error deleting record' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Record not found' });
    } else {
      res.json({ message: 'Record deleted successfully' });
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
