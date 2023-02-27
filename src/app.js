const express = require('express');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
require("dotenv").config({path:`${__dirname}/../.env`});
//for api
const morgan = require('morgan');
//const cors = require('cors');

const authRoute = require('./routes/auth.route');

const { httpLogStream } = require('./utils/logger');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: httpLogStream }));

//end


//const app = express();
app.use(cookieParser());

app.use(cors());

//body parser middleware gi
const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({extended: false}));

app.set('views', path.join(__dirname, './../views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' , partialsDir: __dirname + '../partials' }));
app.set('view engine', 'handlebars');

app.use("/public",express.static(__dirname + './../public'))

//routes
app.use('/', require('./template'));

app.use("/user", require('./user') );
//for api routes
app.use('/api/auth', authRoute);

app.get('/api/auth', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});
//end api routes

app.use("/*", (req, res) => {
    res.status(404).send(`<br><br><h1 style="text-align: center;">404 || content not found</h1>`);
    
});

const PORT = process.env.PORT || 5512 ; 

app.listen(PORT, () => { console.log(`server started ar PORT number ${PORT}`)})