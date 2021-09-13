module.exports = {
  transpileDependencies: ["vuetify"],
  pages: {
    index: {
      entry: "src/main.ts",
      title: "LINE Limiter",
    },
  },
  devServer: {
    disableHostCheck: true,
  },
  pwa: {
    name: "LINE Limiter",
    background_color: "#65D678",
    themeColor: "#65D678",
  },
};
