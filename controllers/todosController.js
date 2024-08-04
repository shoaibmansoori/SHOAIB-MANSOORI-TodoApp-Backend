const Todo = require('../models/todo');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { createObjectCsvWriter } = require('csv-writer');
// const csv = require('csv-parser');
// const multer = require('multer');
const fs = require('fs');
const path = require('path')
const csv = require('fast-csv'); // or whichever CSV parsing library you're using
const { Readable } = require('stream');
const mime = require('mime-types');

// const upload = multer({ dest: 'uploads/' });



// Fetch all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Fetch a single todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add a new todo
exports.createTodo = async (req, res) => {
  try {
    console.log("fhfkjhd")
    const data = {
      description: req.body.description,
      status: req.body.status || 'pending',
    }
    const newTodo = new Todo(data);
    console.log("newTodo",newTodo)
    const savedTodo = await newTodo.save(newTodo);
    console.log("saveTodo",savedTodo)
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Update an existing todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
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
    // Create a readable stream from the uploaded file's buffer
    const fileMimeType = mime.lookup(req.file.originalname);
    if (fileMimeType !== 'text/csv') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
    }
    const bufferStream = Readable.from(req.file.buffer.toString());
    
    // Create an array to store the parsed CSV data
    const results = [];

    // Parse the CSV data
    bufferStream
      .pipe(csv.parse({ headers: true, delimiter: ',' }))
      .on('data', (data) => {
        // Push each row of CSV data to the results array
        const columnCount = Object.keys(data).length;
        console.log('Processed Row:', data);
        console.log('Column Count:', columnCount);
        results.push(data);
      })
      .on('error', (error) => {
        console.error(`Parsing error: ${error.message}`);
        // Ensure headers are not sent multiple times
        if (!res.headersSent) {
          res.status(400).json({ message: `Error processing CSV file: ${error.message}` });
        }
      })
      .on('end', async () => {
        try {
          // Insert the parsed data into the database
          await Todo.insertMany(results);
          // Send a success response to the client
          if (!res.headersSent) {
            res.status(200).json({ message: 'CSV file uploaded and processed successfully', data: results });
          }
        } catch (err) {
          // Handle any errors that occur during database insertion
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
    const todos = await Todo.find().lean();
    console.log(todos, "todos");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `todos_${timestamp}.csv`;
    const filePath = path.join(__dirname, '../uploads', fileName);

    // Create a CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: '_id', title: 'ID' },
        { id: 'description', title: 'Description' },
        { id: 'status', title: 'Status' },
      ],
    });

    await csvWriter.writeRecords(todos);
    res.download(filePath, 'todos.csv', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not download file.');
      }// } else {
      //   fs.unlink(filePath, (unlinkErr) => {
      //     if (unlinkErr) {
      //       console.error('Error deleting file:', unlinkErr);
      //     }
      //   });
      // }
    });
  } catch (err) {
    // console.error('Caught server error:', err);
    res.status(400).json({ err: 'not found' });
  }
};




exports.filterTodos = async (req, res) => {
  try {
    const status = req.query.status;
    console.log(status,"status")
    const query = status ? { status } : {};

    const todos = await Todo.find(query);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

