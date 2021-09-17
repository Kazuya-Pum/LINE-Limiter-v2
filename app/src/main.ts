import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyApVTxcMN32inU6jLawg0iXUG5TKtQDQP0",
  authDomain: "kazuya-pum.firebaseapp.com",
  projectId: "kazuya-pum",
  storageBucket: "line-limiter",
  messagingSenderId: "968408286992",
  appId: "1:968408286992:web:291e5d339cb7adc1cec795",
  measurementId: "G-35R9HJ1L3Z",
};
firebase.initializeApp(firebaseConfig);

if (process.env.NODE_ENV === "development") {
  firebase.app().functions("asia-northeast1").useEmulator("localhost", 5001);
  firebase.firestore().useEmulator("localhost", 8080);
  firebase.auth().useEmulator("http://localhost:9099");
  firebase.storage().useEmulator("localhost", 9199);
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
