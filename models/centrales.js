const {
	Pool
} = require('pg');
var db = new Pool(require('../config/heroku'));
var error = {
	error: "Error del servidor"
}

module.exports = {
	async listar(res) {
		await db.query("SELECT nombrecentral,tipocentral,idcentral FROM centrales order by nombrecentral")
			.then((datos) => {
				res.json(datos.rows)
			}).catch(() => {
				res.json(error);
			});
	},
	async agregar(datos, res, bcrypt) {
		await db.query("select count(idcentral) from centrales")
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
				await db.query("INSERT INTO centrales (idcentral,nombrecentral,tipocentral)" +
						" VALUES ('" + codigo + "', '" + datos.nombrecentral + "', '" + datos.tipocentral + "', true, 0);")
					.then(() => {
						res.json(datos.clave);
					});
			}).catch(() => {
				res.json(error);
			});
	},
	async editar(datos,res,bcrypt){
		var query = "UPDATE centrales SET nombrecentral='" + datos.nombrecentral + "', tipocentral='" +datos.tipocentral+"'"
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
    
}