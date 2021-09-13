<template>
  <v-container
    fluid
    style="height: 100%"
    :style="{ background: $vuetify.theme.themes.light.primary }"
  >
    <v-img :src="require('../assets/logo.png')"></v-img>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({}),
});
</script>
