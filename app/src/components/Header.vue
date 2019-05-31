<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';
  export default {
    data() {
      return {
        navegation: false,
        menu: false
      }
    },
    methods: {
      ...mapMutations(['onResize'])
    },
    computed: {
      ...mapState(['windowS', 'perfil'])
    },
    components: {

    }
  }
</script>

<template>
    <v-toolbar v-if="perfil != null" v-resize="onResize" :color="perfil.cargo?'green lighten-1 ':'primary lighten-1'" scroll-off-screen clipped-left app>
      <v-container fill-height fluid pa-0 wrap>
        <v-layout align-center justify-center>
          <v-toolbar-side-icon @click="$store.state.navegacion = !$store.state.navegacion"></v-toolbar-side-icon>
          <router-link to="/">
            <v-btn flat>
              Hidro Team
            </v-btn>
          </router-link>
          <v-spacer></v-spacer>
          <v-btn @click="()=>{ $store.state.perfil=null;this.$router.push('/Iniciar')}" icon><v-icon>fas fa-sign-out-alt</v-icon></v-btn>
        </v-layout>
      </v-container>
    </v-toolbar>
</template>

<style>
</style>