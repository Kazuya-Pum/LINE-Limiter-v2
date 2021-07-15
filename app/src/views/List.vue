<template>
  <v-container fluid class="pa-0">
    <food-details :dialog="dialog" @close="dialog = false" />
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
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat class="overflow-y-auto">
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
          <v-card-text class="flex-column">
            <v-btn @click="dialog = true">Open Dialog</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn>生鮮</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn>調味料</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn>保存食</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-btn>その他</v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FoodDetails from "../components/FoodDetails.vue";

export default Vue.extend({
  name: "List",
  components: {
    FoodDetails,
  },
  data: () => ({
    tab: 0,
    dialog: false,
  }),
});
</script>
