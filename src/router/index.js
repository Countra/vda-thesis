import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VdaListView from '../views/VdaListView.vue'
import axiosRequest from "@/utils/axiosRequest";
import store from '@/store';
import { ElNotification } from "element-plus";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/analysis/vda',
    name: 'vdaList',
    component: VdaListView
  },
  {
    path: '/analysis/vda/:paperId',
    name: 'vdaAnalysis',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VdaView.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由拦截器
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("user");
  console.log(to.path);
  if ((to.path == '/analysis/vda' || to.path == '/analysis/vda/') && user == null) {
    console.log("无权限");
    ElNotification({
      title: '错误',
      message: '请先登录',
      // 不会自动关闭
      // duration: 0,
      type: 'error',
    })
    next({ path: '/notFound' });
  }
  if (to.path.startsWith('/login')) {
    localStorage.removeItem('user');
    next();
  }
  if (user != null) {
    // 校验token合法性
    // 校验Token的API
    const userInfo = JSON.parse(user);
    axiosRequest({
      url: '/api/user/checkToken',
      method: 'get'
    }).then(res => {
      if (res.data == true) {
        console.log("token校验成功");
        store.commit("setUserLoginInfo", {
          userName: userInfo.username,
          role: userInfo.role,
          token: userInfo.token
        });
      } else {
        console.log("token校验失败");
        localStorage.removeItem("user");
        store.commit("clearUserLoginInfo");
      }
    }).catch(error => {
      localStorage.removeItem("user");
      store.commit("clearUserLoginInfo");
    })
    next();
  }
  next();

})

export default router
