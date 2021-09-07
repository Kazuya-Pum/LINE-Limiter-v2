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
  memo: string[];
  enabled: boolean;
  img: string;
}

export default new Vuex.Store({
  state: {
    foods: [] as Food[],
  },
  getters: {
    foods(state) {
      return state.foods;
    },
    foodByID(state, foodID) {
      const res = state.foods.filter((food) => food.id === foodID);
      return res.length > 0 ? res[0] : undefined;
    },
  },
  mutations: { ...vuexfireMutations },
  actions: {
    init: firestoreAction((context, storageID) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(storageID)
        .collection("foods")
        .add({});
    }),
    bindFoods: firestoreAction(({ bindFirestoreRef }, storageID: string) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "foods",
        firebase
          .firestore()
          .collection("storages")
          .doc(storageID)
          .collection("foods")
      );
    }),
    addFood: firestoreAction((context, { storageID, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(storageID)
        .collection("foods")
        .add(food);
    }),
    updateFood: firestoreAction((context, { storageID, foodID, food }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(storageID)
        .collection("foods")
        .doc(foodID)
        .update(food);
    }),
    toggleFood: firestoreAction(async (context, { storageID, foodID }) => {
      const food = context.getters.foodByID(foodID);

      food.enabled = !food.enabled;

      return firebase
        .firestore()
        .collection("storages")
        .doc(storageID)
        .collection("foods")
        .doc(foodID)
        .update(food);
    }),
    removeFood: firestoreAction((context, { storageID, foodID }) => {
      return firebase
        .firestore()
        .collection("storages")
        .doc(storageID)
        .collection("foods")
        .doc(foodID)
        .delete();
    }),
  },
  modules: {},
});
