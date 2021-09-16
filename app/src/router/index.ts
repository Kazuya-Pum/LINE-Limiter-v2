import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/add",
    name: "Add",
    component: () => import("../views/Add.vue"),
    meta: { title: "登録" },
  },
  {
    path: "/add/:foodId",
    name: "Edit",
    component: () => import("../views/Add.vue"),
    props: true,
    meta: { title: "編集" },
  },
  {
    path: "/list",
    name: "List",
    component: () => import("../views/List.vue"),
    props: { enabled: true },
    meta: { title: "一覧" },
  },
  {
    path: "/history",
    name: "History",
    component: () => import("../views/List.vue"),
    props: { enabled: false },
    meta: { title: "履歴" },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { title: "設定" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
