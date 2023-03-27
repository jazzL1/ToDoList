const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const {toDoItem, user} = require('./schemas.js');

const passport = require('passport');
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
const session = require('express-session');
app.use(session({
    secret: 'ASDFPOIU',
    resave: false,
    saveUninitialized: true,
    }
));
app.use(passport.session());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const mongoose = require('mongoose');
const { format } = require("url");
const { use } = require("passport");
const { application } = require("express");
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

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/', passport.authenticate('local'), (req,res) => {
    res.redirect('/toDo');
})

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    user.register(new user({ username : req.body.username}), req.body.password, () => {
        passport.authenticate('local')(req, res, () => {
            res.redirect('/toDo');
        });
    });
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
    
});

app.get('/toDo', async (req, res) => {
    const currentUser = req.user;
    const username = currentUser.username;
    const currentUserToDos = await toDoItem.find({user: currentUser});
    const workToDos = []; 
    const personalToDos =[];
    const schoolToDos = [];
    for(toDo of currentUserToDos) {
        if(toDo.category === "work") {
            workToDos.push(toDo);
        }
        else if(toDo.category === "personal") {
            personalToDos.push(toDo);
        }
        else {
            schoolToDos.push(toDo);
        }
    }
    sortCategories(workToDos);
    sortCategories(personalToDos);
    sortCategories(schoolToDos);
    res.render('index', {workToDos, personalToDos, schoolToDos, formatDate, defaultDate, username});
});

app.post('/toDo', async (req, res) => {
    const userSubmission =  req.body;
    const newToDo = await new toDoItem({task: userSubmission.task, priority:userSubmission.priority, category: userSubmission.category, completeBy: userSubmission.completeBy, user: req.user});
    await newToDo.save();
    res.redirect('/toDo');
})

app.delete('/toDo/:id', async (req, res) => {
    await toDoItem.findByIdAndDelete(req.params.id);
    res.redirect('/toDo');
})

app.patch('/toDo/:id', async (req, res) => {
    const updates = req.body;
    await toDoItem.findByIdAndUpdate(req.params.id, {$set: updates});
    res.redirect('/toDo');
})

app.listen(port, () => {
    console.log(`Listenting on port ${port}`);
});
