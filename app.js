const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const todoRoutes = require('./routes/todosRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/todos', todoRoutes);


// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: 'API documentation for the Todo List Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update this to match your base URL
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['description', 'status'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the todo',
            },
            description: {
              type: 'string',
              description: 'The todo description',
            },
            status: {
              type: 'string',
              description: 'The status of the todo (e.g., "completed", "pending")',
            },
          },
          example: {
            _id: 'd5fE_asz',
            description: 'Finish the Node.js project',
            status: 'completed',
          },
        },
      },
    },
  },
  apis: ['./routes/todosRoutes.js'], // Paths to files to be documented
};
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
