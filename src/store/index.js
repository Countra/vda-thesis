import { createStore } from 'vuex'

export default createStore({
  state: {
    searchResult: null,
    seachResultKeyWord: "",
    searchResultOffset: 0,
    searchResultLimit: 10,
  },
  getters: {
    // 当前搜索页的页数
    searchResultCurrentPage: (state) => {
      return parseInt(state.searchResultOffset / state.searchResultLimit) + 1;
    },
    // 当前搜索结果的URL
    searchResultUrl: (state) => {
      return `${process.env.VUE_APP_BACK_API}/api/search/new/thesis?query=${state.seachResultKeyWord
        .split(" ")
        .join("+")}&offset=${state.searchResultOffset}&limit=${state.searchResultLimit}`
    }
  },
  mutations: {
    setSearchResult: (state, result) => {
      state.searchResult = result;
    },
    setSeachResultKeyWord: (state, result) => {
      state.seachResultKeyWord = result;
    },
    setSearchResultOffset: (state, result) => {
      state.searchResultOffset = result;
    }
  },
  actions: {
  },
  modules: {
  }
})
