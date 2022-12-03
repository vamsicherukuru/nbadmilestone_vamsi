//require modules..

const express = require('express');
const morgan = require('morgan');
const tradeRoutes = require('./routes/tradeRoutes');
const mainRoutes = require('./routes/mainRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');


//create app
const app = express();


//server configurations...
let host = 'localhost';
let port = 3000;
app.set('view engine','ejs');


//mongoose connection

mongoose.connect('mongodb://0.0.0.0:27017/demos',{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
.then(()=> app.listen(port,host,()=>{
    console.log("Server is running on Port: ",port)
}))
.catch(err=>console.log(err.message));






// middleware
app.use(methodOverride('_method'));

app.use(morgan('tiny'));

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'vamsicherukuru1999',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge: 60*60*1000},
    store:new MongoStore({mongoUrl: 'mongodb://0.0.0.0:27017/demos' })
    }));

app.use(flash());
app.use((req,res,next)=>{
    // if(!req.session.counter)
    //     req.session.counter = 1
    // else
    //     req.session.counter++;
    console.log(req.session);

    res.locals.user = req.session.user||null;
    res.locals.successMessages=req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

// routes configuration

app.use('/',mainRoutes);
app.use('/users', userRoutes);

app.use('/trades',tradeRoutes);

///handle 404 error

app.use((req,res,next)=>{
    let err = new Error('The server cannot locate '+ req.url);
    err.status = 404;
    req.flash('error','The server cannot locate '+req.url);
    return res.redirect('back');
    next(err);
});
    

app.use((err,req,res,next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error',{error:err});

});


















// // Turning on the server to listen on the declared port and host...
// app.listen(port,host,()=>{
//     console.log("Server is up and running.. on port no: "+port);
// });