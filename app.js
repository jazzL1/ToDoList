const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const toDoItem = require('./todoSchema.js');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const mongoose = require('mongoose');
const { format } = require("url");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/toDoList');
}
main()
.then(() => {console.log('Successfully connected to database')})
.catch(err => console.log(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 


function formatDate(toDoItem) {
    const day = toDoItem.completeBy.getUTCDate();
    const month = toDoItem.completeBy.getUTCMonth() + 1;
    const year = toDoItem.completeBy.getUTCFullYear();
    return `${year}/${month}/${day}`;
  };

function sortCategories(categoryArray) {
    categoryArray.sort((toDo1, toDo2) => toDo1.completeBy - toDo2.completeBy || toDo1.priority - toDo2.priority);
}

function defaultDate(toDoItem) {
    let day = toDoItem.completeBy.getUTCDate();
    let month = (toDoItem.completeBy.getUTCMonth() + 1);
    const year = toDoItem.completeBy.getUTCFullYear();
    if(month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    return `${year}-${month}-${day}`;
  };


app.get('/', async (req, res) => {
    const workToDos = await toDoItem.find({category: "work"});
    sortCategories(workToDos);
    const personalToDos = await toDoItem.find({category: "personal"});
    sortCategories(personalToDos);
    const schoolToDos = await toDoItem.find({category: "school"});
    sortCategories(schoolToDos);
    // const toDoArray = [workToDos, personalToDos, schoolToDos];
    res.render('index', {workToDos, personalToDos, schoolToDos, formatDate, defaultDate});
});

app.post('/', async (req, res) => {
    const userSubmission =  req.body;
    const newToDo = await new toDoItem({task: userSubmission.task, priority:userSubmission.priority, category: userSubmission.category, completeBy: userSubmission.completeBy});
    await newToDo.save();
    res.redirect('/');
})

app.delete('/:id', async (req, res) => {
    await toDoItem.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

app.patch('/:id', async (req, res) => {
    const updates = req.body;
    await toDoItem.findByIdAndUpdate(req.params.id, {$set: updates});
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Listenting on port ${port}`);
});
