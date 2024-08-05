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
          url: 'http://localhost:5000', // Update this to match your base URL
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

  module.exports = swaggerOptions