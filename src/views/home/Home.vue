<template>
  <div id="home">
    <NavBar class="home-nav">
      <div slot="center">购物街</div>
    </NavBar>
    <TabControl
      v-show="isTabFixed"
      class="tab-control1"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
    ></TabControl>
    <div>
      <Scroll
        class="content"
        ref="scroll"
        :probeType="3"
        :pullUpLoad="true"
        @contentOffset="contentOffset"
        @pullingUp="loadMore">
        <HomeSwiper :banners="banners" @swiperItemLoadImg="swiperItemLoadImg"></HomeSwiper>
        <HomeRecommendView :recommend="recommend"></HomeRecommendView>
        <HomeFeatureView />
        <TabControl
          class="tab-control2"
          :titles="['流行', '新款', '精选']"
          @tabClick="tabClick"
          ref="tabControl2"
        ></TabControl>
        <GoodsList :goods="showGoodsType"></GoodsList>
      </Scroll>
    </div>
    <BackTop @click.native="backTopClick" v-show="isBackTopShow"></BackTop>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommendView from "./childComps/HomeRecommendView";
import HomeFeatureView from "./childComps/HomeFeatureView";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/content/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

import { debouce } from "@/common/utils";
import { getHomeMultidata, getHomeGoods } from "network/home";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommend: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      isBackTopShow: false,
      saveY: 0
    };
  },
  created() {
    this.getHomeMultidata();
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getContentY();
    // this.$bus.$off("itemImgLoad", this.itemImgListener);
  },
  mounted() {
    // 图片加载完成的事件监听
    let refresh = debouce(this.$refs.scroll.refresh, 150);
    this.$bus.$on("itemImageLoad", () => {
      refresh()
    });
  },
  methods: {
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommend = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //上拉加载更多,需要关闭当前的滚动状态
        this.$refs.scroll.finishPullUp();
      });
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 使得虚假与真实的两个tabControl的currentIndex保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
      // 点击切换tabControl后 会自动滚动到展示第一个物品的位置
      this.$refs.scroll.scrollTo(0, -(this.tabOffsetTop - 40), 0);
    },
    contentOffset(position) {
      this.isBackTopShow = -position.y > 800;
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperItemLoadImg() {
      // 获取tab control的距离顶部位置
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    backTopClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    }
  },
  computed: {
    showGoodsType() {
      return this.goods[this.currentType].list;
    },
  },
};
</script>

<style lang="scss" scoped>
#home {
  position: relative;
  top: 0;
  left: 0;
  height: calc(100vh - 49px);
  overflow: hidden;
  .home-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    height: calc(100vh - 49px);
  }
  .tab-control1 {
    position: relative;
    top: 44px;
    left: 0;
    z-index: 999;
    background-color: #fff;
  }
}
</style>
