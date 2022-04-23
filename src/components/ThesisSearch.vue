<template>
  <img
    class="thesis-search"
    src="../assets/thesis-search-logo.png"
    alt="thesis-search-logo"
  />
  <div class="search-contain">
    <el-autocomplete
      v-model="searchKeyWord"
      :fetch-suggestions="querySearchAsync"
      placeholder="Please input"
      class="input-with-select"
      style="width: 600px"
      size="large"
      @select="handleSelect"
      clearable
    >
      <template #append>
        <el-button size="large" :icon="Search" />
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
export default {
  name: "ThesisSearch",
  props: {
    msg: String,
  },
  setup() {
    const searchKeyWord = ref("");
    const links = ref([]);

    const loadAll = () => {
      return [
        { value: "vue", link: "https://github.com/vuejs/vue" },
        { value: "element", link: "https://github.com/ElemeFE/element" },
        { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
        { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
        { value: "vuex", link: "https://github.com/vuejs/vuex" },
        { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
        { value: "babel", link: "https://github.com/babel/babel" },
      ];
    };

    const handleSelect = (item) => {
      console.log("选择", item);
    };

    const querySearchAsync = (queryString, cb) => {
      var results = queryString
        ? links.value.filter(createStateFilter(queryString))
        : links.value;

      cb(results);
    };

    const createStateFilter = (queryString) => {
      return (searchKeyWord) => {
        return (
          searchKeyWord.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    };

    onMounted(() => {
      links.value = loadAll();
    });

    return {
      searchKeyWord,
      Search,
      handleSelect,
      querySearchAsync,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-contain {
  margin-top: 200px;
}
.thesis-search {
  display: flex;
  position: absolute;
  top: -100px;
  left: 50%;
  width: 600px;
  transform: translateX(-35%);
}
</style>
