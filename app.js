const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set View Engine to EJS
app.set('view engine', 'ejs');

//Setting up Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Connecting our App with MongoDB using mongoose
const url = 'mongodb+srv://scriptnation:12345@cluster0.ameaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, connectionParams).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));

//Call the database model
const Diary = require('./models/Diary');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//ROUTES

app.get('/', (req, res) => {
    res.render('Home');
})

app.get('/diary', (req, res) => {

    Diary.find().then((data) => {
        res.render('Diary', { data: data });
    }).catch(err => conaole.log(err))

})


app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data: data });
    })
        .catch(err => console.log(err));
})

app.get('/add', (req, res) => {
    res.render('Add');
})

app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then((data) => {
        res.render('Edit', { data: data });
    }).catch(err => console.log(err));
})


app.get('/about', (req, res) => {
    res.render('About');
})

app.put('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        data.title = req.body.title,
            data.description = req.body.description,
            data.date = req.body.date

        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err))
    }).catch(err => console.log(err));
})

app.delete('/diary/delete/:id', (req, res) => {
    Diary.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})

app.post('/add-to-diary', (req, res) => {
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    })

    //saving data in the database
    Data.save().then(() => {
        console.log("Data Saved");
        res.redirect('/diary');
    })
        .catch(err => console.log(err));
})

app.listen(port, () => console.log("Server Started Running"));