import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import firebase from "firebase/app";
import "firebase/firestore";

Vue.use(Vuex);
interface Food {
  id?: string;
  name: string;
  limit: number;
  notifications: number[];
  place: string;
  category: string;
  memos: string[];
  enabled: boolean;
  img: string;
}

const categorys = ["生鮮食品", "調味料", "保存食"];

export default new Vuex.Store({
  state: {
    uid: "",
    foods: [] as Food[],
  },
  getters: {
    uid: (state) => {
      return state.uid;
    },
    foods:
      (state) =>
      (enabled = true) => {
        return state.foods.filter((food) => food.enabled === enabled);
      },
    foodByID:
      (state) =>
      (foodID: string): Food | undefined => {
        const res = state.foods.filter((food) => food.id === foodID);
        return res.length > 0 ? res[0] : undefined;
      },
    foodsByCategory:
      (state) =>
      (category: string, enabled = true) => {
        return state.foods.filter(
          (food) => food.category === category && food.enabled === enabled
        );
      },
    foodsOtherCategory:
      (state) =>
      (enabled = true) => {
        return state.foods.filter(
          (food) =>
            food.enabled === enabled && !categorys.includes(food.category)
        );
      },
  },
  mutations: {
    ...vuexfireMutations,
    setUserID(state, uid) {
      state.uid = uid;
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
          .doc(getters.uid)
          .collection("foods")
      );
    }),
    addFood: firestoreAction(({ getters }, food) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
        .collection("foods")
        .add(food);
    }),
    updateFood: firestoreAction(({ getters }, { foodID, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
        .collection("foods")
        .doc(foodID)
        .update(food);
    }),
    toggleFood: firestoreAction(async ({ getters }, foodID) => {
      const food = getters.foodByID(foodID);

      food.enabled = !food.enabled;

      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
        .collection("foods")
        .doc(foodID)
        .update(food);
    }),
    deleteFood: firestoreAction(({ getters }, foodID) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
        .collection("foods")
        .doc(foodID)
        .delete();
    }),
  },
  modules: {},
});
