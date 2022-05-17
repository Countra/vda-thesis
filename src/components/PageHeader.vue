<template>
  <div class="header-container">
    <h2><img src="../assets/logo.png" alt="logo" />学术检索与分析系统</h2>
    <div class="header-user">
      <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
        <div class="header-user-img"><el-avatar :src="userLogged" /></div>

        <el-sub-menu index="1">
          <template #title>{{
            store.state.user.userName == null
              ? "游客"
              : store.state.user.userName
          }}</template>
          <div v-if="store.state.user.token == null">
            <el-menu-item index="1-1" @click="loginAndRegister">
              <el-icon><user-filled /></el-icon>登录/注册
            </el-menu-item>
          </div>
          <div v-else>
            <el-menu-item index="1-1" v-if="store.state.user.role == 1">
              <router-link to="/user/manager" class="sider-nav">
                <el-icon><UserFilled /></el-icon>用户管理
              </router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/analysis/vda" class="sider-nav">
                <el-icon><monitor /></el-icon>已保存的可视化分析
              </router-link>
            </el-menu-item>
            <el-menu-item index="1-3" @click="logout"
              ><el-icon><position /></el-icon>退出</el-menu-item
            >
          </div>
        </el-sub-menu>
      </el-menu>
    </div>

    <el-dialog
      v-model="loginDialogFormVisible"
      :title="form.type == 'signIn' ? '登录' : '注册'"
      width="500px"
    >
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            placeholder="请输入用户名"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
            autocomplete="off"
            show-password
          />
        </el-form-item>

        <el-form-item
          v-if="form.type == 'signUp'"
          label="二次确认"
          :label-width="formLabelWidth"
        >
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="form.repeatPassword"
            autocomplete="off"
            show-password
          />
        </el-form-item>

        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="选择类型">
            <el-option label="登录" value="signIn" />
            <el-option label="注册" value="signUp" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialogFormVisible = false">取消</el-button>

          <el-button
            v-if="form.type == 'signIn'"
            type="primary"
            @click="signIn"
          >
            登录</el-button
          >
          <el-button v-else type="primary" @click="signUp">注册</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import userLogged from "@/assets/user-logged.png";
import { ElMessageBox, ElMessage, ElNotification } from "element-plus";
import { useStore } from "vuex";
import { ref, reactive, inject } from "vue";
import axiosRequest from "@/utils/axiosRequest";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const loginDialogFormVisible = ref(false);
    const formLabelWidth = "100px";
    const form = reactive({
      name: "",
      password: "",
      repeatPassword: "",
      type: "signIn",
    });

    // 组件刷新
    const reload = inject("reload");

    const loginAndRegister = () => {
      loginDialogFormVisible.value = true;
    };

    const router = useRouter();

    // 登录&注册
    const signIn = () => {
      if (checkoutForm()) {
        console.log("登录");
        axiosRequest({
          method: "post",
          url: "/api/user/login",
          data: {
            username: form.name,
            password: form.password,
          },
        })
          .then((response) => {
            console.log(response);
            if (response.data.message == "error") {
              ElMessage.error(response.data.data);
            } else if (response.data.message == "success") {
              localStorage.setItem("user", JSON.stringify(response.data.data));
              store.commit("setUserLoginInfo", {
                userName: response.data.data.username,
                role: response.data.data.role,
                token: response.data.data.token,
              });
              loginDialogFormVisible.value = false;
              ElNotification({
                title: "登录成功",
                message: response.data.data.username + " 欢迎回来!",
                type: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            ElMessage.error(error);
          });
      } else {
        ElMessage.error("用户名和密码不能为空!");
      }
    };

    const signUp = () => {
      if (form.password != form.repeatPassword) {
        ElMessage.error("两次密码输入不一致!");
        return;
      }
      if (checkoutForm()) {
        axiosRequest({
          method: "post",
          url: "/api/user/add",
          data: {
            username: form.name,
            password: form.password,
          },
        })
          .then((res) => {
            if (res.data.code == 200 && res.data.message == "success") {
              ElMessage({
                showClose: true,
                message: "注册成功",
                type: "success",
              });
              signIn();
            } else {
              ElNotification({
                title: "失败",
                message: res.data.data,
                type: "error",
              });
            }
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        ElMessage.error("用户名和密码不能为空!");
      }
    };

    // 检查表单输入
    const checkoutForm = () => {
      if (
        form.name.length == 0 ||
        form.password.length == 0 ||
        form.name.indexOf(" ") != -1 ||
        form.password.indexOf(" ") != -1
      ) {
        return false;
      } else {
        return true;
      }
    };

    const logout = () => {
      ElMessageBox.confirm("你确定要退出账号吗?", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          localStorage.removeItem("user");
          store.commit("clearUserLoginInfo");
          router.push("/");
          // reload();
        })
        .catch(() => {
          // catch error
        });
    };
    return {
      userLogged,
      store,
      loginDialogFormVisible,
      formLabelWidth,
      form,
      loginAndRegister,
      logout,
      signIn,
      signUp,
    };
  },
};
</script>

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

.header-container .header-user {
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-user-img {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sider-nav {
  color: #000;
  text-decoration: none;
}
</style>
