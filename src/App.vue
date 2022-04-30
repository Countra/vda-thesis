<template>
  <div class="common-layout">
    <el-container>
      <el-header><PageHeader></PageHeader> </el-header>
      <el-container>
        <el-aside width="auto">
          <Siderbar></Siderbar>
        </el-aside>
        <el-main>
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import { ref, provide, nextTick } from "vue";
import Siderbar from "./components/Sidebar.vue";
import PageHeader from "./components/PageHeader.vue";
export default {
  components: {
    Siderbar,
    PageHeader,
  },
  setup() {
    // 局部组件刷新
    const isRouterAlive = ref(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    };
    provide("reload", reload);
    return { isRouterAlive };
  },
};
</script>