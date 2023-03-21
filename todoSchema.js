const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
    task: String, 
    priority: String,
    category: String, 
    completeBy: Date
})

module.exports = mongoose.model('ToDo', toDoSchema);


