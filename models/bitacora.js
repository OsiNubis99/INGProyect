const {
	Pool
} = require('pg');
var db = new Pool(require('../config/heroku'));
var error = {
	error: "Error del servidor"
}

module.exports = {
	async listar(res) {
		await db.query("SELECT codigoempleado,descripcion,fecha FROM bitacora order by fecha")
			.then((datos) => {
				res.json(datos.rows)
			}).catch(() => {
				res.json(error);
			});
	},
	async agregar(datos, res) {
		await db.query("INSERT INTO bitacora (codigoempleado,descripcion,fecha)" +
				" VALUES ('" + datos.codigoempleado + "', '" + datos.descripcion + "', '" + datos.fecha + "') RETURNING *;")
			.then((respuesta) => {
				res.json(respuesta.rows[0]);
			}).catch((err) => {
				res.json(err+' \n '+datos);
			});
	}
}