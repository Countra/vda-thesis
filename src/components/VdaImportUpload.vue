<template>
  <el-upload
    class="upload"
    drag
    action=""
    :auto-upload="false"
    :on-change="handleChange"
  >
    <div class="upload-drop-area">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将json文件拖拽到这里，或者 <em>点击导入</em>
      </div>
    </div>
    <template #tip>
      <div class="el-upload__tip">only support json file</div>
    </template>
  </el-upload>

  <!-- 导入选项 -->
  <div>
    <el-dialog
      v-model="importDialogVisible"
      title="导入成功"
      width="30%"
      center
    >
      <div class="import-paper-info">
        <h3>{{ paper.title }}</h3>
        <h4>{{ paper.year }}年 -- {{ paper.authors }}</h4>
      </div>
      <div class="vda-import-fn">
        <div class="import-item">
          <h3>在线分析</h3>
          <el-button @click="onlineAnalysis">
            <el-icon><Link /></el-icon>
          </el-button>
        </div>
        <div class="import-item">
          <h3>离线分析</h3>
          <el-button @click="offlineAnalysis">
            <el-icon><Monitor /></el-icon>
          </el-button>
        </div>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取消</el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>

  <!-- 离线分析 -->
  <div>
    <el-drawer v-model="drawer" title="离线分析" direction="btt" :size="size">
      <template #title>
        <h3 style="color: #000">
          离线分析 <em>"{{ paper == null ? " " : paper.title }}"</em>
        </h3>
      </template>
      <template #default>
        <div :id="mychartsId" class="offline-echarts-container"></div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="onlineAnalysis">在线分析</el-button>
          <el-button @click="drawer = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

export default {
  setup() {
    const importDialogVisible = ref(false);
    const paper = ref(null);
    const router = useRouter();

    const drawer = ref(false);
    const size = ref("100%");

    // 使用动态echarts id 防止生产环境下路由变化echarts不显示
    const mychartsId = ref("Echart-offline-" + Date.now());
    let isAddListen = false;
    // Echarts 实例化对象
    let myChart = null;
    let importData = null;

    const handleChange = (uploadFile, uploadFiles) => {
      console.log(uploadFile.raw.type);
      if (uploadFile.raw.type != "application/json") {
        ElMessage.error("仅支持json格式的文件");
        return;
      }
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          const jsonData = JSON.parse(reader.result);
          if (jsonData && jsonData.paper != null && jsonData.vdaData != null) {
            paper.value = jsonData.paper;
            importDialogVisible.value = true;
            importData = jsonData;
          } else {
            ElMessage.error("数据格式错误");
            return;
          }
        },
        false
      );
      reader.readAsText(uploadFile.raw);
    };

    const onlineAnalysis = () => {
      console.log("在线分析");
      router.push(`/analysis/vda/${paper.value.id}`);
    };

    const offlineAnalysis = () => {
      console.log("离线分析");
      drawer.value = true;
      // 增加一个延迟，防止dom节点来不及渲染而导致echarts初始化失败
      setTimeout(() => {
        myChart = echarts.init(document.getElementById(mychartsId.value));
        console.log(myChart);
        let graph = importData.vdaData;
        graph.nodes.forEach(function (node) {
          node.label = {
            show: node.symbolSize > 30,
          };
        });
        let option = {
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
              roam: true,
              scaleLimit: {
                min: 0.5,
                max: 2,
              },
              zoom: 1,
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
        if (!isAddListen) {
          isAddListen = !isAddListen;
          myChart.on("click", (param) => {
            // console.log(param);
            if (param.data.url) {
              window.open(param.data.url, "_blank");
            }
          });
        }
      }, 500);
    };
    return {
      paper,
      drawer,
      size,
      mychartsId,
      importDialogVisible,
      UploadFilled,
      handleChange,
      onlineAnalysis,
      offlineAnalysis,
    };
  },
};
</script>

<style scoped>
.upload {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* .upload /deep/ .el-upload {
  width: 100%;
  height: 100%;
} */
.upload:deep() .el-upload {
  width: 100%;
  height: 100%;
}
/* .upload /deep/ .el-upload .el-upload-dragger */
.upload:deep() .el-upload .el-upload-dragger {
  width: 100%;
  height: 100%;
}

.upload-drop-area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.vda-import-fn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vda-import-fn .import-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 5px 50px;
}

.import-paper-info {
  text-align: center;
}

.offline-echarts-container {
  width: 100%;
  height: 100%;
}
</style>
