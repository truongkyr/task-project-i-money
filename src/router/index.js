import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from 'firebase/auth';

const requiredAuth = (to, from, next) =>{
  const auth = getAuth();
  const user = auth.currentUser;

  if(!user) next({name: 'Login', params:{} })
  else next();
}
const routes = [
  {
    path: "/",
    name: "home",
    meta:{
      text: "Chào mừng bạn đến với iMoney!",
      leading: true,
      isShowFooter: true,
    },
    component: () => import("@/views/homeView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/registerView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/loginView.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      text:"Thông tin của bạn",
      leading: false,
      isShowFooter: true,
    },
    component: () => import("@/views/profileView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/views/logoutView.vue"),
  },
  {
    path: "/report",
    name: "Report",
    meta:{
      text: "Báo cáo số dư hàng tháng",
      leading: false,
      isShowFooter: true,
    },
    component: () => import("@/views/reportView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/budget",
    name: "Budget",
    meta:{
      text: "Biểu đồ",
      leading: false,
      isShowFooter: true,
    },
    component: () => import("@/views/budgetView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/new-transaction",
    name: "NewTransaction",
    meta:{
      text: "Thêm loại chi tiêu",
      leading: false,
      isShowFooter: false,
    },
    component: () => import("@/views/newTransactionView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/new-income",
    name: "NewIncome",
    meta:{
      text: "Thêm loại thu nhập",
      leading: false,
      isShowFooter: false,
    },
    component: () => import("@/views/newIncomeView.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/report-quarter",
    name: "ReportQuarter",
    meta:{
      text: "Báo cáo số dư theo quý",
      leading: false,
      isShowFooter: false,
    },
    component: () => import("@/views/reportQuarter.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/report-year",
    name: "ReportYear",
    meta:{
      text: "Báo cáo số dư theo năm",
      leading: false,
      isShowFooter: false,
    },
    component: () => import("@/views/reportYear.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/about",
    name: "About",
    meta:{
      text: "Về chúng tôi",
      leading: false,
      isShowFooter: false,
    },
    component: () => import("@/views/aboutView.vue"),
    beforeEnter: requiredAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
