<template>
  <div class="header-container">
    <h2><img src="../assets/logo.png" alt="logo" />学术检索与分析系统</h2>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.header-container h2 {
  display: flex;
  position: relative;
  justify-content: center;
  align-content: center;
  padding-left: 50px;
}

.header-container h2 img {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
