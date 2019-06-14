<template>
	<v-layout row wrap>
		<v-card class="text-xs-center ma-3" width="100%">
			<v-card-title primary-title>
				<h1>Vista del grafo</h1>
			</v-card-title>
			<v-card-text>
				<div id="visualization">Error al Mostrar Grafo</div>
			</v-card-text>
		</v-card>
	</v-layout>
</template>

<script>
	export default {
		data() {
			return {
				nodes: [],
				conexiones: []
			}
		},
		computed: {
			async pintarGrafo() {
				await this.axios.get("/REST/Centrales/Listar")
					.then((response) => {
						var nodos = [];
						response.data.forEach(element => {
							nodos.push({
								label: element.nombrecentrales,
								id: element.id
							})
						});
						return nodos
					})
					.then((response) => {
						var container = document.getElementById('visualization');
						var data = {
							nodes: response,
							edges: this.conexiones
						};
						var network = new vis.Network(container, data, {
							height: '350px'
						});
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
		mounted() {
			this.pintarGrafo();
		}
	}
</script>