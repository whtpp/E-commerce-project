// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import {
  Form,
  Button,
  FormItem,
  Input,
  Message,
  Header,
  Aside,
  Main,
  Container,
  Submenu,
  Menu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import "./assets/login.css";
import "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Container);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(BreadcrumbItem);
Vue.use(Breadcrumb);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  console.log(config);
  return config;
});
Vue.prototype.$http = axios;
Vue.component("tree-table", TreeTable);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
