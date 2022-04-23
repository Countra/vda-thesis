<template>
  <div class="common-layout">
    <el-container>
      <el-header><PageHeader></PageHeader> </el-header>
      <el-container>
        <el-aside width="200px">
          <Siderbar></Siderbar>
        </el-aside>
        <el-main>
          <router-view></router-view>
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
import Siderbar from "./components/Sidebar.vue";
import PageHeader from "./components/PageHeader.vue";
export default {
  components: {
    Siderbar,
    PageHeader,
  },
  setup() {
    return {};
  },
};
</script>