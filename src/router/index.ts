import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import layout from "../layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: layout,
    name: "layout",
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("../view/home/index.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/personnel",
        name: "personnel",
        component: () => import("../view/personnel/index.vue"),
        meta: {
          title: "人员数据",
        },
      },
      {
        path: "/equipment",
        name: "equipment",
        component: () => import("../view/equipment/index.vue"),
        meta: {
          title: "设备数据",
        },
      },
      {
        path: "/materials",
        name: "materials",
        component: () => import("../view/materials/index.vue"),
        meta: {
          title: "物料数据",
        },
      },
      {
        path: "/craftsmanship",
        name: "craftsmanship",
        component: () => import("../view/craftsmanship/index.vue"),
        meta: {
          title: "工艺数据",
        },
      },
      {
        path: "/environment",
        name: "environment",
        component: () => import("../view/environment/index.vue"),
        meta: {
          title: "环境数据",
        },
      },
      {
        path: "/incident",
        name: "incident",
        component: () => import("../view/incident/index.vue"),
        meta: {
          title: "事件管理",
        },
      },
      {
        path: "/riskassessment",
        name: "riskassessment",
        component: () => import("../view/riskassessment/index.vue"),
        meta: {
          title: "风险评估",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
