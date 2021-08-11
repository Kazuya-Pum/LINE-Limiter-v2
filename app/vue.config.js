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
};
