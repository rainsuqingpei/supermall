import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import toast from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'fastclick'
// FastClick插件-解决移动端300ms延迟的问题  npm安装后再加上上下2行即可
FastClick.attach(document.body)

Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('./assets/images/common/placeholder.jpg')
})
Vue.use(toast)
Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
