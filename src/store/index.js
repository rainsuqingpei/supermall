import Vue from "vue";
import Vuex from "vuex";
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 安装并用上Vuex插件
Vue.use(Vuex);

const state = {
  cartList: []
}

// 创建store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})

// 导出并挂载在Vue实例上
export default store
