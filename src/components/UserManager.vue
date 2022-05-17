<template>
  <h1>用户管理</h1>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="用户名" sortable prop="username" />
      <el-table-column label="角色" sortable prop="role" />
      <el-table-column
        label="创建时间"
        sortable
        prop="createTime"
        width="400px"
      />
      <el-table-column label="状态" sortable prop="status" />
      <el-table-column align="left" label="操作" width="200px">
        <template #default="scope">
          <el-button
            size="small"
            type="success"
            @click="handleEnabled(scope.$index, scope.row)"
            >启用</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDsiabled(scope.$index, scope.row)"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import axiosRequest from "@/utils/axiosRequest";
import { ElNotification } from "element-plus";
export default {
  setup() {
    const reload = inject("reload");
    const loading = ref(true);
    const handleEnabled = (index, row) => {
      console.log(row.id);
      console.log(index, row);
      setStatus(row.id, 1);
    };
    const handleDsiabled = (index, row) => {
      console.log(index, row);
      setStatus(row.id, 0);
    };

    const setStatus = (id, status) => {
      axiosRequest({
        method: "post",
        url: `/api/user/${id}/status/${status}`,
      })
        .then((res) => {
          console.log(res);
          ElNotification({
            title: "操作成功",
            type: "success",
          });
          reload();
        })
        .catch((error) => {
          ElNotification({
            title: "操作失败",
            type: "error",
          });
          reload();
          console.log(error);
        });
    };

    const initTableData = () => {
      axiosRequest({
        method: "get",
        url: "/api/user",
      })
        .then((res) => {
          console.log(res);
          console.log(tableData);
          let userData = res.data.data;
          userData.forEach((el) => {
            el.createTime = new Date(el.createTime);
            el.role = el.role == 1 ? "管理员" : "普通用户";
            el.status = el.status == 1 ? "已启用" : "已禁用";
          });
          tableData.value = userData;
          console.log(tableData);
          loading.value = false;
        })
        .catch((error) => {
          console.log(error);
          loading.value = false;
          ElNotification({
            title: "获取用户信息失败",
            type: "error",
          });
        });
    };

    let tableData = ref([]);

    onMounted(() => {
      initTableData();
    });

    return {
      tableData,
      loading,
      handleEnabled,
      handleDsiabled,
    };
  },
};
</script>