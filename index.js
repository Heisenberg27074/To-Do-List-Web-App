const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const express = require('express');
const port = 8000;
const path = require('path');

const db = require('./config/mongoose');
const Task = require('./models/task');

const app = express();

//  use express router

app.use(express.urlencoded());
app.use(express.static('assets'))

// set up our view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
    Task.find({}, function (err, tasks) {
        if (err) {
            console.log("Error in fetching tasks from db", err);
            return;
        }
        return res.render('home', {
            title: "My Tasks",
            task_list: tasks
        });
    })

});

app.post('/create-task',function (req, res) {
    console.log(req.body);
    Task.create({
        description: req.body.description,
        date: req.body.date,
        category: req.body.category

    }, (err, newTask) => {
        if (err) { console.log('There is some issue in creating new Task', err); return; }
        console.log('*******', newTask);
        return res.redirect('back');
    
    });
});

// for deleting task
app.get('/remove-item', (req,res)=>{
    console.log(req.query);
    let id = req.query.id;

    Task.findByIdAndDelete(id, function(err){
        if(err){console.log(`error in removing the task ${err}`); return;}
        return res.redirect('back');
    });


});



app.listen(port, (err) => {
    if (err) { console.log(`Error ${err}`); }
    else { console.log(`Server is running on port: ${port}`) }
});