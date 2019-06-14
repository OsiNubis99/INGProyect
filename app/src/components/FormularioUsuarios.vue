<template>
	<v-layout row justify-center>
		<v-dialog v-model="$store.state.crearEditar" :persistent="formulario.estado == 'Clave'" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">{{formulario.titulo}}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout v-if="formulario.estado == 'Crear'" wrap justify-center>
							<v-flex xs12 sm6>
								<v-text-field label="Nombre" v-model="formulario.nombre" />
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field label="Apellido" v-model="formulario.apellido" />
							</v-flex>
							<v-flex xs12>
								<v-text-field label="Nombre de Usuario" v-model="formulario.newnombreusuario"
									hint="Minimo 3 Caracteres - Maximo 12 Caracteres" :loading="valido==null ? true : false"
									@keyup="validar()" :color="valido==false ? 'red' : valido ? 'green' : 'blue'"
									:append-icon="valido==false ? 'fas fa-times-circle' : valido ? 'fas fa-check' : 'fas fa-spinner fa-pulse'" />
							</v-flex>
							<v-flex xs12>
								<v-checkbox :label="formulario.cargo ? 'Cargo: Supervisor' : 'Cargo: Operador'"
									v-model="formulario.cargo" :value="formulario.cargo" />
							</v-flex>
						</v-layout>
						<v-layout v-if="formulario.estado == 'Editar'" wrap justify-center>
							<v-flex xs12 sm6>
								<v-text-field label="Nombre" v-model="formulario.nombre" />
							</v-flex>
							<v-flex xs12 sm6>
								<v-text-field label="Apellido" v-model="formulario.apellido" />
							</v-flex>
							<v-flex xs12>
								<v-text-field label="Nombre de Usuario" v-model="formulario.newnombreusuario"
									hint="Minimo 3 Caracteres - Maximo 12 Caracteres" :loading="valido==null ? true : false"
									@keyup="validar()" :color="formulario.newnombreusuario==formulario.nombreusuario ? 'blue' :valido==false ? 'red' : valido ? 'green' : 'blue'"
									:append-icon="formulario.newnombreusuario==formulario.nombreusuario ? '' :valido==false ? 'fas fa-times-circle' : valido ? 'fas fa-check' : 'fas fa-spinner fa-pulse'" />
							</v-flex>
							<v-flex xs12>
								<v-checkbox label="Editar Clave" v-model="formulario.clavetemporal" :value="formulario.clavetemporal" />
							</v-flex>
							<v-flex v-if="formulario.clavetemporal" xs12 md6>
								<v-text-field label="Clave" :append-icon="value ? 'visibility' : 'visibility_off'"
									@click:append="() => (value = !value)" :type="value ? 'password' : 'text'" v-model="formulario.clave1"
									:color="formulario.clave1=='' ? 'blue' : /^(?=.*\d)(?=.*[\W])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(formulario.clave1) ? 'green' : 'red'"
									hint="Como minimo<br>Un caracter especial(/,*,-,+,#,$,%)<br>Una letra mayuscula<br>Un numero" />
							</v-flex>
							<v-flex v-if="formulario.clavetemporal" xs12 md6>
								<v-text-field label="Confirmar Clave" :append-icon="value ? 'visibility' : 'visibility_off'"
									@click:append="() => (value = !value)" :type="value ? 'password' : 'text'" v-model="formulario.clave2"
									:color="formulario.clave2=='' ? 'blue' : formulario.clave2==formulario.clave1 ? 'green' : 'red' " />
							</v-flex>
						</v-layout>
						<v-layout v-if="formulario.estado == 'Clave'" wrap justify-center>
							<v-flex xs12 md6>
								<v-text-field label="Clave" :append-icon="value ? 'visibility' : 'visibility_off'"
									@click:append="() => (value = !value)" :type="value ? 'password' : 'text'" v-model="formulario.clave1"
									:color="formulario.clave1=='' ? 'blue' : /^(?=.*\d)(?=.*[\W])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(formulario.clave1) ? 'green' : 'red'"
									hint="Como minimo<br>Un caracter especial(/,*,-,+,#,$,%)<br>Una letra mayuscula<br>Un numero" />
							</v-flex>
							<v-flex xs12 md6>
								<v-text-field label="Confirmar Clave" :append-icon="value ? 'visibility' : 'visibility_off'"
									@click:append="() => (value = !value)" :type="value ? 'password' : 'text'" v-model="formulario.clave2"
									:color="formulario.clave2=='' ? 'blue' : formulario.clave2==formulario.clave1 ? 'green' : 'red' " />
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn v-if="formulario.estado != 'Clave'" color="red darken-1" flat
						@click.native="cerrar()">Cancelar</v-btn>
					<v-btn v-if="formulario.estado == 'Crear'" color="blue darken-1" flat 
						@click.native="Agregar()">Agregar</v-btn>
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
				value: true,
				valido: false
			}
		},
		methods: {
			async validar() {
				if (this.formulario.newnombreusuario.length > 3 && this.formulario.newnombreusuario.length < 13) {
					this.valido = null;
					await this.axios.post("http://localhost:3000/REST/Usuarios/Validar", {
							nombreusuario: this.formulario.newnombreusuario
						})
						.then((response) => {
							this.valido = response.data;
						})
						.catch((error) => {
							this.$store.state.error = {
								estado: true,
								tipo: 'error',
								titulo: "Error del Servidor",
								info: error
							}
						});
				} else {
					this.valido = false;
				}

			},
			async Agregar() {
				if (!this.valido) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Nombre de Usuario",
						info: 'El nombre de usuario esta en uso o no cumple nuestras politicas'
					}
				} else if (this.formulario.nombre.length == 0 || this.formulario.nombre.length > 50) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Nombre",
						info: this.formulario.nombre.length == 0 ? 'El nombre es un campo requerido' :
							'En nombre no puede superar los cincuenta(50) caracteres'
					}
				} else if (this.formulario.apellido.length == 0 || this.formulario.apellido.length > 50) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Apellido",
						info: this.formulario.apellido.length == 0 ? 'El apellido es un campo requerido' :
							'En apellido no puede superar los cincuenta(50) caracteres'
					}
				} else {
					this.valido = false;
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'bien',
                        titulo: "Cargando...",
                        info: "Esto puede tomar unos minutos"
                    }
					await this.axios.post("http://localhost3000http://localhost:3000/REST/Usuarios/Agregar",{
						nombre: this.formulario.nombre,
						apellido: this.formulario.apellido,
						cargo: this.formulario.cargo,
						nombreusuario: this.formulario.newnombreusuario
					})
						.then((response) => {
							if (response) {
								this.$store.state.error = {
									estado: true,
									tipo: 'bien',
									titulo: "Usuario Agregado",
									info: 'La Clave Temporal es: ' + response.data
								}
								this.cerrar();
							} else {
								this.$store.state.error = {
									estado: true,
									tipo: 'error',
									titulo: "Error Al Desbloquear",
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
				if (!this.valido && this.formulario.newnombreusuario!=this.formulario.nombreusuario) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Nombre de Usuario",
						info: 'El nombre de usuario esta en uso o no cumple nuestras politicas'
					}
				} else if (this.formulario.clave1 == '' && this.formulario.clavetemporal) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Clave",
						info: "La clave es un valor obligatorio"
					}
				} else if (this.formulario.clave1 != this.formulario.clave2 && this.formulario.clavetemporal) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Claves Diferentes",
						info: 'Las claves introducidas no son iguales'
					}
				} else if (!/^(?=.*\d)(?=.*[\W])(?=.*[A-Z])(?=.*[a-z])\S{8,}$/.test(this.formulario.clave1) && this.formulario.clavetemporal) {
					this.$store.state.error = {
						estado: true,
						tipo: 'error',
						titulo: "Claves Invalidas",
						info: 'Las claves no cumplen con nuestras politicas'
					}
				} else {
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'bien',
                        titulo: "Cargando...",
                        info: "Esto puede tomar unos minutos"
                    }
					await this.axios.post("http://localhost:3000/REST/Usuarios/Editar", {
							nombreusuario: this.formulario.newnombreusuario,
							nombre: this.formulario.nombre,
							apellido: this.formulario.apellido,
							clave: this.formulario.clave1,
							codigoempleado: this.formulario.codigoempleado,
							clavetemporal: this.formulario.clavetemporal
						})
						.then(() => {
							if(this.formulario.codigoempleado == this.$store.state.perfil.codigoempleado){
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
				}
			},
			cerrar(){
				this.$store.state.crearEditar = false;
			}
		},
		computed: {
			...mapState(['formulario'])
		}
	}
</script>

<style>

</style>