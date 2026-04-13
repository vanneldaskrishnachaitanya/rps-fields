const express = require("express");
const router = express.Router();
const { getTodos, addTodo, updateTodo, deleteTodo, resetTodos } = require("../controllers/todoController");
const { protect } = require("../middleware/auth");

router.use(protect); // All todo routes are protected

router.route("/").get(getTodos).post(addTodo);
router.post("/reset", resetTodos);
router.route("/:id").put(updateTodo).delete(deleteTodo);

module.exports = router;
