import { createStore } from "vuex";

export default createStore({
  state: {
    nickname: localStorage.getItem("username"),
    cartSum: localStorage.getItem("cartSum"),
  },
  getters: {},
  mutations: {
    updateCartSum(state, payload) {
      state.cartSum = payload;
    },
    updateUsername(state, payload) {
      state.nickname = payload;
    },
  },
  actions: {},
  modules: {},
});
