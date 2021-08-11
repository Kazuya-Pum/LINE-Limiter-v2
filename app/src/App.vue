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
import liff from "@line/liff";

export default Vue.extend({
  name: "App",

  data: () => ({
    userName: "",
  }),
  async created() {
    await liff.init({ liffId: process.env.VUE_APP_LIFF_ID }).catch((err) => {
      console.log(err);
    });

    if (!liff.isLoggedIn()) {
      liff.login();
    }

    liff
      .getProfile()
      .then((profile) => {
        this.userName = profile.displayName;
        console.log(this.userName);
      })
      .catch((err) => {
        console.error(err);
      });
  },
});
</script>
