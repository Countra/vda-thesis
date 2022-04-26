import { createStore } from 'vuex'

export default createStore({
  state: {
    searchResult: null,
  },
  getters: {
  },
  mutations: {
    setSearchResult: (state, result) => {
      state.searchResult = result;
    }
  },
  actions: {
  },
  modules: {
  }
})
