const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');  
const todoRoutes = require('./routes/todosRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT|| 3000;

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/todos', todoRoutes);


// swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Error Handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
