<template>
  <v-form>
    <v-container>
      <v-row>
        <label
          for="file_img"
          style="
            width: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 30%;
          "
          :style="{ height: imgHeight, backgroundImage: backgroundImage }"
        >
          <input
            type="file"
            name="file"
            id="file_img"
            accept="image/*"
            style="display: none"
            ref="preview"
            @change="previewImage"
          />
          <v-img v-if="url" :src="url" />
        </label>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Add",
  data: () => ({
    url: "",
    backgroundImage: "url(" + require("../assets/img.png") + ")",
    imgHeight: "300px",
  }),
  methods: {
    previewImage() {
      if (this.$refs.preview != undefined && "files" in this.$refs.preview) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preview: any = this.$refs.preview;
        this.url = URL.createObjectURL(preview.files[0]);
      }
    },
  },
});
</script>
