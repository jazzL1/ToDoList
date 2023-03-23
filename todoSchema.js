const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },  
    priority: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    completeBy: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('ToDo', toDoSchema);


