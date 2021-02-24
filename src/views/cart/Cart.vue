<template>
  <div class="cart">
    <NavBar class="homeStyle">
      <slot slot="center">购物车({{ cartListLength }})</slot>
    </NavBar>
    <CartList class="car-list"></CartList>
    <BottomBar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import BottomBar from "./childComps/BottomBar";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    BottomBar
  },
  data() {
    return {
      msg: "Hello",
    };
  },
  computed: {
    // 三种写法
    // <p>{{ $store.state.cartList.length }}</p>
    // <p>{{ $store.getters.cartListLength }}</p>
    // <p>{{ cartListLength }}</p>
    // map store.getter中的所有方法为computed属性
    ...mapGetters(["cartListLength", "cartList"])
  }
};
</script>

<style lang="scss" scoped>
.cart {
  width: 100%;
  height: 100vh;
  background-color: #fff;
}
.homeStyle {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 888;
  background-color: var(--color-tint);
  color: #fff;
}
.car-list {
  position: absolute;
  top: 44px;
  bottom: 55px;
  width: 100%;
}
</style>
