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
		mounted() {
			this.pintarGrafo()
		},
		updated() {
			this.pintarGrafo()
		},
		data() {
			return {}
		},
		computed: {
			pintarGrafo(){{
			var nodes = [{
					id: 1,
					label: 'Node 1'
				},
				{
					id: 2,
					label: 'Node 2'
				},
				{
					id: 3,
					label: 'Node 3'
				},
				{
					id: 4,
					label: 'Node 4'
				},
				{
					id: 5,
					label: 'Node 5'
				}
			];
			var edges = [{
					from: 1,
					to: 5,
					label:'20KW'
				},
				{
					from: 2,
					to: 5,
					label:'10KW'
				},
				{
					from: 3,
					to: 5,
					label:'50KW'
				},
				{
					from: 4,
					to: 5,
					label:'60KW'
				}
			];
			var container = document.getElementById('visualization');
			var data = {
				nodes: nodes,
				edges: edges
			};
			var network = new vis.Network(container, data, {height: '350px'});
		}}
		},
	}
</script>
