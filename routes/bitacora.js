var router = require('express').Router();
var bitacora = require('../models/bitacora');

router.get('/Listar',(req, res) => {
  bitacora.listar(res);
});

router.post('/Agregar',(req, res) => {
  req.body.fecha = new Date().toLocaleString();
  bitacora.agregar(req.body, res);
});

module.exports = router;