<template>
  <v-card>
    <v-toolbar dark tile style="background-color: #46465a">
      <v-btn icon dark @click="close">
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
      "
      :style="{ backgroundImage: backgroundImage }"
      id="target"
    >
      <v-card class="rounded-t-xl" style="margin-top: 100vmin">
        <v-card-title>
          <span style="max-width: calc(100% - 36px)">
            {{ name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon class="align-self-baseline">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card-title>
        <v-list>
          <v-list-item>
            <v-list-item-title> 賞味期限 </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              limit
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> 保存場所 </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              place
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> カテゴリ </v-list-item-title>
            <v-list-item-subtitle class="text-right">{{
              category
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
                  v-for="memo in memos"
                  :key="memo"
                  >{{ memo }}</v-chip
                >
              </v-chip-group>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions class="justify-center pa-3 mb-3">
          <v-btn
            color="primary"
            rounded
            large
            min-width="8em"
            class="font-weight-bold"
          >
            <span>消費</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FoodDetails",
  data: () => ({
    backgroundImage: "url(" + require("../assets/img.png") + ")",
    name: "aaaaa",
    limit: "piyo",
    place: "fuga",
    category: "hoge",
    memos: ["aaa", "hoge"] as string[],
  }),
  methods: {
    close() {
      this.$emit("close");
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      const target = this.$el.querySelector("#target");
      if (target) {
        target.scrollTop = target.scrollHeight;
      }
    });
  },
});
</script>
