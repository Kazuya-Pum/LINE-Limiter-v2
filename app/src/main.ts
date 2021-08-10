import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyApVTxcMN32inU6jLawg0iXUG5TKtQDQP0",
  authDomain: "kazuya-pum.firebaseapp.com",
  projectId: "kazuya-pum",
  storageBucket: "kazuya-pum.appspot.com",
  messagingSenderId: "968408286992",
  appId: "1:968408286992:web:291e5d339cb7adc1cec795",
  measurementId: "G-35R9HJ1L3Z",
};
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
