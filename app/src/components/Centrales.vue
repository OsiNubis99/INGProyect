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
                await this.axios.get("/REST/Centrales/Listar")
                    .then((response) => {
                        return response.data
                    })
                    .then((data) => {
                        this.centrales = data
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
                centrales: []
            }
        },
    }
</script>

<template>
    <v-card>
        <v-card-title>
            <v-btn dark round color="blue" @click="()=>{ 
                $store.state.formulario = {
                    nombrecentrales:'',
                    tipo:{nombre:'',id:0},
                    ciudad:'',
                    estado:'Crear',
                    titulo:'Agrega una nueva Central'
                    };  
                $store.state.crearCentrales = true; 
                }">
                <v-icon dark left>fas fa-plus</v-icon>
                Agrega una Central
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-flex class="tabla text-xs-center">
                <h1 v-if="centrales.length == 0">
                    <v-icon class="blue--text">fas fa-spinner fa-pulse</v-icon>
                </h1>
                <table v-else>
                    <thead>
                        <td class="blue lighten-3">ID de la Central</td>
                        <td class="blue lighten-2">Nombre de la Central</td>
                        <td class="blue lighten-3">Ciudad</td>
                        <td class="blue lighten-2">Tipo de Central</td>
                        <td class="blue lighten-3">Acciones</td>
                    </thead>
                    <tr v-for="(item, index) in centrales" :key="index">
                        <td :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">{{item.id}}</td>
                        <td :class="index%2 == 0 ? 'lighten-3': 'lighten-2'" class="grey">{{item.nombrecentrales}}</td>
                        <td :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">{{item.ciudad}}</td>
                        <td :class="index%2 == 0 ? 'lighten-3': 'lighten-2'" class="grey">
                            {{item.tipo==1 ? 'Central de Generacion' :item.tipo==2 ? 'Central Termoelectrica': item.tipo==3 ? 'Central de Distribucion' :  ''}}
                        </td>
                        <td :class="index%2 == 0 ? 'lighten-2': 'lighten-3'" class="grey">
                            <v-btn flat icon color="primary" @click="()=>{ 
                                $store.state.formulario = {
                                    nombrecentrales : item.nombrecentrales,
                                    tipo : {nombre:'',id:item.tipo},
                                    ciudad : item.ciudad,
                                    id : item.id,
                                    estado:'Editar',
                                    titulo:'Editar central'
                                    };  
                                $store.state.crearCentrales = true; 
                                }">
                                <v-icon>fas fa-edit</v-icon>
                            </v-btn>
                        </td>
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

    .tabla {
        position: relative;
        overflow: auto;
        padding-bottom: .75rem
    }

    td {
        padding: 1rem;
        margin: auto
    }
</style>