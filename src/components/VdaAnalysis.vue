<template>
  <div class="vda-info-card" :data-paperId="paperId">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ paper.title }}</span>
          <div class="paper-info">
            <span>{{ paper.year }}</span
            ><span>{{ paper.authors }}</span>
          </div>
          <div class="vda-button">
            <el-button
              type="primary"
              size="small"
              @click="saveVda"
              :disabled="store.state.user.userName == null"
              >保存</el-button
            >
            <el-popconfirm
              title="你确定要删除该篇论文的分析数据吗？"
              @confirm="deleteVda"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  :disabled="store.state.user.userName == null"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              title="你确定要更新该篇论文的分析数据吗？"
              @confirm="reloadVda"
            >
              <template #reference>
                <el-button type="info" size="small">更新</el-button>
              </template>
            </el-popconfirm>
          </div>
          <!-- <el-button class="button" type="text">Operation button</el-button> -->
        </div>
      </template>
      <div class="vda-info-card-abstract collapse" ref="abstract">
        {{ paper.abstract }}
      </div>
      <el-button class="abstract-status" type="text" @click="toggleAbstract">{{
        abstractStatus ? "显示更多" : "收起"
      }}</el-button>
    </el-card>
  </div>
  <div class="chart-box">
    <div class="echarts-zoom-btn">
      <el-popover
        ref="popover"
        placement="right"
        title="提示"
        :width="200"
        trigger="click"
        content=""
      >
        <template #reference>
          <el-button
            ><el-icon><info-filled /></el-icon
          ></el-button>
        </template>
        <template #default>
          <p>图表上不同颜色的ABCD等分类代表论文之间引用关系的层级</p>
          <span
            >详解：A代表本次引用关系分析的目标论文，B分类是引用了A的部分论文信息，C、D、E等分类分别代表引用了B分类中某一篇论文下的部分论文信息</span
          >
        </template>
      </el-popover>
      <el-tooltip content="导出" placement="right-start" effect="light">
        <el-button @click="exportDialogVisible = true">
          <el-icon><Download /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="放大" placement="right-start" effect="light">
        <el-button @click="zoomIn"
          ><el-icon><zoom-in /></el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip content="缩小" placement="right-start" effect="light">
        <el-button @click="zoomOut"
          ><el-icon><zoom-out /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <div :id="mychartsId" class="chart-app" />
  </div>

  <!-- 导出选项 -->
  <div>
    <el-dialog v-model="exportDialogVisible" title="选择导出的方式" width="30%" center>
      <div class="vda-export-fn">
        <div class="export-item">
          <h4>导出为图片</h4>
          <el-button @click="exportVdaPic">
            <el-icon><PictureFilled /></el-icon>
          </el-button>
        </div>
        <div class="export-item">
          <h4>导出为JSON</h4>
          <el-button @click="exportVdaToJSON">
            <el-icon><List /></el-icon>
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
</template>

<script>
import { inject, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import axiosRequest from "@/utils/axiosRequest";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const paperId = ref(router.currentRoute.value.params.paperId);

    // 使用动态echarts id 防止生产环境下路由变化echarts不显示
    const mychartsId = ref("Echart-" + Date.now() + Math.random());

    // 路由渲染组件刷新
    const routeReload = inject("reload");

    // 折叠&展开
    const abstract = ref(null);

    const abstractStatus = ref(true);

    // Echarts 实例化对象
    let myChart = null;
    // Echarts 绘制的关系图JSON数据
    let myChartVdaData = {
      paper: null,
      vdaData: null,
    };

    const store = useStore();

    // 导出选项的dialog
    const exportDialogVisible = ref(false);

    const toggleAbstract = () => {
      abstract.value.classList.toggle("collapse");
      abstractStatus.value = !abstractStatus.value;
    };

    const paper = reactive({
      title: null,
      abstract: null,
      year: null,
      authors: null,
    });

    const initT = async () => {
      // 为了优化Echarts绘制图形的整体效果，添加限制条件-->(如果检测到设备的宽度小于900px就提示不支持渲染然后返回)
      if (document.body.offsetWidth < 900) {
        await ElMessageBox.confirm(
          "检测到此设备的屏幕宽度不满足渲染关系图的最低标准，为保证渲染效果请更换设备后重新尝试！",
          "警告",
          {
            confirmButtonText: "确认",
            showClose: false,
            showCancelButton: false,
            type: "warning",
          }
        )
          .then(() => {
            router.back(-1);
            return;
          })
          .catch(() => {
            router.back(-1);
            return;
          });
      }

      myChart = echarts.init(document.getElementById(mychartsId.value));
      console.log(myChart);
      let option = null;
      const loading = ElLoading.service({
        lock: true,
        text: "可视化分析构建中...",
      });

      axiosRequest({
        method: "get",
        url: `/api/paper/${paperId.value}`,
      })
        .then((result) => {
          if (result.data.code == 200 && result.data.data.legend != 0) {
            console.log(result.data.data);
            paper.title = result.data.data.title;
            paper.abstract = result.data.data.abstract;
            paper.year = result.data.data.year;
            if (result.data.data.authors.length < 2) {
              paper.authors = result.data.data.authors[0].name;
            } else {
              paper.authors =
                result.data.data.authors[0].name +
                `等${result.data.data.authors.length - 1}位作者`;
            }
            // 补充待导出数据
            myChartVdaData.paper = paper;
            myChartVdaData.paper.id = paperId.value;
            buildEchartsOption(myChart);
          } else {
            console.log("获取数据失败");
            loading.close();
          }
        })
        .catch((error) => {
          console.log(error);
          loading.close();
        });

      const buildEchartsOption = (myChart) => {
        axiosRequest({
          method: "get",
          url: `/api/vda/paper/${paperId.value}`,
        })
          .then((result) => {
            loading.close();

            let graph = result.data.data;
            myChartVdaData.vdaData = graph;
            console.log(graph);

            if (result.data.code != 200) {
              throw "error";
            }

            graph.nodes.forEach(function (node) {
              node.label = {
                show: node.symbolSize > 30,
              };
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
            myChart.on("click", (param) => {
              if (param.data.url) {
                window.open(param.data.url, "_blank");
              }
            });
          })
          .catch((error) => {
            console.log(error);

            ElMessageBox.alert("构建失败，可以稍后重新尝试", "提示", {
              confirmButtonText: "OK",
              callback: () => {
                router.back(-1);
                ElMessage({
                  type: "error",
                  message: "构建失败",
                });
              },
            });
            loading.close();
          });
      };
    };

    // 保存
    const saveVda = () => {
      axiosRequest({
        method: "get",
        url: `/api/vda/paper/${paperId.value}/enable`,
      })
        .then((result) => {
          if (result.data.code == 200) {
            ElNotification({
              title: "保存成功",
              type: "success",
            });
          } else {
            ElMessage.error("出错了，" + result.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("出错了，请检查后端");
        });
    };

    // 删除
    const deleteVda = () => {
      axiosRequest({
        method: "get",
        url: `/api/vda/paper/${paperId.value}/disable`,
      })
        .then((result) => {
          if (result.data.code == 200) {
            ElNotification({
              title: "删除成功",
              type: "success",
            });
          } else {
            ElMessage.error("出错了，" + result.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("出错了，请检查后端");
        });
    };

    // 重载
    const reloadVda = () => {
      if (store.state.user.token == null) {
        routeReload();
        // router.go(0);
        return;
      }
      axiosRequest({
        method: "get",
        url: `/api/vda/paper/${paperId.value}/reload`,
      })
        .then((result) => {
          if (result.data.code == 200) {
            routeReload();
            ElMessage.success("更新成功");
          } else {
            ElMessage.error("出错了，" + result.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("出错了，请检查后端");
        });
    };

    onMounted(() => {
      initT();
    });

    const zoomIn = () => {
      myChart.setOption({
        series: {
          zoom: myChart.getOption().series[0].zoom + 0.2,
        },
      });
    };

    const zoomOut = () => {
      if (myChart.getOption().series[0].zoom > 0) {
        myChart.setOption({
          series: {
            zoom: myChart.getOption().series[0].zoom - 0.2,
          },
        });
      }
    };

    // 导出可视化分析数据(JSON)
    const exportVdaToJSON = () => {
      let exportData = JSON.stringify(myChartVdaData);
      // 字符内容转变成blob地址
      var blob = new Blob([exportData]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.setAttribute("download", paper.title + ".json");
      a.click();
    };

    // 保存图片到本地
    const exportVdaPic = () => {
      const a = document.createElement("a");
      a.href = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      a.setAttribute("download", paper.title);
      a.click();
    };

    return {
      paper,
      router,
      paperId,
      store,
      abstract,
      mychartsId,
      exportDialogVisible,
      zoomIn,
      zoomOut,
      abstractStatus,
      toggleAbstract,
      saveVda,
      deleteVda,
      reloadVda,
      exportVdaPic,
      exportVdaToJSON,
    };
  },
};
</script>

<style lang="css" scoped>
.chart-box {
  position: relative;
  margin-left: 200px;
  width: calc(100vw - 460px);
  height: calc(100vh - 130px);
}

.chart-app {
  width: 100%;
  height: 100%;
}

.vda-info-card {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 10;
  width: 250px;
}

.paper-info {
  display: flex;
  margin-top: 8px;
  justify-content: space-between;
  font-size: 0.8em;
}

.vda-info-card-abstract {
  font-size: 0.9em;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: pre-wrap;
}

.vda-info-card-abstract.collapse {
  -webkit-line-clamp: 5;
}

.abstract-status {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.vda-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 5px;
}

.echarts-zoom-btn {
  position: absolute;
  left: 80px;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.echarts-zoom-btn button {
  margin: 10px 0;
}

.vda-export-fn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vda-export-fn .export-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 5px 50px;
}
</style>