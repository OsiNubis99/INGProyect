const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const {Client} = require('pg');
const path = require('path');
const app = express();

//settings
app.set("Port", process.env.PORT || 3000);
var cliente = new Client(require('./config/heroku'));
cliente.connect()
.then(() => console.log('DB is connected'))
.catch(err => console.error(err));

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

//static files
app.use(express.static(path.join(__dirname, 'public')));

//routs
app.use('/REST/Bitacora', require('./routes/bitacora'));
app.use('/REST/Usuarios', require('./routes/usuarios'));
app.use('/REST/Centrales', require('./routes/centrales'));
app.use('/REST/Conexiones', require('./routes/conexiones'));
app.use('/*',(req, res)=>{
  res.sendFile(path.join(__dirname, 'public/index.html'))
})


//listening
app.listen(app.get("Port"), () => {
    console.log("Localhost:"+app.get("Port"));
});