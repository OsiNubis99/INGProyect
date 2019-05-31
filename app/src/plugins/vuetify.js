import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  theme: {
    primary: '#2969B0',
    secondary: '#F99E1D',
    accent: '#FAC51C',
    error: '#FD0B0B',
    info: '#5BC0E6',
    success: '#AAA9A9',
    warning: '#F7DA64'
  },
  options: {
    customProperties: true
  },
  iconfont: ['fa','md'],
})