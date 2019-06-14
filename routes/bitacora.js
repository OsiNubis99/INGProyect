var router = require('express').Router();
var bitacora = require('../models/bitacora');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/Listar',(req, res) => {
  bitacora.listar(res);
});

router.post('/Agregar',(req, res) => {
  req.body.fecha = new Date().toLocaleString();
  bitacora.agregar(req.body, res);
});

module.exports = router;