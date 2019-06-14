<template>
	<v-layout row justify-center>
		<v-dialog v-model="$store.state.crearCentrales" :persistent="formulario.estado == 'Clave'" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">{{formulario.titulo}}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout v-if="formulario.estado == 'Crear'" wrap justify-center>
							<v-flex xs12 sm6>
								<v-text-field label="Nombre de la Central" v-model="formulario.nombrecentrales" />
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field label="Ciudad" v-model="formulario.ciudad" />
							</v-flex>
							<v-flex xs12>
								<v-select v-model="formulario.tipo" :items="opciones" item-text="nombre" item-value="id"
									label="Selecciona un tipo" persistent-hint return-object single-line></v-select>
							</v-flex>
						</v-layout>
						<v-layout v-if="formulario.estado == 'Editar'" wrap justify-center>
							<v-flex xs12 sm6>
								<v-text-field label="Nombre de la Central" v-model="formulario.nombrecentrales" />
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field label="Ciudad" v-model="formulario.ciudad" />
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red darken-1" flat @click.native="cerrar()">Cancelar</v-btn>
					<v-btn v-if="formulario.estado == 'Crear'" color="blue darken-1" flat @click.native="Agregar()">Agregar
					</v-btn>
					<v-btn v-else color="blue darken-1" flat @click.native="Editar()">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				opciones: [{
						nombre: 'Central de Generación',
						id: 1
					},
					{
						nombre: 'Central Termoeléctrica',
						id: 2
					},
					{
						nombre: 'Central de Distribución',
						id: 3
					}
				],
				value: true,
				valido: false
			}
		},
		methods: {
			async Agregar() {
				 if (this.formulario.nombrecentrales.length == 0 || this.formulario.nombrecentrales.length > 50) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Nombre de Central",
						info: this.formulario.nombrecentrales.length == 0 ? 'El nombre de la central es un campo requerido' :
							'En nombre de la central no puede superar los cincuenta(50) caracteres'
					}
				} else if (this.formulario.ciudad.length == 0 || this.formulario.ciudad.length > 50) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Ciudad",
						info: this.formulario.ciudad.length == 0 ? 'La ciudad es un campo requerido' :
							'El nombre de la ciudad no puede superar los cincuenta(50) caracteres'
					}
				} else {
					this.$store.state.error = {
						estado: true,
						tipo: 'bien',
						titulo: "Cargando...",
						info: "Esto puede tomar unos minutos"
					}
					await this.axios.post("http://localhost:3000/REST/Centrales/Agregar", {
							nombrecentrales: this.formulario.nombrecentrales,
							ciudad: this.formulario.ciudad,
							tipo: this.formulario.tipo.id
						})
						.then((response) => {
							if (response.data) {
								this.$store.state.error = {
									estado: true,
									tipo: 'bien',
									titulo: "Central Agregada",
									info: ''
								}
								this.cerrar();
							} else {
								this.$store.state.error = {
									estado: true,
									tipo: 'error',
									titulo: "Error Al Agregar",
									info: ''
								}
							}
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
			async Editar() {
				this.$store.state.error = {
					estado: true,
					tipo: 'bien',
					titulo: "Cargando...",
					info: "Esto puede tomar unos minutos"
				}
				await this.axios.post("http://localhost:3000/REST/Centrales/Editar", {
						nombrecentrales: this.formulario.nombrecentrales,
						tipo: this.formulario.tipo.id,
						ciudad: this.formulario.ciudad,
						id: this.formulario.id
					})
					.then(() => {
						if (this.formulario.codigoempleado == this.$store.state.perfil.codigoempleado) {
							this.$store.state.perfil.nombre = this.formulario.nombre;
							this.$store.state.perfil.apellido = this.formulario.apellido;
							this.$store.state.perfil.nombreusuario = this.formulario.nombreusuario;
							this.$store.state.perfil.clavetemporal = false;
						}
						this.$store.state.error = {
							estado: true,
							tipo: 'bien',
							titulo: "Datos Actualizados",
							info: 'Los datos fueron actualizados'
						}
						
						this.cerrar();
					})
					.catch((error) => {
						this.$store.state.error = {
							estado: true,
							tipo: 'error',
							titulo: "Error del Servidor",
							info: error
						}
					});
			},
			cerrar() {
				this.$store.state.crearCentrales = false;
			}
		},
		computed: {
			...mapState(['formulario'])
		}
	}
</script>

<style>

</style>