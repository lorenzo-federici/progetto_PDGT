// Package-----------------------------------------------------
const express    = require('express');
const app        = express();
const morgan     = require('morgan');  // Packege for terminal's information when i send request
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
//-------------------------------------------------------------

//DB CONNECTION------------------------------------------------
const userDB = process.env.userDB;
const passDB = process.env.passDB;
const nameDB = process.env.nameDB;

const uri = 'mongodb+srv://'+ userDB +':'+ passDB +'@cluster0-rwc9w.mongodb.net/'+ nameDB +'?retryWrites=true&w=majority'
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
mongoose.Promise = global.Promise;
//-------------------------------------------------------------

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()) ;

// Add specific header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", 
               "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Origin", "GET, DELETE, PATCH, POST");
        return res.status(200).json({});
    }
    next();
});

// Add Route---------------------------------------------------
const userRoutes    = require('./api/routes/users');
const stationRoutes = require('./api/routes/stations');

app.use('/users', userRoutes); 
app.use('/stations', stationRoutes); 
//-------------------------------------------------------------

app.use('/',(req, res) => {
    res.send('Ciao a tutti');
});

//general error and route--------------------------------------
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
//-------------------------------------------------------------

module.exports = app;