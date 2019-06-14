<script>
	export default {
		created() {
			this.listar();
		},
		methods: {
			async listar() {
				await this.axios.get("/REST/Bitacora/Listar")
					.then((response) => {
						return response.data
					})
					.then((data) => {
						this.bitacora = data
					})
					.catch((error) => {
						this.$store.state.error = {
							estado: true,
							tipo: 'error',
							titulo: "Error del Servidor",
							info: error
						}
					});
			}
		},
		data() {
			return {
				fecha: new Date().toISOString().substr(0, 10),
				bitacora: [],
				menu: false,
				headers: [{
						text: 'Fecha',
						value: 'fecha',
            align: 'center'
					},
					{
						text: 'Codigo del Empleado',
						value: 'codigoempleado',
            align: 'center'
					},
					{
						text: 'Descripcion',
						value: 'descripcion',
            align: 'center'
					}
				],
			}
		}
	}
</script>

<template>
	<v-layout row wrap align-center justify-center>
		<v-card class="text-xs-center" width="100%">
			<v-card-title primary-title>
				<h1>Historico de cambios en el sistema!</h1>
			</v-card-title>
			<v-card-text>
				<v-menu
					v-model="menu"
					:close-on-content-click="false"
					lazy
					transition="scale-transition"
					offset-y
					full-width
					min-width="290px"
				>
					<template v-slot:activator="{ on }">
						<v-text-field
							v-model="fecha"
							label="Escoge una Fecha"
							prepend-icon="event"
							readonly
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker v-model="fecha" color="green lighten-1" @input="menu = false" min="2019-06-01" :max="new Date().toISOString().substr(0, 10)"></v-date-picker>
				</v-menu>
				<v-layout row wrap>
					<v-flex xs12>
						<v-data-table :headers="headers" :items="bitacora" :search="fecha" :rows-per-page-items='[6]'  class="elevation-1">
							<template v-slot:items="props">
								<td class="text-xs-center">{{ new Date(props.item.fecha).toLocaleTimeString() }}</td>
								<td class="text-xs-center">{{ props.item.codigoempleado }}</td>
								<td class="text-xs-center">{{ props.item.descripcion }}</td>
							</template>
						</v-data-table>
					</v-flex>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-layout>
</template>