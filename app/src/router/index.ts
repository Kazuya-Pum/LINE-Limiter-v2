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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/add",
    name: "Add",
    component: () => import("../views/Add.vue"),
  },
  {
    path: "/add/:foodId",
    name: "Edit",
    component: () => import("../views/Add.vue"),
    props: true,
  },
  {
    path: "/list",
    name: "List",
    component: () => import("../views/List.vue"),
    props: { enabled: true },
  },
  {
    path: "/history",
    name: "History",
    component: () => import("../views/List.vue"),
    props: { enabled: false },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
