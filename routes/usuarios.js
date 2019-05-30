var express = require('express');
var router = express.Router();

var {
  Client
} = require('pg');
var bcrypt = require('bcryptjs');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// const datosdb = {
//   user: "postgres",
//   password: "root",
//   database: "postgres",
//   port: 5432,
//   host: "localhost",
//   ssl: true
// }
const datosdb =  {
  user: "osdmeqpylslznh",
  password: "451994ddda6585739cb45de567d5901b5ff7c9b5a80e3acc8e5066792af2ecea",
  database: "d4u0fuis94bmbi",
  port: 5432,
  host: "ec2-54-83-36-37.compute-1.amazonaws.com",
  ssl: true
}


//Lista todos los usuarios del sistema
router.get('/Listar', async (req, res) => {
  var cliente = new Client(datosdb);
  await cliente.connect();
  await cliente.query("SELECT * FROM usuarios order by nombre")
    .then((datos) => {
      res.json(datos.rows)
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna un objeto, usuario si es todo ok, o {error: "Tipo de error"}
router.post('/Iniciar', async (req, res) => {
  var cliente = new Client(datosdb);
  await cliente.connect();
  await cliente.query("SELECT * FROM usuarios WHERE nombreusuario='" + req.body.nombreusuario + "'")
    .then(async (respuesta) => {
      if (respuesta.rowCount == 1) {
        var intentos = respuesta.rows[0].intentos;
        if (intentos < 3) {
          if (bcrypt.compareSync(req.body.clave, respuesta.rows[0].clave)) {
            res.json(respuesta.rows[0]);
          } else {
            intentos++;
            await cliente.query("UPDATE usuarios SET intentos=" + intentos + " WHERE nombreusuario='" + req.body.nombreusuario + "'")
              .catch((err) => {
                res.json({
                  error: "Error del servidor: " + err
                });
              });
            if(intentos <3){
              res.json({
                error: "Clave o Usuario"
              });
            }else {
              res.json({
                error: "Bloqueado"
              });  
            }          
          }
        } else {
          res.json({
            error: "Bloqueado"
          });
        }
      } else {
        res.json({
          error: "Clave o Usuario"
        });
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna un bool, true si se puede usar un nombre de usuario
router.post('/Validar', async (req, res) => {
  var cliente = new Client(datosdb);
  await cliente.connect();
  await cliente.query("SELECT * FROM usuarios WHERE UPPER(nombreusuario) = UPPER('" + req.body.nombreusuario + "')")
    .then((respuesta) => {
      if (respuesta.rowCount == 0) {
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna el perfil del usuario agregado
router.post('/Agregar', async (req, res) => {
  var cliente = new Client(datosdb);
  await cliente.connect();
  var clave ="*01010101$".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16).toUpperCase();
  }).replace(/1/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
  var codigo = "";
  await cliente.query("select count(*) from usuarios")
    .then((respuesta) => {
      codigo = parseInt(respuesta.rows[0].count) + 1;
      codigo = codigo + "-000000".replace(/0/g, () => {
        return (~~(Math.random() * 16)).toString(16);
      });
      if (req.body.cargo) {
        codigo = "SUP-" + codigo;
      } else {
        codigo = "OPE-" + codigo;
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.query("INSERT INTO usuarios (codigoempleado,nombre,apellido,nombreusuario,cargo,clave,clavetemporal,intentos)" +
      " VALUES ('" + codigo + "', '" + req.body.nombre + "', '" + req.body.apellido + "', '" + req.body.nombreusuario + "', " +
      req.body.cargo + ", '" + bcrypt.hashSync(clave, 10) + "', true, 0);")
    .then(() => {
      res.json(clave);
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna un bool, true si se puede usar un nombre de usuario
router.post('/Desbloquear', async (req, res) => {
  var cliente = new Client(datosdb);
  var clave ="*01010101$".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16).toUpperCase();
  }).replace(/1/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
  await cliente.connect();
  await cliente.query("UPDATE usuarios SET clave='" + bcrypt.hashSync(clave, 10) + "', clavetemporal=true , intentos=0 WHERE codigoempleado='" + req.body.codigoempleado + "' RETURNING *")
    .then((respuesta) => {
      if (respuesta.rowCount == 1) {
        res.json(clave);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna el nuevo estado del usuario
router.post('/Editar', async (req, res) => {
  var cliente = new Client(datosdb);
  var query = "UPDATE usuarios SET nombre='" + req.body.nombre + "', apellido='" +req.body.apellido+"', nombreusuario='"+req.body.nombreusuario+"'"
  if(req.body.clavetemporal){
    query+=", clave='"+bcrypt.hashSync(req.body.clave, 10)+"', clavetemporal=false"
  } 
  query+=" WHERE codigoempleado='" + req.body.codigoempleado + "' RETURNING *"
  await cliente.connect();
  await cliente.query(query)
    .then((respuesta) => {
      if (respuesta.rowCount == 1) {
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});
//retorna true si se elimino el usuario
router.post('/Eliminar', async (req, res) => {
  var cliente = new Client(datosdb);
  await cliente.connect();
  await cliente.query("UPDATE usuarios SET  intentos=4 WHERE codigoempleado='" + req.body.codigoempleado + "' RETURNING *")
    .then((respuesta) => {
      if (respuesta.rowCount == 1) {
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch((err) => {
      res.json({
        error: "Error del servidor: " + err
      });
    });
  await cliente.end();
});

module.exports = router;