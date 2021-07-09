<template>
  <v-app>
    <v-app-bar
      flat
      app
      color="blue-grey darken-2"
      v-if="activeBar >= 1 && activeBar <= 2"
    ></v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-bottom-navigation app grow color="green accent-3" v-model="activeBar">
      <v-btn to="add">
        <span>追加</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn to="list">
        <span>一覧</span>
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn to="history">
        <span>履歴</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn to="settings">
        <span>設定</span>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    activeBar: null,
  }),
});
</script>
