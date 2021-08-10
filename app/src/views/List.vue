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
    <v-card flat class="overflow-y-scroll pa-0 text-center">
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <div class="ma-3" v-for="food in foods" :key="food.id">
              <v-btn
                x-large
                block
                rounded
                color="white"
                @click="dialog = food.id"
                class="px-0"
              >
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="food.icon"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="text-left">
                    <v-list-item-title>{{ food.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      food.place
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content class="text-right">
                    <v-list-item-title
                      >あと{{ food.limit }}日</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-btn>
            </div>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-list rounded>
              <v-list-item two-line class="justify-space-around">
                <!-- <v-btn> -->
                <v-list-item-content>
                  <v-list-item-title> 生鮮 </v-list-item-title>
                  <v-list-item-subtitle>aaa</v-list-item-subtitle>
                </v-list-item-content>
                <!-- </v-btn> -->
              </v-list-item>
            </v-list>
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
    </v-card>
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
    foods: [
      {
        id: 1,
        name: "aaaaa",
        place: "冷蔵庫",
        limit: 10,
        icon: require("../assets/logo.png"),
      },
      {
        id: 2,
        name: "bbbbb",
        place: "冷蔵庫",
        limit: 10,
        icon: require("../assets/logo.png"),
      },
      {
        id: 3,
        name: "cccccc",
        place: "冷蔵庫",
        limit: 10,
        icon: require("../assets/logo.png"),
      },
    ],
  }),
});
</script>
