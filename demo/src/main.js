import Vue from 'vue'
import VueSmartBus from 'vue-smart-bus'
import App from './App.vue'

Vue.use(VueSmartBus)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
