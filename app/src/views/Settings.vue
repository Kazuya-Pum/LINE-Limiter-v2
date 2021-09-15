<template>
  <v-container fluid>
    <v-list>
      <v-list-item>
        <v-list-item-title>通知時間</v-list-item-title>
        <v-list-item-action>
          <v-text-field v-model="notice" type="number"></v-text-field>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";

export default Vue.extend({
  methods: {
    ...mapActions(["setNotice"]),
  },
  computed: {
    notice: {
      get() {
        return this.$store.getters.notice;
      },
      set(value) {
        this.setNotice(Number(value));
      },
    },
  },
});
</script>
