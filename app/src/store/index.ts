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
          .orderBy("limit")
      );
    }),
    addFood: firestoreAction(({ getters }, food: Food) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
        .collection("foods")
        .add(valFood(food));
    }),
    updateFood: firestoreAction(({ getters }, { foodID, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(getters.uid)
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
