<template>
  <div class="shop-item">
    <div class="item-selector">
      <CheckButton :isChecked="cartList.checked" @click.native="checkedChange"></CheckButton>
    </div>
    <div class="item-img">
      <img :src="cartList.images" alt="商品图片" />
    </div>
    <div class="item-info">
      <div class="item-title">{{ cartList.title }}</div>
      <div class="item-desc" @click="goToDetail">商品描述: {{ cartList.desc }}</div>
      <div class="info-bottom">
        <div class="item-price left">¥{{ cartList.realPrice }}</div>
        <div class="item-count right">
          <span class="btn-l" @click="desCartList">-</span>
          {{ cartList.count }}
          <span class="btn-r" @click="addCartList">+</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartListItem",
  props: {
    cartList: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    CheckButton,
  },
  methods: {
    checkedChange() {
      this.cartList.checked = !this.cartList.checked;
    },
    addCartList() {
      this.$store.dispatch({
        type: "addCartListCount",
        cartList: this.cartList,
      });
    },
    desCartList() {
      this.$store.dispatch({
        type: "desCartListCount",
        cartList: this.cartList,
      });
    },
    goToDetail() {
      console.log(this.cartList.iid);
      this.$router.push("/detail/"+this.cartList.iid)
    }
  },
};
</script>
<style lang="scss" scoped>
.shop-item {
  width: 100%;
  padding: 8px 0;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .item-selector {
    width: 50px;
    height: 100px;
    display: flex;
    padding: 5px;
    justify-content: center;
    align-items: center;
  }
  .item-img {
    width: 80px;
    height: 100px;
    img {
      width: 80px;
      height: 100px;
      display: block;
      border-radius: 5px;
    }
  }
  .item-info {
    width: 72%;
    height: 100px;
    padding: 0 8px;
    .info-bottom {
      position: relative;
      .item-price {
        position: absolute;
        left: 0;
        top: 15px;
      }
      .item-count {
        position: absolute;
        right: 5%;
        top: 18px;
      }
    }
    .item-title,
    .item-desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    span {
      width: 20px;
      height: 20px;
      padding: 3px 6px 3px;
      margin: 0 5px;
      text-align: center;
      border: 1px solid #e5e5e5;
      box-shadow: 1px 4px 4px #fff;
    }
    .btn-l {
      padding: 3px 8px 3px;
    }
  }
}
</style>