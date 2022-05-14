<template>
  <el-row class="sidebar-container">
    <el-col :span="12">
      <el-button
        class="sidebar-control"
        circle
        @click="isCollapse = !isCollapse"
      >
        <el-icon v-if="isCollapse"><d-arrow-right /></el-icon>
        <el-icon v-else><d-arrow-left /></el-icon>
      </el-button>
      <el-menu
        default-active="1"
        class="menu-sidebar"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
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
        <el-sub-menu index="2">
          <template #title>
            <el-icon><data-analysis /></el-icon>
            <span>可视化分析</span>
          </template>
          <el-menu-item-group title="">
            <router-link to="/analysis/vda" class="sider-nav">
              <el-menu-item index="2-1">已保存的分析结果</el-menu-item>
            </router-link>
            <router-link to="/analysis/vda/import" class="sider-nav">
              <el-menu-item index="2-2">导入</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script >
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const isCollapse = ref(false);
    const store = useStore();
    const router = useRouter();

    // 当前窗口的宽度
    const offsetWidth = ref();

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

    onMounted(() => {
      offsetWidth.value = document.body.offsetWidth;
      window.onresize = () => {
        return (() => {
          offsetWidth.value = document.body.offsetWidth;
        })();
      };
    });

    // 监听页面宽度变化更改侧边栏状态
    watch(offsetWidth, () => {
      if (offsetWidth.value < 830) {
        isCollapse.value = true;
      } else {
        isCollapse.value = false;
      }
    });

    return {
      isCollapse,
      offsetWidth,
      handleOpen,
      handleClose,
      jumpToSearchResult,
    };
  },
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.menu-sidebar:not(.el-menu--collapse) {
  width: 200px;
}

.menu-sidebar {
  margin-top: 50px;
  height: calc(100vh - 137px);
}

.sider-nav {
  text-decoration: none;
}

.sidebar-control {
  position: absolute;
  width: max-content;
  top: 10px;
  left: 17px;
}
</style>