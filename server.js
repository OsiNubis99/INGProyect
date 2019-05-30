var cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

//settings
app.set("Port", process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

//static files
app.use(express.static(path.join(__dirname, 'public')));

//routs
app.use('/REST/Usuarios', require('./routes/usuarios'));
app.use('/REST/Centrales', require('./routes/centrales'));
app.get('/',(req, res)=>{
    res.redirect('/')
})


//listening
app.listen(app.get("Port"), () => {
    console.log("Localhost:"+app.get("Port"));
});