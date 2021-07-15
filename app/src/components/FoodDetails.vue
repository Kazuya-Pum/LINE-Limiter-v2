<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark style="background-color: #46465a">
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>詳細</v-toolbar-title>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FoodDetails",
  props: {
    dialog: { type: Boolean, default: false },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
});
</script>
