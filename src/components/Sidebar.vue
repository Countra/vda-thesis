<template>
  <el-row class="tac">
    <el-col :span="12">
      <h5 style="width: max-content">学术搜索&可视化分析</h5>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><search /></el-icon>
            <span>学术搜索</span>
          </template>
          <el-menu-item-group title="">
            <router-link to="/" class="sider-nav">
              <el-menu-item index="1-1">论文查询</el-menu-item>
            </router-link>
            <div class="sider-nav" @click="jumpToSearchResult">
              <el-menu-item index="1-2">显示搜索结果</el-menu-item>
            </div>
          </el-menu-item-group>
        </el-sub-menu>
        <router-link to="/analysis/vda" class="sider-nav">
          <el-menu-item index="2">
            <el-icon><data-analysis /></el-icon>
            <span>可视化分析</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script >
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const isCollapse = ref(true);
    const store = useStore();
    const router = useRouter();

    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };

    const jumpToSearchResult = () => {
      router.push("/");
      store.commit("setSearchResultDisplay", true);
    };

    return {
      isCollapse,
      handleOpen,
      handleClose,
      jumpToSearchResult,
    };
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.sider-nav {
  text-decoration: none;
}
</style>