<template>
  <div class="search-container">
    <img
      class="thesis-search"
      src="../assets/thesis-search-logo.png"
      alt="thesis-search-logo"
    />
    <div class="search-contain">
      <el-autocomplete
        v-model="searchKeyWord"
        :fetch-suggestions="querySearchAsync"
        placeholder="输入关键字查询（多个关键字用空格分隔）"
        class="input-with-select"
        style="width: 600px"
        size="large"
        @select="handleSelect"
        clearable
        @keyup.enter="search()"
      >
        <template #append>
          <el-button size="large" :icon="Search" @click="search()" />
        </template>
      </el-autocomplete>
    </div>
  </div>

  <SearchResult ref="sResult"></SearchResult>
</template>

<script>
import { ref, onMounted, onBeforeMount } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElNotification, ElLoading } from "element-plus";
import axios from "axios";
import SearchResult from "@/components/SearchResult.vue";
import { useStore } from "vuex";

export default {
  name: "ThesisSearch",
  props: {
    msg: String,
  },
  components: {
    SearchResult,
  },
  setup() {
    const searchKeyWord = ref("");
    const links = ref([]);
    // 历史搜索记录
    let searchHistory =
      localStorage.getItem("history") == null
        ? []
        : JSON.parse(localStorage.getItem("history"));
    console.log("搜索历史记录", searchHistory);

    // 论文搜索接口API
    let searchApi = process.env.VUE_APP_BACK_API + "/api/search/new/thesis";

    // 获取子组件
    const sResult = ref();
    // console.log(sResult.value);

    // 页面全屏加载动画
    let fullLoading = null;

    // 使用vuex的全局变量
    const store = useStore();

    const loadAll = () => {
      return searchHistory;
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
      fullLoading.close();
      // console.log(sResult.value.displaySearchResult);
    });

    onBeforeMount(() => {
      fullLoading = ElLoading.service({
        lock: true,
        text: "加载中...",
      });
    });

    // 论文搜索方法
    const search = (offset = 0, limit = 10) => {
      console.log(searchApi);
      console.log(searchKeyWord.value);
      let keyWord = searchKeyWord.value.trim();
      if (keyWord.length == 0) {
        ElMessage.error("输入不能为空!");
      } else {
        let searchUrl = `${searchApi}?query=${keyWord
          .split(" ")
          .join("+")}&offset=${offset}&limit=${limit}`;
        fullLoading = ElLoading.service({
          lock: true,
          text: "查询中...",
        });
        axios
          .get(searchUrl)
          .then((result) => {
            if (result.data.code == 200 && result.data.message == "success") {
              fullLoading.close();
              ElNotification({
                title: "查询成功",
                type: "success",
              });
              // 修改搜索结果
              store.commit("setSearchResult", result.data.data);
              // 查找是否有重复的记录
              let isReapt = false;
              try {
                searchHistory.forEach((data) => {
                  if (data.value == searchKeyWord.value.trim()) {
                    throw new Error();
                  }
                });
              } catch {
                isReapt = true;
              }
              // 更新缓存
              if (!isReapt) {
                // 存储搜索历史
                searchHistory.push({
                  value: searchKeyWord.value.trim(),
                  link: searchUrl,
                });
                localStorage.setItem("history", JSON.stringify(searchHistory));
              }
              // 显示搜索结果
              sResult.value.displaySearchResult();
            } else {
              // error
              fullLoading.close();
              ElNotification({
                title: "查询失败",
                message: "请检查后端API接口",
                type: "error",
              });
            }
            console.log(result);
          })
          .catch(function (error) {
            fullLoading.close();
            console.log(error);
          });
        console.log(searchUrl);
      }
    };

    return {
      searchKeyWord,
      Search,
      sResult,
      handleSelect,
      querySearchAsync,
      search,
      searchHistory,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  width: 100%;
  height: 240px;
}
.search-contain {
  margin-top: 200px;
}
.thesis-search {
  display: flex;
  position: absolute;
  top: -200px;
  width: 600px;
  z-index: -1;
}
</style>
