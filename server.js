const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://hilalahmad13339:Uoh89911@cluster0.sio6w64.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema for the to-do item
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    editing: Boolean, // Add a new field for tracking editing status
});

// Create a model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

// Define routes

// Get all to-do items
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get todos' });
    }
});

// Add a new to-do item
app.post('/todos', async (req, res) => {
    const { text } = req.body;
    const todo = new Todo({
        text,
        completed: false,
        editing: false, // Set editing status to false by default
    });

    try {
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create todo' });
    }
});

// Update a to-do item
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed, editing } = req.body;

    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todo.text = text || todo.text;
        todo.completed = completed || todo.completed;
        todo.editing = editing || todo.editing;

        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update todo' });
    }
});


// Delete a to-do item
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete todo' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
