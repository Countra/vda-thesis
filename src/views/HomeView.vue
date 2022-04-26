<template>
  <div class="home">
    <ThesisSearch />
  </div>
</template>

<script>
// @ is an alias to /src
import ThesisSearch from "@/components/ThesisSearch.vue";

export default {
  name: "HomeView",
  components: {
    ThesisSearch,
  },
  mounted(){
    console.log(process.env.VUE_APP_BACK_API);
  }
};
</script>

<style scoped>
.demo {
  display: flex;
  position: relative;
}
</style>
