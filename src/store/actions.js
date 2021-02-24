import { ADDCOUNT, ADDTOCART, ADDCOUNTS, DESCOUNTS } from './mutations-types'
export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        // 执行mutations中的addCount方法 注意context对象会跟踪oldProduct，其又源于state，达到自动更新
        context.commit(ADDCOUNT, oldProduct)
        resolve('商品数量+1 !');
      } else {
        payload.count = 1
        // 执行mutations中的addToCart方法 注意context对象会跟踪state
        context.commit(ADDTOCART, payload)
        resolve('商品添加成功 !');
      }
    })
  },
  addCartListCount(context, payload) {
    context.commit(ADDCOUNTS, payload);
  },
  desCartListCount(context, payload) {
    context.commit(DESCOUNTS, payload);
  },
}