var router = require('express').Router();
var bcrypt = require('bcryptjs');
var usuarios = require('../models/usuarios');

router.get('/Listar',(req, res) => {
  usuarios.listar(res);
});

router.post('/Iniciar',(req, res) => {
  usuarios.iniciar(req.body, res, bcrypt);
});

router.post('/Validar', async (req, res) => {
  usuarios.validar(req.body,res)
});

router.post('/Agregar', async (req, res) => {
  req.body.clave = "*01010101$".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16).toUpperCase();
  }).replace(/1/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
  usuarios.agregar(req.body, res, bcrypt);
});

router.post('/Desbloquear', async (req, res) => {
  req.body.clave = "*01010101$".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16).toUpperCase();
  }).replace(/1/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
  usuarios.desbloquear(req.body, res);
});

router.post('/Editar', async (req, res) => {
  usuarios.editar(req.body, res, bcrypt);
});

router.post('/Eliminar', async (req, res) => {
  usuarios.eliminar(req.body, res);
});

module.exports = router;