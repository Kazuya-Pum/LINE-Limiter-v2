<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-bottom-navigation app grow color="primary">
      <v-btn to="add" style="background-color: transparent; height: inherit">
        <span>追加</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn to="list" style="background-color: transparent; height: inherit">
        <span>一覧</span>
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn
        to="history"
        style="background-color: transparent; height: inherit"
      >
        <span>履歴</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn
        to="settings"
        style="background-color: transparent; height: inherit"
      >
        <span>設定</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import liff from "@line/liff";

interface Data {
  userName: string;
  user: firebase.User | null;
}

export default Vue.extend({
  name: "App",

  data(): Data {
    return {
      userName: "",
      user: null,
    };
  },
  methods: {
    ...mapActions(["bindFoods", "init"]),
  },
  async created() {
    await liff.init({ liffId: process.env.VUE_APP_LIFF_ID }).catch((err) => {
      console.log(err);
    });
    if (!liff.isLoggedIn()) {
      liff.login();
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
      } else {
        const accessToken = liff.getAccessToken();
        // LINEのIDトークンをfirebase functionsに投げて，firebaseのカスタム認証用トークンを取得
        const login = firebase.functions().httpsCallable("login");
        const result = await login({ accessToken });
        if (result.data.error) {
          console.error(result.data.error);
        } else {
          // firebaseの認証用トークンを利用してカスタム認証
          const res = await firebase
            .auth()
            .signInWithCustomToken(result.data.token);
          this.user = res.user;
        }
      }
    });
  },
  mounted() {
    if (this.user) {
      this.bindFoods(this.user.uid);
    }
  },
});
</script>

<style>
.firebase-emulator-warning {
  display: none;
}
</style>
