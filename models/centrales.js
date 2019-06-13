const {
	Pool
} = require('pg');
var db = new Pool(require('../config/bd'));
var error = {
	error: "Error del servidor"
}

module.exports = {
	async listar(res) {
		await db.query("SELECT * FROM centrales order by nombrecentrales")
			.then((datos) => {
				res.json(datos.rows)
			}).catch(() => {
				res.json(error);
			});
	},
	async agregar(datos, res) {
		await db.query("INSERT INTO centrales (nombrecentrales,tipo,ciudad)" +
						" VALUES ('" + datos.nombrecentrales+ "', " + datos.tipo + ",'" + datos.ciudad + "' );")
					.then(() => {
						res.json('Guardado exitoso');
					}).catch(() => {
				res.json(error);
			});
	},
	async editar(datos,res){
		var query = "UPDATE centrales SET nombrecentrales='" + datos.nombrecentrales + "', tipo=" +datos.tipo + ", ciudad='"+ datos.ciudad +"' WHERE id='" + datos.id + "' RETURNING *"
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
    
}