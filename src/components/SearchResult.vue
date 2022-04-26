<template>
  <el-button
    type="primary"
    style="margin-left: 16px"
    @click="displaySearchResult"
  >
    open
  </el-button>
  <el-drawer
    v-model="drawer"
    :direction="direction"
    :before-close="handleClose"
    :size="size"
  >
    <template #title>
      <h1 class="search-result-title" v-if="$store.state.searchResult != null">
        匹配到{{ $store.state.searchResult.total }}个搜索结果
      </h1>
      <h1 class="search-result-title" v-else></h1>
    </template>
    <div
      v-if="
        $store.state.searchResult == null ||
        $store.state.searchResult.data.length == 0
      "
    >
      <h3>暂无搜索数据</h3>
    </div>
    <div v-else>
      <div v-for="(item, index) in $store.state.searchResult.data" :key="index">
        <!-- 结果列表 -->
        <el-card shadow="hover" class="result-card">
          <el-descriptions
            class="margin-top"
            :title="item.title"
            direction="vertical"
            :column="5"
            size="default"
            :data-paperId="item.paperId"
            border
          >
            <template #extra>
              <el-button type="primary">可视化分析</el-button>
            </template>
            <el-descriptions-item label="作者：">
              <span v-if="item.authors.length < 5">
                <span v-for="(i, auIndex) in item.authors" :key="auIndex">
                  {{ i.name }}
                  <span v-if="auIndex != item.authors.length - 1">, </span>
                </span>
              </span>
              <span v-else>
                {{ item.authors[0].name }}, {{ item.authors[1].name }},
                {{ item.authors[2].name }}, {{ item.authors[3].name }} 等{{
                  item.authors.length - 4
                }}位作者
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="引文数：">{{
              item.citationCount
            }}</el-descriptions-item>
            <el-descriptions-item label="发表年份：">{{
              item.year
            }}</el-descriptions-item>
            <el-descriptions-item label="发表平台：">
              <span v-if="item.venue == null || item.venue.length == 0">
                <el-tag class="ml-2" type="info">暂无数据</el-tag>
              </span>
              {{ item.venue }}</el-descriptions-item
            >
            <el-descriptions-item label="研究领域：">
              <span v-if="item.fieldsOfStudy == null">
                <el-tag class="ml-2" type="info">暂无数据</el-tag>
              </span>
              <el-tag
                v-for="(i, tagIndex) in item.fieldsOfStudy"
                :key="tagIndex"
                size="small"
                round
                class="mx-1"
              >
                <span>{{ i }}</span>
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="摘要：">
              <span v-if="item.abstract == null">
                <el-tag class="ml-2" type="info">暂无数据</el-tag>
              </span>
              {{ item.abstract }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>

    <div
      v-if="
        $store.state.searchResult != null &&
        $store.state.searchResult.total > 10
      "
    >
      <!-- 一键回到顶部 -->
      <el-backtop :bottom="30" :right="25" target=".el-drawer__body" />
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="$store.state.searchResult.total"
          @current-change="changePage"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  setup() {
    const drawer = ref(false);
    const direction = ref("btt");
    const size = ref("calc(100% - 75px)");
    // 搜索结果

    const handleClose = (done) => {
      ElMessageBox.confirm("确定要关闭搜索结果吗？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then((action) => {
          console.log(action);
          ElMessage({
            type: "info",
            message: "已关闭搜索结果",
          });
          done();
        })
        .catch((action) => {
          // catch error
          console.log(action);
        });
    };

    // 展开搜索结果
    const displaySearchResult = () => {
      drawer.value = true;
    };

    // 改变页数
    const changePage = (newPage) => {
      console.log("更改的新标签页:", newPage);
    };

    return {
      drawer,
      direction,
      size,
      handleClose,
      displaySearchResult,
      changePage,
    };
  },
};
</script>

<style scoped>
.result-card {
  /* padding: 10px 20px; */
  margin: 0 30px 25px 30px;
}

.search-result-title {
  color: black;
}

.pagination {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>