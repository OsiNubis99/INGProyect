var express = require('express');
var router = express.Router();

var {
  Client
} = require('pg');
var bcrypt = require('bcryptjs');
//Lista todos los usuarios del sistema
router.get('/Listar', async function (req, res) {
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
//retorna un objeto, usuario si es todo ok, o {error: "Tipo de error"}
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
  var respuesta = await cliente.query("SELECT * FROM usuarios WHERE nombreusuario='" + req.body.nombreusuario + "'");
  if (respuesta.rows.length == 1) {
    var intentos = respuesta.rows[0].intentos;
    if (intentos < 3) {
      if (bcrypt.compareSync(req.body.clave, respuesta.rows[0].clave)) {
        res.json(respuesta.rows[0]);
      } else {
        intentos++;
        await cliente.query("UPDATE usuarios SET intentos=" + intentos + " WHERE nombreusuario='" + req.body.nombreusuario + "'");
        res.json({
          error: "Clave"
        });
      }
    } else {
      res.json({
        error: "Bloqueado"
      })
    }
  } else {
    res.json({
      error: "Usuario"
    });
  }
  await cliente.end();
});
//retorna un bool, true si se puede usar un nombre de usuario
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
  var respuesta = await cliente.query("SELECT * FROM usuarios WHERE nombreusuario='" + req.body.nombreusuario + "'");
  if (respuesta.rows.length == 0) {
    res.json(true);
  } else {
    res.json(false);
  }
  await cliente.end();
});
//retorna el perfil del usuario agregado
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
  var codigo = await cliente.query("select count(*) from usuarios");
  codigo = parseInt(codigo.rows[0].count)+1;
  codigo = codigo+"-000000".replace(/0/g, function () {return (~~(Math.random() * 16)).toString(16);});
  if(req.body.cargo){
    codigo = "SUP-"+codigo;
  }else{
    codigo = "OPE-"+codigo;
  }
  var respuesta = await cliente
    .query("INSERT INTO usuarios (codigoempleado,nombre,apellido,nombreusuario,cargo,clave,clavetemporal,intentos)" +
      " VALUES ('" + codigo + "', '" + req.body.nombre + "', '" + req.body.apellido + "', '" + req.body.nombreusuario + "', " + req.body.cargo + ", '" + clave + "', true, 0) RETURNING *;");
  res.json(respuesta.rows);
  await cliente.end();
});
//retorna el nuevo estado del usuario
router.put('/Editar', async function (req, res) {
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
  var respuesta = await cliente.query("UPDATE usuarios SET nombre='" + req.body.nombre + "', apellido='" + req.body.apellido + "', cargo=" + req.body.cargo + ", clave='"+clave+"', clavetemporal=" + req.body.clavetemporal + ", intentos=" + req.body.intentos + " WHERE codigoempleado='" + req.body.codigoempleado + "' RETURNING *");
  if (respuesta.rows.length == 1) {
    res.json(respuesta.rows);
  } else {
    res.json(false);
  }
  await cliente.end();
});
//retorna true si se elimino el usuario
router.delete('/Eliminar', async function (req, res) {
  var cliente = new Client({
    user: "osdmeqpylslznh",
    password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
    database: "d4u0fuis94bmbi",
    port: 5432,
    host: "ec2-54-83-36-37.compute-1.amazonaws.com",
    ssl: true
  });
  await cliente.connect();
  var respuesta = await cliente.query("delete from usuarios where codigoempleado='"+req.body.codigoempleado+"' RETURNING *");
  if (respuesta.rowCount == 1) {
    res.json(true);
  } else {
    res.json(false);
  }
  await cliente.end();
});

module.exports = router;