<template>
  <div class="vda-list-card">
    <el-card class="box-card" style="width: 100%" shadow="hover">
      <template #header>
        <div class="card-header" :id="paperId"></div>
      </template>
      <div>
        <div class="paper-title">{{ title }}</div>
        <div class="user-info">
          <span>{{ authors }}</span
          ><span>{{ year }}</span>
        </div>
        <div class="card-btn">
          <el-popconfirm title="确定要删除吗？" @confirm="deleteVda">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="enterVda">进入</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { toRefs, onMounted, inject } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";
import { useRouter } from "vue-router";

export default {
  props: ["title", "authors", "year", "abstracts", "echartsData", "paperId"],
  setup(props) {
    const { paperId } = toRefs(props);
    console.log("paperId: ", paperId.value);
    const router = useRouter();

    const reload = inject("reload");
    const initT = () => {
      const myChart = echarts.init(document.getElementById(props.paperId));
      console.log(myChart);

      let option = null;

      let graph = JSON.parse(props.echartsData);
      console.log(typeof graph);

      graph.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 30,
        };
        if (node.symbolSize > 38) {
          node.symbolSize = node.symbolSize - 25;
        }
      });
      option = {
        title: {
          text: "论文引用文献关系图",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {},
        legend: [
          {
            // selectedMode: 'single',
            data: graph.categories.map(function (a) {
              return a.name;
            }),
          },
        ],
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "",
            type: "graph",
            layout: "none",
            data: graph.nodes,
            links: graph.links,
            categories: graph.categories,
            roam: "move",
            label: {
              position: "right",
              formatter: "{b}",
            },
            labelLayout: {
              // 自动隐藏重叠标签
              hideOverlap: true,
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    };

    onMounted(() => {
      initT();
    });

    const deleteVda = () => {
      let reqUrl = `${process.env.VUE_APP_BACK_API}/api/vda/paper/${paperId.value}/disable`;
      axios
        .get(reqUrl)
        .then((result) => {
          if (result.data.code == 200) {
            ElNotification({
              title: "删除成功",
              type: "success",
            });
            reload();
          } else {
            ElMessage.error("出错了，" + result.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("出错了，请检查后端");
        });
    };

    const enterVda = () => {
      router.push(`/analysis/vda/${paperId.value}`);
    };

    return { ...toRefs(props), deleteVda, enterVda };
  },
};
</script>

<style scoped>
.vda-list-card {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  /* justify-content: center; */
  /* align-content: center; */
}

.card-header {
  width: 100%;
  height: 330px;
}

.paper-title {
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.user-info {
  margin: 5px;
  padding: 0 20px;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>