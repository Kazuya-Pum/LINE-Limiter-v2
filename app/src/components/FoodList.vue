<template>
  <v-card flat>
    <div class="ma-3" v-for="food in foods" :key="food.id">
      <v-btn
        x-large
        block
        rounded
        color="white"
        @click="click(food.id)"
        class="px-0"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              :src="food.img ? food.img : require('../assets/img.png')"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="text-left">
            <v-list-item-title style="text-transform: none">{{
              food.name
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ food.place }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content class="text-right" v-if="enabled">
            <v-list-item-title
              >あと{{ convertDate(food.limit) }}日</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Food from "@/types/food";

export default Vue.extend({
  name: "FoodList",
  props: {
    category: {
      type: String,
      default: "",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    search: {
      type: String,
      default: "",
    },
  },
  methods: {
    click(id: string) {
      this.$emit("click", id);
    },
    convertDate(limit: number) {
      const now = Date.parse(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      );
      return Math.floor((limit - now) / 86400000);
    },
  },
  watch: {
    search(value: string) {
      console.log(value);
    },
  },
  computed: {
    foods(): Food[] {
      if (this.category === "") {
        return this.$store.getters.foods(this.enabled, this.search);
      } else if (this.category === "その他") {
        return this.$store.getters.foodsOtherCategory(
          this.enabled,
          this.search
        );
      } else {
        return this.$store.getters.foodsByCategory(
          this.category,
          this.enabled,
          this.search
        );
      }
    },
  },
});
</script>
