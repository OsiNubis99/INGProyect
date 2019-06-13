<script>
    export default {
        created() {
            this.listar();
        },
        updated() {
            this.listar();
        },
        methods: {
            async listar() {
                await this.axios.get("/REST/Usuarios/Listar")
                    .then((response) => {
                        return response.data
                    })
                    .then((data) => {
                        this.usuarios = data
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
            async desbloquear(codigo) {
                this.$store.state.error = {
                    estado: true,
                    tipo: 'bien',
                    titulo: "Cargando...",
                    info: "Esto puede tomar unos minutos"
                }
                await this.axios.post("/REST/Usuarios/Desbloquear", {
                        codigoempleado: codigo
                    })
                    .then((data) => {
                        if (data) {
                            this.$store.state.error.tipo= 'bien';
                            this.$store.state.error.titulo= "Usuario Desbloqueado";
                            this.$store.state.error.info= 'La Clave Temporal es: ' + data.data;
                        } else {
                            this.$store.state.error.tipo= 'error';
                            this.$store.state.error.titulo= "Error Al Desbloquear";
                            this.$store.state.error.info= '';
                        }
                    })
                    .catch((error) => {
                        this.$store.state.error.tipo= 'error';
                        this.$store.state.error.titulo= "Error del Servidor";
                        this.$store.state.error.info= error;
                    });
                this.listar();
            },
            async eliminar(codigo) {
                if (confirm("Esta accion es permanente, si eliminas a un usuario no podras volverlo a activar nunca")) {
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'bien',
                        titulo: "Cargando...",
                        info: "Esto puede tomar unos minutos"
                    }
                    await this.axios.post("/REST/Usuarios/Eliminar", {
                            codigoempleado: codigo + ""
                        })
                        .then((data) => {
                            if (data) {
                                this.$store.state.error.tipo= 'success';
                                this.$store.state.error.titulo= "Usuario Eliminado";
                                this.$store.state.error.info= '';
                            } else {
                                this.$store.state.error.tipo= 'error';
                                this.$store.state.error.titulo= "Error Al Eliinar";
                                this.$store.state.error.info= '';
                            }
                        })
                        .catch((error) => {
                            this.$store.state.error.tipo= 'error';
                            this.$store.state.error.titulo= "Error del Servidor";
                            this.$store.state.error.info= error;
                        });
                }
                this.listar();
            }
        },
        data() {
            return {
                usuarios: []
            }
        },
    }
</script>

<template>
    <v-card>
        <v-card-title>
            <v-btn dark round color="green" @click="()=>{ 
                $store.state.formulario = {
                    nombre:'',
                    apellido:'',
                    nombreusuario:'',
                    cargo:false,
                    clave1:'',
                    clave2:'',
                    estado:'Crear',
                    titulo:'Agrega un nuevo Usuario'
                    };  
                $store.state.crearEditar = true; 
                }">
                <v-icon dark left>fas fa-user-plus</v-icon>
                Agrega un Usuario
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-flex class="tabla text-xs-center">
                <h1 v-if="usuarios.length == 0">
                <v-icon class="blue--text">fas fa-spinner fa-pulse</v-icon>
                </h1>
                <table v-else>
                    <thead>
                        <td class="green lighten-2">Nombre de usuario</td>
                        <td class="green lighten-3">Nombre y Apellido</td>
                        <td class="green lighten-2">Cargo</td>
                        <td class="green lighten-3">Codigo de Empleado</td>
                        <td class="green lighten-2">Estado</td>
                        <td class="green lighten-3">Acciones</td>
                    </thead>
                    <tr v-for="(item, index) in usuarios" :key="index">
                        <td :class="index%2 == 0 ? 'lighten-3': 'lighten-2'" class="grey">{{item.nombreusuario}}</td>
                        <td :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">{{item.nombre+' '+item.apellido}}
                        </td>
                        <td :class="index%2 == 0 ? 'lighten-3': 'lighten-2'" class="grey">{{item.cargo ? 'SUP' : 'OPE'}}
                        </td>
                        <td :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">{{item.codigoempleado}}</td>
                        <td :class="item.intentos == 4 ? 'red' : item.intentos == 3 ? 'yellow' : 'blue'" class="lighten-1">
                            {{item.intentos == 4 ? ' Eliminado' : item.intentos == 3 ? 'Bloqueado' : 'Activo'}}
                        </td>
                        <v-layout tag="td" row fill-height :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">
                            <v-btn block flat class="blue--text" v-if="item.intentos < 4" @click="()=>{ 
                                $store.state.formulario = {
                                    nombre : item.nombre,
                                    apellido : item.apellido,
                                    codigoempleado : item.codigoempleado,
                                    newnombreusuario : item.nombreusuario,
                                    nombreusuario : item.nombreusuario,
                                    clavetemporal : item.clavetemporal,
                                    clave1 : '',
                                    clave2 : '',
                                    estado:'Editar',
                                    titulo:'Editar perfil'
                                    };  
                                $store.state.crearEditar = true; 
                                }">
                                <v-icon>fas fa-user-edit</v-icon>
                            </v-btn>
                            <v-btn block flat v-else class="red--text">
                                Usuario Eliminado
                                <v-icon right>fas fa-skull-crossbones</v-icon>
                            </v-btn>
                            <v-btn @click="desbloquear(item.codigoempleado)" v-if="item.intentos == 3" block flat
                                class="green--text">
                                <v-icon>fas fa-lock-open</v-icon>
                            </v-btn>
                            <v-btn @click="eliminar(item.codigoempleado)" block flat class="red--text"
                                v-if="item.intentos != 4 && $store.state.perfil.codigoempleado!=item.codigoempleado">
                                <v-icon>fas fa-user-slash</v-icon>
                            </v-btn>
                        </v-layout>
                    </tr>
                </table>
            </v-flex>
        </v-card-text>
    </v-card>
</template>

<style scoped>
    table,
    thead {
        border-collapse: collapse;
        border: 1px solid black;
        width: 100%;
    }

    .tabla{
        position: relative;
        overflow: auto; 
        padding-bottom: .75rem
    }

    td {
        padding: 1rem;
        margin: auto
    }
</style>