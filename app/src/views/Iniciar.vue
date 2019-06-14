<script>
    import {
        mapState,
        mapMutations
    } from 'vuex';
    export default {
        data() {
            return {
                nombreUsuario: "",
                verClave: true,
                error: {},
                clave: ""
            }
        },
        methods: {
            limpiar() {
                this.nombreUsuario = ""
                this.clave = ""
                this.$store.state.error = {}
            },
            async enviar() {
                this.$store.state.error = [];
                if (this.nombreUsuario.trim() == '') {
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'alerta',
                        titulo: 'Nombre de usuario es un campo obligatorio',
                        info: ''
                    }
                } else if (this.clave.length < 8) {
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'alerta',
                        titulo: 'La clave es un campo obligatorio',
                        info: 'Debe poseer un minimo de 8 caracteres'
                    }
                } else {
                    this.$store.state.error = {
                        estado: true,
                        tipo: 'bien',
                        titulo: "Cargando...",
                        info: "Esto puede tomar unos minutos"
                    }
                    await this.axios.post("http://localhost:3000/REST/Usuarios/Iniciar", {
                            nombreusuario: this.nombreUsuario,
                            clave: this.clave
                        })
                        .then((response) => {
                            return response.data
                        })
                        .then((data) => {
                            if (data.error != null) {
                                var pre = "";
                                var post = "";
                                if (data.error == "Clave o Usuario")
                                    post = " Invalidos."
                                if (data.erro == 'Bloqueado')
                                    pre = "Usuario "
                                this.$store.state.error.tipo= 'error';
                                this.$store.state.error.titulo= pre + data.error + post;
                                this.$store.state.error.info= "Con tres (3) intentos fallidos se bloquea tu cuenta, y solo un supervisor podra desbloquearla";
                            } else {
                                this.$store.state.error.tipo= 'bien';
                                this.$store.state.error.titulo= "Usuario Verificado";
                                this.$store.state.error.info= "";
                                this.$store.state.perfil = data;
                                this.$router.push('/');
                            }
                        })
                        .catch((error) => {
                            this.$store.state.error.tipo= 'error';
                            this.$store.state.error.titulo= "Error del Servidor";
                            this.$store.state.error.info= error
                        });

                }
            }
        },
        computed: {
            ...mapState(['windowS'])
        },
        components: {

        }
    }
</script>

<template>
    <v-container fluid fill-height>
        <v-layout fill-height justify-center align-center row wrap>
            <v-flex sm12 md8 lg6>
                <v-card class="pa-4 ma-4" width="auto">
                    <v-card-title primary-title class="headline">
                        Inicia Sesion
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="nombreUsuario" @keypress.enter="$document.getElementById(clave).focus()"
                            label="Nombre de Usuario" :color="error.estado ? 'red lighten-1': 'green lighten-1'"
                            autofocus></v-text-field>
                        <v-text-field @keypress.enter="enviar" id="clave" label="Introduce tu Clave"
                            :append-icon="verClave ? 'visibility' : 'visibility_off'"
                            :color="error.estado ? 'red lighten-1': verClave ? 'green lighten-1' : 'orange lighten-1'"
                            @click:append="() => (verClave = !verClave)" :type="verClave ? 'password' : 'text'"
                            v-model="clave"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="clay" @click="limpiar">
                            Limpiar
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="green lighten-1" @click="enviar">
                            Enviar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style>
    .alerta {
        z-index: 100;
        position: fixed;
        top: 70px;
        right: 25px;
    }
</style>