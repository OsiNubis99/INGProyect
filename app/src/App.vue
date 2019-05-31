<script>
  import Header from './components/Header';
  import {
    mapMutations,
    mapState
  } from 'vuex';
  export default {
    created() {
      if (this.perfil == null && window.location.pathname != "/Iniciar") {
        this.$router.push('/Iniciar')
      }
      this.onResize()
    },
    updated(){
      this.onResize()
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['error', 'perfil'])
    },
    methods: {
      ...mapMutations(['onResize']),
    },
    components: {
      Header
    }
  }
</script>

<template>
  <v-app id="app">
    <Header />
    <v-content class="grey lighten-1">
      <v-snackbar auto-height v-model="error.estado" right :timeout="300000" class="black--text" top
        :color="error.tipo == 'alerta'? 'orange lighten-1': error.tipo == 'error' ? 'red lighten-1': 'green lighten-1'">
        {{ error.titulo }} <br>
        {{ error.info }}
        <v-btn color="black" flat @click="error.estado = false">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-snackbar>
      <router-view />
    </v-content>
    <v-footer dark height="auto" app>
      <v-card class="flex" flat tile>
        <v-card-actions class="grey darken-3 justify-center">
          &copy;2019 — HidroTeam
        </v-card-actions>
      </v-card>
    </v-footer>
  </v-app>
</template>