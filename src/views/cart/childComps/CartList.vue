<template>
  <div class="cartList">
    <scroll v-if="cartList.length > 0" class="content" ref="scroll">
      <!-- 这里的传入子属性 cartList其实应该改个名字比较好..  -->
      <CartListItem v-for="(item, index) in cartList" :key="index" :cartList="item"></CartListItem>
    </scroll>
    <p v-else>尚无商品 请前往添加商品</p>
  </div>
</template>
<script>
import CartListItem from "./CartListItem";

import Scroll from "components/content/scroll/Scroll";

import { mapGetters } from "vuex";
export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem,
  },
  computed: {
    // map store.getter中的所有方法为computed属性=》自己的属性
    ...mapGetters(["cartList"]),
  },
  activated() {
    // 进入页面时候，如果有购物车商品，则需要先更新一次scroll插件
    if(this.cartList.length > 0){
      this.$refs.scroll.refresh();
    }
  },
};
</script>
<style lang="scss" scoped>
.cartList {
  height: calc(100% - 44px -44px);
  padding-bottom: 49px;
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>