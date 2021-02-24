import { ADDCOUNT, ADDTOCART, ADDCOUNTS, DESCOUNTS } from './mutations-types'
export default {
  [ADDCOUNT](state, payload) {
    payload.count++;
  },
  [ADDTOCART](state, payload) {
    // 默认加入购物车后就被选中
    payload.checked = true;
    state.cartList.push(payload);
  },
  [ADDCOUNTS](state, payload) {
    payload.cartList.count++;
  },
  [DESCOUNTS](state, payload) {
    if (payload.cartList.count > 1) {
      payload.cartList.count--;
    }
  },
}