import Vue from 'vue';
import vuex from 'vuex';

Vue.use(vuex);

export default new vuex.Store({
  state: {
    perfil: null,    // Perfil del usuario
    error: {},       // Manejador para Notificaciones
    windowS: {},     // Dimension de la pantalla
    movil: false,    // Controlador de la Vista
    formulario: {},  // Datos para el nuevo usuario
    crearEditar: false,// Controlador del Formulario de Usuario
    navegacion: true // Controlador de la Navegacion
  },
  mutations:{
    onResize(state) {
      state.windowS.x = window.innerWidth;
      state.windowS.y = window.innerHeight;
      if(window.innerWidth < 500){
        state.movil = true;
      }
      if(window.innerWidth > 500){
        state.movil = false;
      }
    }
  }
});