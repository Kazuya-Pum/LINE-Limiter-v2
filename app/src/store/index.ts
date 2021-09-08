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
    storageID: "",
    foods: [] as Food[],
  },
  getters: {
    storageID: (state) => {
      return state.storageID;
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
    foodByID:
      (state) =>
      (foodID: string): Food | undefined => {
        const res = state.foods.filter((food) => food.id === foodID);
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
    setStorageID(state, storageID) {
      state.storageID = storageID;
    },
  },
  actions: {
    bindFoods: firestoreAction(({ bindFirestoreRef, getters }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "foods",
        firebase
          .firestore()
          .collection("storages")
          .doc(getters.storageID)
          .collection("foods")
          .orderBy("limit")
      );
    }),
    addFood: firestoreAction(({ getters }, food: Food) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageID)
        .collection("foods")
        .add(valFood(food));
    }),
    updateFood: firestoreAction(({ getters }, { foodID, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageID)
        .collection("foods")
        .doc(foodID)
        .update(valFood(food));
    }),
    toggleFood: firestoreAction(async ({ getters }, foodID) => {
      const food = getters.foodByID(foodID);

      food.enabled = !food.enabled;

      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageID)
        .collection("foods")
        .doc(foodID)
        .update(food);
    }),
    deleteFood: firestoreAction(({ getters }, foodID) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.storageID)
        .collection("foods")
        .doc(foodID)
        .delete();
    }),
  },
  modules: {},
});
