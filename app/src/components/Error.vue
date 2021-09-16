<template>
  <v-card>
    <v-card-title class="text-h5"> エラー </v-card-title>

    <v-card-text>
      {{ message }}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="click()"> OK </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    message: {
      type: String,
      default: "エラーページ",
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click() {
      this.$emit("close");
    },
  },
});
</script>
