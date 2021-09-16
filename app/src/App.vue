<template>
  <v-app>
    <v-dialog v-model="dialog" persistent max-width="290">
      <error :message="errmsg" @close="errorClose()"></error>
    </v-dialog>
    <v-main>
      <router-view />
    </v-main>
    <v-bottom-navigation app grow color="primary">
      <v-btn to="/add" style="background-color: transparent; height: inherit">
        <span>追加</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn to="/list" style="background-color: transparent; height: inherit">
        <span>一覧</span>
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn
        to="/history"
        style="background-color: transparent; height: inherit"
      >
        <span>履歴</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn
        to="/settings"
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
import { Context } from "@line/liff/dist/lib/store";
import Error from "./components/Error.vue";

const getStorageId = (context: Context) => {
  const type = context.type;
  switch (type) {
    case "group":
      return context.groupId;
    case "room":
      return context.roomId;
    default:
      return context.userId;
  }
};

export default Vue.extend({
  name: "App",

  components: { Error },
  data: (): {
    user: firebase.User | null;
    dialog: boolean;
    errmsg: string;
  } => ({
    user: null,
    dialog: false,
    errmsg: "エラーが発生しました",
  }),
  methods: {
    ...mapActions(["bindFoods", "init"]),
    errorClose() {
      this.dialog = false;
      liff.closeWindow();
    },
  },
  async created() {
    await liff.init({ liffId: process.env.VUE_APP_LIFF_ID }).catch((err) => {
      console.log(err);
    });
    if (!liff.isLoggedIn()) {
      liff.login();
    }

    const context = liff.getContext();

    if (
      context &&
      context.type !== "group" &&
      context.type !== "room" &&
      !(await liff.getFriendship()).friendFlag
    ) {
      this.errmsg = "個人での使用にはBotを友達登録する必要があります";
      this.dialog = true;
      return;
    }

    const storageId = context ? getStorageId(context) : null;

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
      } else {
        const accessToken = liff.getAccessToken();
        // LINEのIDトークンをfirebase functionsに投げて，firebaseのカスタム認証用トークンを取得
        const login = firebase
          .app()
          .functions("asia-northeast1")
          .httpsCallable("login");
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

      if (this.user && storageId) {
        this.$store.commit("setStorageId", storageId);
        await this.bindFoods().catch((err) => {
          console.error(err);
          this.errmsg =
            "データを読み込めません\nグループで利用している場合はグループにBotが参加していない，または利用開始を押していない可能性があります";
          this.dialog = true;
        });
      }
    });
  },
});
</script>

<style>
.firebase-emulator-warning {
  display: none;
}
</style>
