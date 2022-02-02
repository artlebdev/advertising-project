import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import firebase from 'firebase/compat/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.component('app-buy-modal', BuyModalComponent)
const opts = { }

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify(opts),
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBTtg_0N_aja0yNo0j9u0k0pP-Nuqw5G_k',
      authDomain: 'lebedev-ads.firebaseapp.com',
      projectId: 'lebedev-ads',
      storageBucket: 'lebedev-ads.appspot.com',
      messagingSenderId: '520751513550',
      appId: '1:520751513550:web:ca60876d9128daa4af359f'
    })
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })

    this.$store.dispatch('fetchAds')
  }
})
