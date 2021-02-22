<template>
  <div class="detail">
    <DetailNavBar class="detail-nav" ref="detaiNav"></DetailNavBar>
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
  },
  created() {
    this.iid = this.$route.params.iid;
    console.log(this.$route);
    getDetailMultidata(this.iid).then((res) => {
      const data = res.result;
      console.log(data);

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
  methods: {
    detailImageLoad() {
      this.newRefresh();
      // this.getDetailOffsetTop();
    },
    contentOffset(position) {
      this.isBackTopShow = -position.y > 800;
    },
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
    height: calc(100% - 44px);
  }
}
</style>
