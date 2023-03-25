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

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports.toDoItem = mongoose.model('ToDo', toDoSchema);

module.exports.user = mongoose.model('User', userSchema);


