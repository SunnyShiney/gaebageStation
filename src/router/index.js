import { createRouter, createWebHashHistory,createWebHistory } from "vue-router";

//1.定义路由组件
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'
import Content from '@/views/content/Content.vue'
import CarRecord from '@/views/content/components/CarRecord.vue'
import CarWarning from '@/views/content/components/CarWarning.vue'
import OsmoticFluid from '@/views/content/components/OsmoticFluid.vue'
import XihuaShenlvye from "@/views/content/components/XihuaShenlvye.vue";
import HongxingShenlvye from "@/views/content/components/HongxingShenlvye.vue";
import CarDetailInfo from '@/views/content/components/CarDetailInfo.vue'
import Hongxing from '@/views/content/components/Hongxing.vue'
import Quanshui from "@/views/content/components/Quanshui.vue";
import Yingmenkou from "@/views/content/components/Yingmenkou.vue";
import Jinquan from "@/views/content/components/Jinquan.vue";
import Xibeiqiao from "@/views/content/components/Xibeiqiao.vue";
import Huangzhong from "@/views/content/components/Huangzhong.vue";
import AlarmEvent from '@/views/content/components/AlarmEvent.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
//2.配置路由映射
const routes = [
  {
    path: "/",
    component: Home,
    meta: { requestAuth: false },
  },
  {
    path: "/login",
    component: Login,
    meta: { requestAuth: false },
  },
  {
    name: "home",
    path: "/home",
    component: Home,
    meta: { requestAuth: false },
    children: [
      {
        name: "map",
        path: "map", //子组件的path不以/开头
        component: Home, //() => import('@/views/home/components/MapView.vue')
      },
    ],
  },

  {
    name: "content",
    path: "/content",
    component: Content,
    meta: { requestAuth: false },
    children: [
      {
        name: "alarmEvent",
        path: "alarmEvent",
        component: AlarmEvent,
        meta: { requestAuth: false },
      },
      {
        name: "carRecord",
        path: "carRecord",
        component: CarRecord,
        meta: { requestAuth: false },
      },
      {
        name: "carWarning",
        path: "carWarning",
        component: CarWarning,
        meta: { requestAuth: false },
      },
      {
        name: "osmoticFluid",
        path: "osmoticFluid",
        component: OsmoticFluid,
        meta: { requestAuth: false },
      },

      {
        name: "xihuaShenlvye",
        path: "xihuaShenlvye",
        component: XihuaShenlvye,
        meta: { requestAuth: false },
      },
      {
        name: "hongxingShenlvye",
        path: "hongxingShenlvye",
        component: HongxingShenlvye,
        meta: { requestAuth: false },
      },
      {
        name: "jinniu",
        path: "jinniu", //子组件的path不以/开头
        component: () => import("@/views/content/components/Jinniu.vue"),
      },
      {
        name: "smallstations",
        path: "smallstations", //子组件的path不以/开头
        component: () => import("@/views/content/components/SmallStations.vue"),
      },
      {
        name: "hongxing",
        path: "hongxing", //子组件的path不以/开头
        component: Hongxing,
      },
      {
        name: "quanshui",
        path: "quanshui", //子组件的path不以/开头
        component: Quanshui,
      },
      {
        name: "yingmenkou",
        path: "yingmenkou", //子组件的path不以/开头
        component: Yingmenkou,
      },
      {
        name: "jinquan",
        path: "jinquan", //子组件的path不以/开头
        component: Jinquan,
      },
      {
        name: "xibeiqiao",
        path: "xibeiqiao", //子组件的path不以/开头
        component: Xibeiqiao,
      },
      {
        name: "huangzhong",
        path: "huangzhong", //子组件的path不以/开头
        component: Huangzhong,
      },
      {
        name: "xihua",
        path: "xihua", //子组件的path不以/开头
        component: () => import("@/views/content/components/Xihua.vue"),
      },
      {
        name: "honghuayan",
        path: "honghuayan", //子组件的path不以/开头
        component: () => import("@/views/content/components/Honghuayan.vue"),
      },
      {
        name: "wukuaishi",
        path: "wukuaishi", //子组件的path不以/开头
        component: () => import("@/views/content/components/Wukuaishi.vue"),
      },
      {
        name: "wulidun",
        path: "wulidun", //子组件的path不以/开头
        component: () => import("@/views/content/components/Wulidun.vue"),
      },
      {
        name: "cardetailinfo",
        path: "cardetailinfo", //子组件的path不以/开头
        component: CarDetailInfo,
      },
    ],
  },
];

//3.创建路由实例
const router = createRouter({
    routes,
    // 没有#号
    // history: createWebHistory()
    // 有#号
    history: createWebHashHistory()
})

export default router;

