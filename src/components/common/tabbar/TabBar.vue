<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tabbar",
  data() {
    return {
      msg: "Hello"
    };
  }
};
</script>

<style>
#tab-bar {
  display: flex;
  background-color: #ddd;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
