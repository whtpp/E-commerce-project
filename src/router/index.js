import Vue from "vue";
import Router from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/users/User.vue";
import Right from "../components/power/Right.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/Welcome",
      children: [
        { path: "/Welcome", component: Welcome },
        { path: "/Users", component: User },
        { path: "/Rights", component: Right },
        { path: "/Roles", component: Roles },
        { path: "/Categories", component: Cate },
        { path: "/Params", component: Params }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) {
    return next("/login");
  }
  next();
});
export default router;
