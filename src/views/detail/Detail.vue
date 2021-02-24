<template>
  <div class="detail">
    <DetailNavBar class="detail-nav" ref="detaiNav" @titleClick="titleClick"></DetailNavBar>
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pullUpLoad="true"
      @contentOffset="contentOffset"
    >
      <DetailSwiper :topImages="topImages"></DetailSwiper>
      <DetailBaseInfo :goods="goods"></DetailBaseInfo>
      <DetailShopInfo :shop="shop"></DetailShopInfo>
      <DetailGoodsInfo :detailInfo="detailInfo" @detailImageLoad="detailImageLoad"></DetailGoodsInfo>
      <DetailParamInfo :paramInfo="paramInfo" ref="paramInfo"></DetailParamInfo>
      <DetailCommentInfo
        :commentInfo="commentInfo"
        ref="commentInfo"
      ></DetailCommentInfo>
      <GoodsList :goods="recommends" ref="recommends"></GoodsList>
    </Scroll>
    <DetailBottomBar @addToCart="addToCart"></DetailBottomBar>
    <BackTop @click.native="backTopClick" v-show="isBackTopShow"></BackTop>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/content/scroll/Scroll";

import {
  getDetailMultidata,
  getRecommends,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

import { backTopMixin, itemListernerMixin } from "@/common/mixin";


export default {
  name: "Detail",
  data() {
    return {
      iid: "",
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      detailOffsetTop: [],
      currentIndex: 0,
    };
  },
  mixins: [itemListernerMixin, backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    Scroll,
    DetailBottomBar,
  },
  created() {
    this.iid = this.$route.params.iid;
    getDetailMultidata(this.iid).then((res) => {
      const data = res.result;

      this.topImages = res.result.itemInfo.topImages;
      this.goods = new Goods(
        data.itemInfo,
        data.shopInfo.services,
        data.columns
      );
      this.shop = new Shop(data.shopInfo);
      this.detailInfo = data.detailInfo;
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0];
      }
      // 方法2 nextTick  不过此时DOM树做了 但是图片还没加载完毕 所以offsetTop值还是错误的
      // this.$nextTick()将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新
      // this.$nextTick(() => {
      //   this.detailOffsetTop = [];
      //   this.detailOffsetTop.push(0);
      //   this.detailOffsetTop.push(this.$refs.paramInfo.$el.offsetTop);
      //   this.detailOffsetTop.push(this.$refs.commentInfo.$el.offsetTop);
      //   this.detailOffsetTop.push(this.$refs.recommends.$el.offsetTop);
      //   console.log(this.detailOffsetTop);
      // });
    });
    getRecommends().then((res) => {
      this.recommends = res.data.list;
    });


  },
  mounted() {
    // 图片加载完成的事件监听,添加事件总线给this.$bus.$on("itemImageLoad"---！ 不过已经定义好在mixin中
  },
  destroyed() {
    // 离开、销毁 该页面的时候，关闭事件总线的监听
    this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
  updated(){
    // 方法1 在updated后获取元素的offsetTop  缺点：刷新频繁
    // this.detailOffsetTop = [];
    // this.detailOffsetTop.push(0);
    // this.detailOffsetTop.push(this.$refs.paramInfo.$el.offsetTop);
    // this.detailOffsetTop.push(this.$refs.commentInfo.$el.offsetTop);
    // this.detailOffsetTop.push(this.$refs.recommends.$el.offsetTop);
    // console.log(this.detailOffsetTop);
  },
  methods: {
    detailImageLoad() {
      // 中间图片区域全部加载后，执行bs插件的刷新
      this.newRefresh();
      // 刷新后，计算detailOffsetTop的4个值
      this.detailOffsetTop = [];
      this.detailOffsetTop.push(0);
      this.detailOffsetTop.push(this.$refs.paramInfo.$el.offsetTop);
      this.detailOffsetTop.push(this.$refs.commentInfo.$el.offsetTop);
      this.detailOffsetTop.push(this.$refs.recommends.$el.offsetTop);
      // push进一个很大的数字，代表页面总长度
      this.detailOffsetTop.push(99999);
      console.log(this.detailOffsetTop);
    },
    contentOffset(position) {
      this.isBackTopShow = -position.y > 800;

      let positionY = -position.y + 44;
      let length = this.detailOffsetTop.length;
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && positionY >= this.detailOffsetTop[i] && positionY < this.detailOffsetTop[i + 1]) {
          this.currentIndex = i;
          this.$refs.detaiNav.currentIndex = this.currentIndex;
        }
      }
    },
    titleClick(index) {
      // console.log(index,this.detailOffsetTop);
      // 不知道为何要+44  或许和css有关
      this.$refs.scroll.scroll.scrollTo(0, -this.detailOffsetTop[index] + 44, 500);
    },
    addToCart() {
      const shop = {};
      shop.iid = this.iid;
      shop.images = this.topImages[0];
      shop.title = this.goods.title;
      shop.desc = this.goods.desc;
      shop.realPrice = this.goods.realPrice;
      shop.discountDesc = this.goods.discountDesc;
      // this.$store.dispatch("addCart", shop).then(res => {
      //   this.$toast.shows(res);
      // });
      // 执行store中actions中的addCart方法
      // 也可以类同mapGetters mapActions  来映射store.actions中的方法到methods中
      // 则下面可以写成    this.addCart(shop).then( res=> { console.log(res) } )
      this.$store.dispatch("addCart", shop).then(res =>{
        console.log(res)
        this.$toast.shows(res);
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.detail {
  height: 100vh;
  position: relative;
  background-color: #fff;
  z-index: 666;
  .content {
    background-color: #fff;
    height: calc(100% - 102px);
  }
}
</style>
