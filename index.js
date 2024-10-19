import express from 'express';
import mongoose from 'mongoose';
import Student from './studentModel/studentModel.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URL (replace credentials with your own)
const mongourl = 'mongodb+srv://Saumya:12345@cluster0.cupbt.mongodb.net/studentDB?retryWrites=true&w=majority';

mongoose.connect(mongourl)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);  // Exit process on failure to connect
    });

// Get all students
app.get('/student', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).send("Server Error");
    }
});

// Add a new student
app.post('/student', async (req, res) => {
    const { name, date, reg } = req.body;
    const newStudent = new Student({ name, date, reg });

    try {
        const savedStudent = await newStudent.save();
        res.status(200).json(savedStudent);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).send("Server Error");
    }
});

// Update a student
app.put('/student/:id', async (req, res) => {
    const { name, date, reg } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { name, date, reg }, { new: true });
        if (!updatedStudent) return res.status(404).send('Student not found');
        res.json(updatedStudent);
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).send("Server Error");
    }
});

// Delete a student
app.delete('/student/:reg', (req, res) => {
    const reg = req.params.reg;  // Get the 'reg' value from the URL parameters
    
    Student.findOneAndDelete({ reg })  // Find student by 'reg' and delete
        .then(() => {
            res.status(200).send('Student deleted successfully');  // Send success response
        })
        .catch((error) => {
            res.status(400).send({ error: 'Error deleting student', details: error });  // Send error response if deletion fails
        });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
