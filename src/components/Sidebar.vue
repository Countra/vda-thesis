<template>
  <el-row class="tac">
    <el-col :span="12">
      <h5 style="width: max-content">论文查询&可视化分析</h5>
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

            <router-link to="/history" class="sider-nav">
              <el-menu-item index="1-2">查询历史记录</el-menu-item>
            </router-link>
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

export default {
  setup() {
    const isCollapse = ref(true);
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      isCollapse,
      handleOpen,
      handleClose,
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