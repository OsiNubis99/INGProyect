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
  centrales.agregar(req.body, res);
});
router.post('/Editar', async (req, res) => {
centrales.editar(req.body, res);
});

module.exports = router;
