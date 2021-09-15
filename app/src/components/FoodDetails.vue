<template>
  <v-card>
    <v-dialog v-model="warn">
      <v-card>
        <v-card-title>{{ food.name }}を削除しますか？</v-card-title>
        <v-card-actions>
          <v-btn text @click="warn = false">キャンセル</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="execDelete()">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar dark tile style="background-color: #46465a">
      <v-btn icon dark @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>詳細</v-toolbar-title>
    </v-toolbar>
    <v-card-text
      class="d-flex flex-column justify-start pa-0"
      style="
        background-position-y: top;
        background-repeat: no-repeat;
        background-size: 100%;
        height: 100%;
      "
      :style="{
        backgroundImage:
          'url(' + (food.img || require('../assets/img.png')) + ')',
      }"
      id="target"
      ref="target"
    >
      <v-card class="rounded-t-xl" style="margin-top: 100vmin; height: 100%">
        <v-card-title>
          <span style="max-width: calc(100% - 36px)">
            {{ food.name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="enabled"
            icon
            class="align-self-baseline"
            @click="edit()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-else icon class="align-self-baseline" @click="warn = true">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-card-title>
        <v-list>
          <v-list-item v-if="enabled">
            <v-list-item-title> 賞味期限 </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              food.date
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> 保存場所 </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              food.place
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> カテゴリ </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              food.category
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title> メモ </v-list-item-title>
              <v-chip-group column>
                <v-chip
                  outlined
                  disabled
                  style="opacity: 1"
                  v-for="memo in food.memos"
                  :key="memo"
                  >{{ memo }}</v-chip
                >
              </v-chip-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions class="justify-center pa-3 mb-3">
          <v-btn
            v-if="enabled"
            color="primary"
            rounded
            large
            min-width="8em"
            class="font-weight-bold"
            @click="toggle()"
            :loading="loading"
            :disabled="loading"
          >
            <span>消費</span>
          </v-btn>
          <v-btn
            v-else
            color="primary"
            rounded
            large
            min-width="8em"
            class="font-weight-bold"
            @click="edit()"
            ><span>編集</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import Food from "@/types/food";

export default Vue.extend({
  props: {
    foodId: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  data: (): { [key: string]: boolean | number | Element | null } => ({
    loading: false,
    date: 0,
    warn: false,
    menu: null,
  }),
  methods: {
    ...mapActions(["toggleFood", "deleteFood"]),
    close() {
      this.loading = false;
      this.warn = false;
      this.$emit("close");
    },
    edit() {
      this.$router.push({ name: "Edit", params: { foodId: this.foodId } });
    },
    async toggle() {
      this.loading = true;
      await this.toggleFood(this.foodId);
      this.close();
    },
    async execDelete() {
      this.loading = true;
      await this.deleteFood(this.foodId);
      this.close();
    },
    async scroll() {
      await this.$nextTick();
      if (this.menu instanceof Element) {
        this.menu.scrollTop = this.menu.scrollHeight;
      }
    },
  },
  computed: {
    food(): Food | { [key: string]: never } {
      const food = this.$store.getters.foodById(this.foodId);
      if (food) {
        food.date = new Date(food.limit).toISOString().substr(0, 10);
        return food;
      } else {
        return {};
      }
    },
  },
  watch: {
    async foodId() {
      await this.scroll();
    },
  },
  async mounted() {
    this.menu = this.$el.querySelector("#target");
    await this.scroll();
  },
});
</script>
