# Todo List Management System

This is a Node.js backend application designed to manage a Todo List. The application includes CRUD operations, CSV file upload/download functionality, and integrates with MongoDB Atlas for data persistence. The project follows best practices in error handling and code structure, and also includes Swagger API documentation.

## Features

1. CRUD Operations: Create, Read, Update, Delete todos
2. CSV File Upload: Upload a CSV file to bulk import todos
3. CSV File Download: Download the list of todos as a CSV file.
4. MongoDB Integration: Uses MongoDB Atlas for database management.
5. Swagger Documentation: Provides API documentation through Swagger UI.


### Clone the Repository

git clone https://github.com/shoaibmansoori/SHOAIB-MANSOORI-AnswersAi-Backend.git


### Running the Project

1. Install dependencies:
   npm install

2. Run the project:
   npm start

3. For development, you can use nodemon to automatically restart the server on changes:
   npm start dev



### Endpoints

**Base URL: /todos**


- **GET /:** Retrieve all todos.
- **GET /:id:** Retrieve a todo by ID.
- **POST /:** Create a new todo.
- **Put /:id:**  Update a todo by ID.
- **DELETE /:id:** Delete a todo by ID.
- **POST /upload** Upload a CSV file to import todos.
- **GET /download** Download todos as a CSV file.
- **GET /filter:** Filter todos based on specific criteria.



### Environment Variables

- **MONGODB_URI**: your_mongodb_url
- **PORT**: 5000


### Testing

### Swagger Documentation
1. The Swagger UI is available at http://localhost:5000/api-docs.
2. It provides detailed documentation and the ability to test API endpoints directly.


### Database Setup
1. Create a MongoDB Atlas account and set up a new cluster.

2. Create a database named Todo

3. Replace the connection URI in config/db.js with your MongoDB Atlas connection string.

 

### Dependencies

- **Node.js**
- **Express.js**
- **Mongoose**
- **Multer**
- **CSV-writer**
- **fast-csv**
- **Swagger-UI-Express**
- **swagger-jsdoc**
- **body-parser**   










