<template>
  <div class="vda-upload">
    <VdaImportUpload />
  </div>
</template>

<script>
import VdaImportUpload from "@/components/VdaImportUpload.vue";

export default {
  components: {
    VdaImportUpload,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.vda-upload {
  width: 100%;
  height: 100%;
}
</style>
