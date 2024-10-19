// Mongoose Schema: studentModel.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    reg: {
        type: "string",
        required: true,
        unique: true
    },
    name: {
        type: "string",
        required: true
    },
    date: {
        type: "string",
        required: true
    }
});

// Create the Student model
const Student = mongoose.model("Student", studentSchema);

export default Student;
