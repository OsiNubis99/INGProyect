var express = require('express');
var router = express.Router();

var {Client} = require('pg');
var bcrypt = require('bcryptjs');

router.get('/', async function (req, res) {
  var cliente = new Client({
    user: "osdmeqpylslznh",
    password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
    database: "d4u0fuis94bmbi",
    port: 5432,
    host: "ec2-54-83-36-37.compute-1.amazonaws.com",
    ssl: true
  });
  await cliente.connect();
  var respuesta = await cliente.query("SELECT * FROM usuarios");
  res.json(respuesta.rows);
  await cliente.end();
});

router.post('/Iniciar', async function (req, res) {
  var cliente = new Client({
    user: "osdmeqpylslznh",
    password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
    database: "d4u0fuis94bmbi",
    port: 5432,
    host: "ec2-54-83-36-37.compute-1.amazonaws.com",
    ssl: true
  });
  await cliente.connect();
  var respuesta = await cliente.query("SELECT * FROM usuarios WHERE nombreusuario='"+req.body.nombreusuario+"'");
  if(respuesta.rows.length==1 && bcrypt.compareSync(req.body.clave, respuesta.rows[0].clave)){
    res.json(respuesta.rows[0]);
  }else{
    res.json(false);
  }
  await cliente.end();
});

router.post('/Validar', async function (req, res) {
  var cliente = new Client({
    user: "osdmeqpylslznh",
    password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
    database: "d4u0fuis94bmbi",
    port: 5432,
    host: "ec2-54-83-36-37.compute-1.amazonaws.com",
    ssl: true
  });
  await cliente.connect();
  var respuesta = await cliente.query("SELECT * FROM usuarios WHERE nombreusuario='"+req.body.nombreusuario+"'");
  if(respuesta.rows.length==0){
    res.json(true);
  }else{
    res.json(false);
  }
  await cliente.end();
});

router.post('/Agregar', async function (req, res) {
  var cliente = new Client({
    user: "osdmeqpylslznh",
    password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
    database: "d4u0fuis94bmbi",
    port: 5432,
    host: "ec2-54-83-36-37.compute-1.amazonaws.com",
    ssl: true
  });
  var clave = bcrypt.hashSync(req.body.clave, 10);
  await cliente.connect();
  var codigo = await cliente.query("select count(codigoempleado) from usuarios");
  codigo =  codigo.rowCount + 1;
  var respuesta = await cliente
  .query("INSERT INTO usuarios (codigoempleado,nombre,apellido,nombreusuario,cargo,clave,clavetemporal,intentos)"
    +" VALUES ('"+codigo+"', '"+req.body.nombre+"', '"+req.body.apellido+"', '"+req.body.nombreusuario+"', "+req.body.cargo+", '"+clave+"', true, 0);");
  res.json(respuesta.rows);
  await cliente.end();
});

module.exports = router;