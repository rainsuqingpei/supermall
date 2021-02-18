<template>
  <div id="home">
    <NavBar class="home-nav">
      <div slot="center">购物街</div>
    </NavBar>
    <div>
      <Scroll class="content" ref="scroll" :probeType="3" :pullUpLoad="true" @contentOffset="contentOffset">
        <HomeSwiper :banners="banners"></HomeSwiper>
        <HomeRecommendView :recommend="recommend"></HomeRecommendView>
        <HomeFeatureView />
        <TabControl
          class="tab-control"
          :titles="['流行', '新款', '精选']"
          @tabClick="tabClick"
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
      isBackTopShow: false
    };
  },
  created() {
    this.getHomeMultidata();
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
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
      // this.$refs.tabControl1.currentIndex = index;
      // this.$refs.tabControl2.currentIndex = index;
    },
    contentOffset(position) {
      this.isBackTopShow = -position.y > 200;
      // this.isTabFixed = -position.y > this.tabOffsetTop;
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
}
</style>
