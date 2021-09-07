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
import Vue, { PropType } from "vue";

interface Food {
  id: number;
  name: string;
  place: string;
  limit: number;
}

export default Vue.extend({
  name: "FoodList",
  props: {
    foods: [] as PropType<Food[]>,
  },
  data: () => ({}),
  methods: {
    click(id: number) {
      this.$emit("click", id);
    },
  },
});
</script>
