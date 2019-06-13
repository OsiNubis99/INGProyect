var express = require('express');
var router = express.Router();
var centrales = require('../models/centrales')

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET users listing. */
router.get('/Listar', function(req, res, next) {
  centrales.listar(res);
});
router.post('/Agregar', async (req, res) => {
  req.body.clave = "*01010101$".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16).toUpperCase();
  }).replace(/1/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
  centrales.agregar(req.body, res, bcrypt);
});
router.post('/Editar', async (req, res) => {
centrales.editar(req.body, res, bcrypt);
});

module.exports = router;
