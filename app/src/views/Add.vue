<template>
  <v-container fluid class="pa-0" style="height: 100%">
    <v-form style="background-color: #eeeeee; height: 100%">
      <div
        class="d-flex align-stretch flex-column flex-sm-row"
        style="height: 100%; max-height: calc(100vh - 56px)"
      >
        <v-card
          flat
          height="100vmin"
          min-height="20vmin"
          min-width="50vmin"
          style="background-color: #eeeeee"
          class="flex-grow-0 flex-shrink-1"
        >
          <label
            for="file_img"
            style="
              display: block;
              height: 100%;
              background-position: center;
              background-repeat: no-repeat;
              background-size: 30%;
            "
            :style="{ backgroundImage: backgroundImage }"
          >
            <v-file-input
              name="file"
              id="file_img"
              accept="image/*"
              class="d-none"
              v-model="preview"
            />
            <v-img v-if="url" :src="url" height="100%" />
          </label>
        </v-card>
        <div class="flex-grow-1 flex-shrink-0">
          <v-card class="rounded-t-xl overflow-y-auto" height="100%">
            <v-card-title>
              <v-text-field label="食品名を入力"></v-text-field>
            </v-card-title>
            <v-tabs icons-and-text v-model="tab" grow show-arrows center-active>
              <v-tab @click="open">
                期限
                <v-icon x-large>mdi-bell</v-icon>
              </v-tab>
              <v-tab @click="open">
                保存場所
                <v-icon x-large>mdi-fridge</v-icon>
              </v-tab>
              <v-tab @click="open">
                カテゴリ
                <v-icon x-large>mdi-shape</v-icon>
              </v-tab>
              <v-tab @click="open">
                メモ
                <v-icon x-large>mdi-file-document-edit</v-icon>
              </v-tab>
            </v-tabs>
            <v-expand-transition>
              <v-tabs-items v-model="tab" @change="open" v-show="show">
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="date"
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="賞味期限"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="$refs.dialog.save(date)"
                        ></v-date-picker>
                      </v-dialog>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text>
                      <h3>通知日</h3>
                      <v-chip-group multiple color="primary">
                        <v-chip filter>1日前</v-chip>
                      </v-chip-group>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-text-field
                        v-model="place"
                        label="保存場所を入力"
                      ></v-text-field>
                      <v-chip-group v-model="place" color="primary">
                        <v-chip value="冷蔵庫">冷蔵庫</v-chip>
                        <v-chip value="冷凍庫">冷凍庫</v-chip>
                        <v-chip value="常温">常温</v-chip>
                      </v-chip-group>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-text-field
                        v-model="category"
                        label="カテゴリーを入力"
                      ></v-text-field>
                      <v-chip-group v-model="category" color="primary">
                        <v-chip value="生鮮食品">生鮮食品</v-chip>
                        <v-chip value="調味料">調味料</v-chip>
                        <v-chip value="保存食">保存食</v-chip>
                        <v-chip value="その他">その他</v-chip>
                      </v-chip-group>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-combobox
                        v-model="memos"
                        chips
                        clearable
                        label="メモを入力"
                        multiple
                        append-icon=""
                      >
                        <template
                          v-slot:selection="{ attrs, item, select, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click="select"
                            @click:close="remove(item)"
                          >
                            <strong>{{ item }}</strong>
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-expand-transition>
            <v-card-actions class="justify-center pa-3">
              <v-btn
                id="submit"
                color="primary"
                outlined
                rounded
                large
                min-width="8em"
                class="font-weight-bold"
              >
                <span>保存</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Add",
  data: () => ({
    preview: null,
    backgroundImage: "url(" + require("../assets/img.png") + ")",
    imgHeight: "100vmin",
    tab: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    modal: false,
    place: "冷蔵庫",
    category: null,
    memos: [] as string[],
    show: false,
  }),
  computed: {
    url() {
      if (this.preview == null) {
        return;
      }
      return URL.createObjectURL(this.preview);
    },
  },
  methods: {
    open() {
      this.show = true;
    },
    remove(item: string) {
      this.memos.splice(this.memos.indexOf(item), 1);
      this.memos = [...this.memos];
    },
  },
});
</script>
