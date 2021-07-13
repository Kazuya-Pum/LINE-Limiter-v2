import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ja from "vuetify/src/locale/ja";

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
});
