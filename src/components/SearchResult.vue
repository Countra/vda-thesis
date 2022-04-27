<template>
  <el-drawer
    v-model="$store.state.searchResultDisplay"
    :direction="direction"
    :before-close="handleClose"
    :size="size"
  >
    <template #title>
      <h1 class="search-result-title" v-if="$store.state.searchResult != null">
        “{{ $store.state.seachResultKeyWord }}” 大约有{{
          $store.state.searchResult.total
        }}搜索结果
      </h1>
      <h1 class="search-result-title" v-else></h1>
    </template>
    <div
      v-if="
        $store.state.searchResult == null ||
        $store.state.searchResult.data.length == 0
      "
    >
      <h2 class="search-result-none">
        <div>
          <el-icon><warning /></el-icon>
        </div>
        暂无搜索数据
      </h2>
    </div>
    <div v-else v-loading="resultLoading">
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
              <el-button
                type="primary"
                :data-paperId="item.paperId"
                @click="visualAnalysis"
                >可视化分析</el-button
              >
            </template>
            <el-descriptions-item label="作者：">
              <span v-if="item.authors == null || item.authors.length == 0">
                <el-tag class="ml-2" type="info">暂无数据</el-tag>
              </span>
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
      <el-backtop
        :bottom="30"
        :right="25"
        target=".el-drawer__body"
        ref="backTopRef"
      />
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="$store.state.searchResult.total"
          :currentPage="$store.getters.searchResultCurrentPage"
          @current-change="changePage"
          :disabled="disabled"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { inject, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const direction = ref("btt");
    const size = ref("calc(100% - 75px)");

    // 分页栏的点击状态
    const disabled = ref(false);

    // 搜索数据加载动画
    const resultLoading = ref(false);

    // 获取父组件的store对象
    const store = inject("store");

    const backTopRef = ref(null);

    // 使用路由
    const router = useRouter();

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
      store.commit("setSearchResultDisplay", true);
    };

    // 改变页数
    const changePage = (newPage) => {
      // 禁用分页栏的状态
      disabled.value = true;
      resultLoading.value = true;
      console.log("更改的新标签页:", newPage);
      console.log("before:", store.state.searchResultOffset);
      let prevPage = store.getters.searchResultCurrentPage;
      console.log(prevPage);
      store.commit(
        "setSearchResultOffset",
        (newPage - 1) * store.state.searchResultLimit
      );
      console.log("after:", store.state.searchResultOffset);
      console.log(store.getters.searchResultUrl);
      axios
        .get(store.getters.searchResultUrl)
        .then((result) => {
          console.log(result);
          if (result.data.code == 200) {
            // 返回顶部
            backTopRef.value.$el.click();
            // 修改搜索结果
            store.commit("setSearchResult", result.data.data);
            disabled.value = false;
            resultLoading.value = false;
          } else {
            ElMessage({
              message: "出错了，请尝试切换其他结果页",
              type: "error",
            });
            store.commit(
              "setSearchResultOffset",
              (prevPage - 1) * store.state.searchResultLimit
            );
            disabled.value = false;
            resultLoading.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          disabled.value = false;
          resultLoading.value = false;
        });
    };

    // 构建可视化分析
    const visualAnalysis = (e) => {
      // currentTarget 获取当前被点击的元素
      const node = e.currentTarget;
      const nodePaperId = node.getAttribute("data-paperId");
      ElMessageBox.confirm("是否对该文献进行可视化分析?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
        draggable: true,
      })
        .then(() => {
          router.push({
            name: "vdaAnalysis",
            params: { paperId: nodePaperId },
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    };

    return {
      direction,
      size,
      disabled,
      resultLoading,
      backTopRef,
      handleClose,
      displaySearchResult,
      changePage,
      visualAnalysis,
    };
  },
};
</script>

<style scoped>
.search-result-none {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-result-none div {
  margin-right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-card {
  /* padding: 10px 20px; */
  margin: 0 40px 25px 40px;
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