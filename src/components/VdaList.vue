<template>
  <div class="vda-list-container">
    <VdaListCard
      class="vda-list-card"
      v-for="(item, index) in itemData.data"
      :key="index"
      :title="item.title"
      :authors="item.authors"
      :year="item.year"
      :abstracts="item.abstracts"
      :echartsData="item.echartsData"
      :paperId="item.paperId"
    />
    <div class="img" v-if="isEmpty">
      <img src="@/assets/package.png" alt="空盒子" />
    </div>
  </div>
</template>

<script>
import { inject, onMounted, reactive, ref } from "vue";
import VdaListCard from "@/components/VdaListCard.vue";
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  components: {
    VdaListCard,
  },
  setup() {
    const itemData = reactive({ data: [] });
    const isEmpty = ref(false);

    onMounted(() => {
      axios
        .get(`${process.env.VUE_APP_BACK_API}/api/vda/paper/enable`)
        .then((result) => {
          if (result.data.code == 200) {
            itemData.data = result.data.data;
            if (result.data.data.length == 0) {
              isEmpty.value = true;
            }
          } else {
            isEmpty.value = true;
          }
        })
        .catch((error) => {
          console.log(error);
          isEmpty.value = true;
          ElMessage.error("错误 " + error);
        });
    });
    return { itemData, isEmpty };
  },
};
</script>

<style scoped>
.vda-list-container {
  display: grid;
  width: 100%;
  height: calc(100vh - 120px);
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 50px;
  row-gap: 30px;
}

.vda-list-container .vda-list-card {
  height: 500px;
}

.img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column-start: 2;
}
.img img {
  width: 200px;
}
</style>