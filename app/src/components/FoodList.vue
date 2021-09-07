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
            <v-list-item-title>{{ food.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ food.place }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content class="text-right">
            <v-list-item-title>あと{{ food.limit }}日</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

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
  },
  methods: {
    click(id: string) {
      this.$emit("click", id);
    },
  },
  computed: {
    foods() {
      if (this.category === "") {
        return this.$store.getters.foods(this.enabled);
      } else {
        return this.$store.getters.foodByCategory(this.category, this.enabled);
      }
    },
  },
});
</script>
