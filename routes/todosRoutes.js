// const express = require('express');
// const router = express.Router();
// const todoController = require('../controllers/todosController');
// const multer = require('multer');
// const upload = multer(); // Configure multer to handle file uploads


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Todo:
//  *       type: object
//  *       required:
//  *         - description
//  *         - status
//  *       properties:
//  *         _id:
//  *           type: string
//  *           description: The auto-generated id of the todo
//  *         description:
//  *           type: string
//  *           description: The todo description
//  *         status:
//  *           type: string
//  *           description: The status of the todo (e.g., "completed", "pending")
//  *       example:
//  *         _id: d5fE_asz
//  *         description: Finish the Node.js project
//  *         status: completed
//  */

// /**
//  * @swagger
//  * /todos:
//  *   get:
//  *     summary: Returns the list of all todos
//  *     tags: [Todos]
//  *     responses:
//  *       200:
//  *         description: The list of todos
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Todo'
//  */

// router.get('/download', todoController.downloadCsv);
// router.get('/filter', todoController.filterTodos);
// router.post('/upload', upload.single('file'), todoController.csvFileUpload);
// router.get('/:id', todoController.getTodoById);
// router.post('/', todoController.createTodo);
// router.put('/:id', todoController.updateTodo);
// router.delete('/:id', todoController.deleteTodo);
// router.get('/', todoController.getTodos);

// //csv routes
// // router.post('/upload', todoController.uploadCsv);



// module.exports = router;


const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todosController');
const multer = require('multer');
const upload = multer();

/**
 * @swagger
 * /todos/download:
 *   get:
 *     summary: Download a CSV file of all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The CSV file is successfully downloaded.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
router.get('/download', todoController.downloadCsv);

/**
 * @swagger
 * /todos/filter:
 *   get:
 *     summary: Filter todos based on query parameters
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter todos by status
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter todos by description
 *     responses:
 *       200:
 *         description: The filtered list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get('/filter', todoController.filterTodos);

/**
 * @swagger
 * /todos/upload:
 *   post:
 *     summary: Upload a CSV file to create todos
 *     tags: [Todos]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: The CSV file was successfully processed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid file type or error processing CSV
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), todoController.csvFileUpload);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: The todo description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.get('/:id', todoController.getTodoById);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The todo was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', todoController.createTodo);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update an existing todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The todo was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', todoController.updateTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: The todo was successfully deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', todoController.deleteTodo);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retrieve a list of all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of all todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get('/', todoController.getTodos);

module.exports = router;

