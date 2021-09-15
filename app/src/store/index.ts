import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import firebase from "firebase/app";
import "firebase/firestore";
import Food from "@/types/food";

Vue.use(Vuex);

const categorys = ["生鮮食品", "調味料", "保存食"];

const valFood = (food: Food): Food => {
  return {
    name: food.name ? food.name : "",
    limit: food.limit
      ? food.limit
      : Date.now() - new Date().getTimezoneOffset() * 60000,
    notifications: food.notifications ? food.notifications : [],
    place: food.place ? food.place : "",
    category: food.category ? food.category : "",
    memos: food.memos ? food.memos : [],
    enabled: !!food.enabled,
    img: food.img ? food.img : "",
  };
};

export default new Vuex.Store({
  state: {
    storageId: "",
    notice: 12,
    foods: [] as Food[],
  },
  getters: {
    storageId: (state) => {
      return state.storageId;
    },
    notice: (state) => {
      return state.notice;
    },
    foods:
      (state) =>
      (enabled = true, search = "") => {
        return state.foods.filter(
          (food) =>
            food.enabled === enabled &&
            (search === "" || food.name.startsWith(search))
        );
      },
    foodById:
      (state) =>
      (foodId: string): Food | undefined => {
        const res = state.foods.filter((food) => food.id === foodId);
        return res.length > 0 ? res[0] : undefined;
      },
    foodsByCategory:
      (state) =>
      (category: string, enabled = true, search = "") => {
        return state.foods.filter(
          (food) =>
            food.category === category &&
            food.enabled === enabled &&
            (search === "" || food.name.startsWith(search))
        );
      },
    foodsOtherCategory:
      (state) =>
      (enabled = true, search = "") => {
        return state.foods.filter(
          (food) =>
            food.enabled === enabled &&
            !categorys.includes(food.category) &&
            (search === "" || food.name.startsWith(search))
        );
      },
  },
  mutations: {
    ...vuexfireMutations,
    setStorageId(state, storageId) {
      state.storageId = storageId;
    },
    setNotice(state, notice) {
      state.notice = notice;
    },
  },
  actions: {
    bindFoods: firestoreAction(
      async ({ bindFirestoreRef, getters, commit }) => {
        // return the promise returned by `bindFirestoreRef`
        const info = await firebase
          .firestore()
          .collection("storages")
          .doc(getters.storageId)
          .get();

        const notice = info.get("notice");
        if (
          typeof notice === "number" &&
          Number.isInteger(notice) &&
          notice >= 0 &&
          notice <= 23
        ) {
          commit("setNotice", notice);
        } else {
          await firebase
            .firestore()
            .collection("storages")
            .doc(getters.storageId)
            .update({ notice: getters.notice });
        }

        return bindFirestoreRef(
          "foods",
          firebase
            .firestore()
            .collection("storages")
            .doc(getters.storageId)
            .collection("foods")
            .orderBy("limit")
        );
      }
    ),
    setNotice: firestoreAction(({ getters, commit }, notice: number) => {
      if (Number.isInteger(notice) && notice >= 0 && notice <= 23) {
        commit("setNotice", notice);
        return firebase
          .firestore()
          .collection("storages")
          .doc(getters.storageId)
          .update({ notice });
      }
    }),
    addFood: firestoreAction(({ getters }, food: Food) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageId)
        .collection("foods")
        .add(valFood(food));
    }),
    updateFood: firestoreAction(({ getters }, { foodId, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageId)
        .collection("foods")
        .doc(foodId)
        .update(valFood(food));
    }),
    toggleFood: firestoreAction(async ({ getters }, foodId) => {
      const food = getters.foodById(foodId);

      food.enabled = !food.enabled;

      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageId)
        .collection("foods")
        .doc(foodId)
        .update(food);
    }),
    deleteFood: firestoreAction(({ getters }, foodId) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageId)
        .collection("foods")
        .doc(foodId)
        .delete();
    }),
  },
  modules: {},
});
