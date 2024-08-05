// services/todoService.js
const Todo = require('../models/todo');

exports.getAllTodos = async () => {
  return await Todo.find();
};

exports.getTodoById = async (id) => {
  return await Todo.findById(id);
};

exports.createTodo = async (data) => {
  const newTodo = new Todo(data);
  return await newTodo.save();
};

exports.updateTodo = async (id, data) => {
  return await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTodo = async (id) => {
  return await Todo.findByIdAndDelete(id);
};

exports.insertTodosFromCSV = async (todos) => {
  return await Todo.insertMany(todos);
};

exports.getFilteredTodos = async (query) => {
  return await Todo.find(query);
};
