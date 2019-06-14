const {
	Pool
} = require('pg');
var db = new Pool(require('../config/bd'));
var bitacora = require('../models/bitacora');
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
						bitacora.agregar({
							fecha:new Date().toLocaleString(),
							codigoempleado: datos.codigoempleado,
							descripcion: 'Agrego un nodo bajo el nombre: '+datos.nombrecentrales
						},res)
					}).catch((err) => {
						console.log(''+ err)
				res.json(error);
			});
	},
	async editar(datos,res){
		var query = "UPDATE centrales SET nombrecentrales='" + datos.nombrecentrales + "', tipo=" +datos.tipo + ", ciudad='"+ datos.ciudad +"' WHERE id='" + datos.id + "' RETURNING *"
		await db.query(query)
			.then((respuesta) => {
				if (respuesta.rowCount == 1) {
					bitacora.agregar({
						fecha:new Date().toLocaleString(),
						codigoempleado: datos.codigoempleado,
						descripcion: 'Edito el nodo: '+datos.id+', Nombre: '+datos.nombrecentrales+', Tipo: '+datos.tipo+', Ciudad: '+datos.ciudad
					},res)
				} else {
					res.json(false);
				}
			}).catch(() => {
				res.json(error);
			});
    },
    
}