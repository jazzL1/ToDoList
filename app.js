const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const ToDoItem = require('./todo.js');

let toDoArray = [[], [], []];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.render('index', {toDoArray});
});

app.post('/', (req, res) => {
    const userSubmission =  req.body;
    const newToDo = new ToDoItem(userSubmission.task, userSubmission.priority, userSubmission.category, userSubmission.completeBy);
    if(newToDo.category === "work") {
        toDoArray[0].push(newToDo);
    }
    else if(newToDo.category === "personal") {
        toDoArray[1].push(newToDo);
    }
    else {
        toDoArray[2].push(newToDo);
    }
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Listenting on ${port}`);
});
