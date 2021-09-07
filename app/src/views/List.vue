<template>
  <v-container fluid class="pa-0">
    <v-dialog
      v-model="dialog"
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <food-details @close="dialog = false" />
    </v-dialog>
    <v-toolbar dark style="background-color: #46465a">
      <v-text-field
        prepend-icon="mdi-magnify"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>
    <v-tabs icons-and-text grow show-arrows center-active v-model="tab">
      <v-tab>すべて</v-tab>
      <v-tab>生鮮</v-tab>
      <v-tab>調味料</v-tab>
      <v-tab>保存食</v-tab>
      <v-tab>その他</v-tab>
    </v-tabs>
    <v-card flat class="overflow-y-auto pa-0 text-center">
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <food-list :foods="foods" @click="dialog = $event"></food-list>
        </v-tab-item>
        <v-tab-item>
          <food-list :foods="foods" @click="dialog = $event"></food-list>
        </v-tab-item>
        <v-tab-item>
          <food-list :foods="foods" @click="dialog = $event"></food-list>
        </v-tab-item>
        <v-tab-item>
          <food-list :foods="foods" @click="dialog = $event"></food-list>
        </v-tab-item>
        <v-tab-item>
          <food-list :foods="foods" @click="dialog = $event"></food-list>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import FoodDetails from "../components/FoodDetails.vue";
import FoodList from "../components/FoodList.vue";

export default Vue.extend({
  name: "List",
  components: {
    FoodDetails,
    FoodList,
  },
  data: () => ({
    tab: 0,
    dialog: false,
  }),
  computed: {
    ...mapGetters(["foods"]),
  },
});
</script>
