<script>
  import {
    mapState
  } from 'vuex';
  import FormularioUsuarios from "../components/FormularioUsuarios.vue";
  import Historico from '../components/Historico.vue';
  import Usuario from '../components/Usuario.vue';
  import Grafo from "../components/Grafo.vue";
  export default {
    created() {
      if (this.perfil.clavetemporal) {
        this.$store.state.formulario = {
          nombre: this.perfil.nombre,
          apellido: this.perfil.apellido,
          codigoempleado: this.perfil.codigoempleado,
          newnombreusuario: this.perfil.nombreusuario,
          nombreusuario: this.perfil.nombreusuario,
          clavetemporal: this.perfil.clavetemporal,
          clave1: '',
          clave2: '',
          estado: 'Clave',
          titulo: 'Cambie su Clave Temporal'
        }
        this.$store.state.crearEditar = true;
      }
    },
    data() {
      return {
        vista: ""
      }
    },
    computed: {
      ...mapState(['perfil', 'movil'])
    },
    components: {
      FormularioUsuarios,
      Historico,
      Usuario,
      Grafo
    }
  }
</script>

<template>
  <v-container>
    <v-navigation-drawer :temporary='movil' clipped app v-model="$store.state.navegacion">
      <v-container fill-height>
        <v-layout column fill-height align-center>
          <v-avatar color="red red--after">
            <v-icon dark>fas fa-user</v-icon>
          </v-avatar>
          <span class="d-block mt-2 mb-1">{{perfil.nombreusuario}}</span>
          <span class="d-block">{{perfil.nombre+" "+perfil.apellido}}</span>
          <span class="d-block my-1">{{perfil.cargo ? "Supervisor" : "Operador"}}</span>
          <v-btn class="mb-3 pa-2" block :color="perfil.cargo?'green lighten-1 ':'primary lighten-1'" @click="()=>{
              this.$store.state.formulario = {
                nombre : this.perfil.nombre,
                apellido : this.perfil.apellido,
                codigoempleado : this.perfil.codigoempleado,
                newnombreusuario : this.perfil.nombreusuario,
                nombreusuario : this.perfil.nombreusuario,
                clavetemporal : this.perfil.clavetemporal,
                clave1 : '',
                clave2 : '',
                estado:'Editar',
                titulo:'Editar perfil'
              }          
              this.$store.state.crearEditar = true;
            }">
            Edita tu perfil
          </v-btn>
          <v-divider dark></v-divider>
          <v-layout class="mt-3" fill-height wrap column>
            <v-flex v-if="!perfil.cargo" xs2 @click="vista = 'Grafo'">
              <v-btn block flat>Administrar Grafo</v-btn>
            </v-flex>
            <v-flex v-if="perfil.cargo" xs2 @click="vista = 'Usuario'">
              <v-btn block flat>administrar Usuarios</v-btn>
            </v-flex>
            <v-flex v-if="perfil.cargo" xs2 @click="vista = 'Historico'">
              <v-btn block flat>Ver Historico del Grafo</v-btn>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <Grafo class="ma-3" v-if="vista == 'Grafo'" />
    <Usuario class="ma-3" v-else-if="vista == 'Usuario'" />
    <Historico class="ma-3" v-else-if="vista == 'Historico'" />
    <v-card v-else class="text-xs-center ma-3">
      <v-card-text>
        <h1>Bienvenido {{perfil.nombre}}</h1>
      </v-card-text>
    </v-card>
    <FormularioUsuarios />
  </v-container>
</template>

<style>

</style>