<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <MainTabBar />
  </div>
</template>

<script>
import MainTabBar from "components/content/mainTabBar/MainTabBar";

// aaa
// bbb
// test ccc
// this is branch 2
export default {
  name: "App",
  components: {
    MainTabBar
  }
};
</script>

<style>
@import "assets/css/base.css";
</style>
