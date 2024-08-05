const todoService = require('../services/todoService');
const { createObjectCsvWriter } = require('csv-writer');
const { Readable } = require('stream');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv'); 

exports.getTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.getTodoById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.createTodo = async (req, res) => {
  try {
    const data = {
      description: req.body.description,
      status: req.body.status || 'pending',
    };
    const savedTodo = await todoService.createTodo(data);
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};


exports.updateTodo = async (req, res) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};


exports.deleteTodo = async (req, res) => {
  try {
    const todo = await todoService.deleteTodo(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.csvFileUpload = async (req, res) => {
  try {
    // Check if the uploaded file is a valid CSV file based on its MIME type
    const fileMimeType = mime.lookup(req.file.originalname);
    if (fileMimeType !== 'text/csv') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
    }

    // Create a readable stream from the uploaded file's buffer
    const bufferStream = Readable.from(req.file.buffer.toString());

    const results = []; // Array to store parsed CSV data

    // Parse the CSV data and store each row into the results array
    bufferStream
      .pipe(csv.parse({ headers: true, delimiter: ',' })) // Parse CSV with headers and comma delimiter
      .on('data', (data) => results.push(data)) // On each row, push data to results array
      .on('error', (error) => {
        // Handle CSV parsing errors
        if (!res.headersSent) {
          res.status(400).json({ message: `Error processing CSV file: ${error.message}` });
        }
      })
      .on('end', async () => {
        try {
          // Insert the parsed data into the database using the service
          await todoService.insertTodosFromCSV(results);
          if (!res.headersSent) {
            res.status(200).json({ message: 'CSV file uploaded and processed successfully', data: results });
          }
        } catch (err) {
          // Handle database insertion errors
          if (!res.headersSent) {
            res.status(500).json({ message: `Error inserting data into database: ${err.message}` });
          }
        }
      });
  } catch (err) {
    // Handle any other errors that might occur
    if (!res.headersSent) {
      res.status(500).json({ message: `Internal server error: ${err.message}` });
    }
  }
};


exports.downloadCsv = async (req, res) => {
  try {
    // Fetch all todos from the database using the service
    const todos = await todoService.getAllTodos();

    // Generate a unique filename using the current timestamp
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `todos_${timestamp}.csv`;
    const filePath = path.join(__dirname, '../uploads', fileName); // Determine file path

    // Create a CSV writer instance and define the headers
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'description', title: 'Description' },
        { id: 'status', title: 'Status' },
      ],
    });

    // Write the fetched todos to the CSV file
    await csvWriter.writeRecords(todos);

    // Send the CSV file to the client for download
    res.download(filePath, 'todos_Date.csv', (err) => {
      if (err) {
        res.status(500).send('Could not download file.');
      }
    });
  } catch (err) {
    // Handle errors that might occur during the process
    res.status(400).json({ err: 'not found' });
  }
};


exports.filterTodos = async (req, res) => {
  try {
    // Retrieve the status filter from the query parameters
    const status = req.query.status;
    const query = status ? { status } : {}; // Build the query based on the status

    // Fetch filtered todos from the database using the service
    const todos = await todoService.getFilteredTodos(query);

    // Send the filtered todos back to the client
    res.json(todos);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: 'Server Error' });
  }
};
