const {
	Pool
} = require('pg');
var db = new Pool(require('../config/heroku'));
var error = {
	error: "Error del servidor"
}

module.exports = {
	async listar(res) {
		await db.query("SELECT codigoempleado,nombre,apellido,nombreusuario,clavetemporal,intentos FROM usuarios order by nombre")
			.then((datos) => {
				res.json(datos.rows)
			}).catch(() => {
				res.json(error);
			});
	},
	async iniciar(datos, res, bcrypt) {
		await db.query("SELECT * FROM usuarios WHERE nombreusuario='" + datos.nombreusuario + "'")
			.then(async (respuesta) => {
				if (respuesta.rowCount == 1) {
					var intentos = respuesta.rows[0].intentos;
					if (intentos < 3) {
						if (bcrypt.compareSync(datos.clave, respuesta.rows[0].clave)) {
							res.json(respuesta.rows[0]);
						} else {
							intentos++;
							await db.query("UPDATE usuarios SET intentos=" + intentos + " WHERE nombreusuario='" + datos.nombreusuario + "'");
							if (intentos < 3) {
								res.json({
									error: "Clave o Usuario"
								});
							} else {
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
			}).catch(() => {
				res.json(error);
			});
	},
	async validar(datos, res) {
		await db.query("SELECT nombreusuario FROM usuarios WHERE UPPER(nombreusuario) = UPPER('" + datos.nombreusuario + "')")
			.then((respuesta) => {
				if (respuesta.rowCount == 0) {
					res.json(true);
				} else {
					res.json(false);
				}
			}).catch(() => {
				res.json(error);
			});
	},
	async agregar(datos, res, bcrypt) {
		await db.query("select count(codigoempleado) from usuarios")
			.then(async (respuesta) => {
				var codigo = parseInt(respuesta.rows[0].count )+ 1;
				codigo = codigo + "-000000".replace(/0/g, () => {
					return (~~(Math.random() * 16)).toString(16);
				});
				if (datos.cargo) {
					codigo = "SUP-" + codigo;
				} else {
					codigo = "OPE-" + codigo;
				}
				await db.query("INSERT INTO usuarios (codigoempleado,nombre,apellido,nombreusuario,cargo,clave,clavetemporal,intentos)" +
						" VALUES ('" + codigo + "', '" + datos.nombre + "', '" + datos.apellido + "', '" + datos.nombreusuario + "', " +
						datos.cargo + ", '" + bcrypt.hashSync(datos.clave, 10) + "', true, 0);")
					.then(() => {
						res.json(datos.clave);
					});
			}).catch(() => {
				res.json(error);
			});
	},
	async desbloquear(datos,res){
		await db.query("UPDATE usuarios SET clave='" + bcrypt.hashSync(datos.clave, 10) + "', clavetemporal=true , intentos=0 WHERE codigoempleado='" + datos.codigoempleado + "' RETURNING *")
    .then((respuesta) => {
      if (respuesta.rowCount == 1) {
        res.json(clave);
      } else {
        res.json(false);
      }
    }).catch(() => {
      res.json(error);
    });
	},
	async editar(datos,res,bcrypt){
		var query = "UPDATE usuarios SET nombre='" + datos.nombre + "', apellido='" +datos.apellido+"', nombreusuario='"+datos.nombreusuario+"'"
		if(datos.clavetemporal){
			query+=", clave='"+bcrypt.hashSync(datos.clave, 10)+"', clavetemporal=false"
		} 
		query+=" WHERE codigoempleado='" + datos.codigoempleado + "' RETURNING *"
		await db.query(query)
			.then((respuesta) => {
				if (respuesta.rowCount == 1) {
					res.json(true);
				} else {
					res.json(false);
				}
			}).catch(() => {
				res.json(error);
			});
	},
	async eliminar(datos,res){
		await db.query("UPDATE usuarios SET  intentos=4 WHERE codigoempleado='" + datos.codigoempleado + "' RETURNING *")
    .then((respuesta) => {
      if (respuesta.rowCount == 1) {
        res.json(true);
      } else {
        res.json(false);
      }
    }).catch(() => {
      res.json(error);
    });
	}
}