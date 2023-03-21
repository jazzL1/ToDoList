const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const toDoItem = require('./todoSchema.js');

const mongoose = require('mongoose');
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/toDoList');
}
main()
.then(() => {console.log('Successfully connected to database')})
.catch(err => console.log(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); 

app.get('/', async (req, res) => {
    const workToDos = await toDoItem.find({category: "work"});
    const personalToDos = await toDoItem.find({category: "personal"});
    const schoolToDos = await toDoItem.find({category: "school"});
    res.render('index', {workToDos, personalToDos, schoolToDos});
});

app.post('/', async (req, res) => {
    const userSubmission =  req.body;
    const newToDo = await new toDoItem({task: userSubmission.task, priority:userSubmission.priority, category: userSubmission.category, completeBy: userSubmission.completeBy});
    await newToDo.save();
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Listenting on port ${port}`);
});
