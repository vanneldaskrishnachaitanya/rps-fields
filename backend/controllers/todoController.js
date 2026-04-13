const Todo = require("../models/Todo");

const getDefaultList = (role) => {
  switch (role) {
    case "customer":
      return [
        { text: "Track active deliveries", isDefault: true },
        { text: "Browse new listings", isDefault: true },
        { text: "Leave a rating for past orders", isDefault: true },
        { text: "Clear pending payments", isDefault: true },
        { text: "Update delivery address", isDefault: true }
      ];
    case "agent":
      return [
        { text: "Add new product listings", isDefault: true },
        { text: "Update inventory & prices", isDefault: true },
        { text: "Process incoming orders", isDefault: true },
        { text: "Schedule farm visits", isDefault: true },
        { text: "Coordinate deliveries", isDefault: true }
      ];
    case "farmer":
      return [
        { text: "Prepare stock for agent", isDefault: true },
        { text: "Request product listing", isDefault: true },
        { text: "Check 7-day weather forecast", isDefault: true },
        { text: "Track sales progress", isDefault: true },
        { text: "Schedule agent consultation", isDefault: true }
      ];
    case "admin":
      return [
        { text: "Review new user registrations", isDefault: true },
        { text: "Check system logs", isDefault: true }
      ];
    default:
      return [];
  }
};

// @desc    Get user's todos
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    let todos = await Todo.find({ user: req.user.id }).sort({ createdAt: 1 });

    // If no todos exist at all for this user, populate defaults
    if (todos.length === 0) {
      const defaultTasks = getDefaultList(req.user.role).map(task => ({
        ...task,
        user: req.user.id
      }));

      if (defaultTasks.length > 0) {
        todos = await Todo.insertMany(defaultTasks);
      }
    }

    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add a new todo
// @route   POST /api/todos
// @access  Private
const addTodo = async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ success: false, error: "Please add text" });
    }

    const todo = await Todo.create({
      text: req.body.text,
      user: req.user.id,
      isDefault: false,
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, error: "Todo not found" });
    }

    // Check for user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "User not authorized" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, error: "Todo not found" });
    }

    // Check for user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: "User not authorized" });
    }

    await todo.deleteOne();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reset defaults
// @route   POST /api/todos/reset
// @access  Private
const resetTodos = async (req, res) => {
  try {
    // Delete all current todos for the user
    await Todo.deleteMany({ user: req.user.id });

    // Populate with defaults
    const defaultTasks = getDefaultList(req.user.role).map(task => ({
      ...task,
      user: req.user.id
    }));

    let todos = [];
    if (defaultTasks.length > 0) {
      todos = await Todo.insertMany(defaultTasks);
    }

    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  resetTodos
};
