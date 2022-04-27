<template>
  <h1>可视化分析 {{ paperId }}</h1>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const paperId = ref(router.currentRoute.value.params.paperId);
    return {
      router,
      paperId,
    };
  },
};
</script>