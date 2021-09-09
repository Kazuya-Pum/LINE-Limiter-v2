import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ja from "vuetify/src/locale/ja";
import All from "../components/icons/All.vue";
import Preserved from "../components/icons/Preserved.vue";
import Other from "../components/icons/Other.vue";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#65D678",
      },
      dark: {
        primary: "#65D678",
      },
    },
  },
  lang: {
    locales: { ja },
    current: "ja",
  },
  icons: {
    values: {
      all: {
        component: All,
      },
      preserved: {
        component: Preserved,
      },
      other: {
        component: Other,
      },
    },
  },
});
