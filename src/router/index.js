import Vue from "vue";
import Router from "vue-router";
const Home = () => import("views/home/Home");
const Category = () => import("views/category/Category");
const Cart = () => import("views/cart/Cart");
const Profile = () => import("views/profile/Profile");

// 1 安装插件
Vue.use(Router);

// 2 创建路由对象
const routes = [
  {
    path: "",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "首页"
    },
    component: Home
  },
  {
    path: "/category",
    name: "Category",
    meta: {
      title: "分类"
    },
    component: Category
  },
  {
    path: "/cart",
    name: "Cart",
    meta: {
      title: "购物车"
    },
    component: Cart
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      title: "我的"
    },
    component: Profile
  }
];
const router = new Router({
  routes: routes,
  mode: "history"
});
export default router;
