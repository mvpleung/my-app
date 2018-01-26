<template>
   <div class="homePage">
	   <p class="page-container">This is HomePage</p>
     <p v-if="$store.getters.isLogin">{{JSON.stringify($store.getters.user)}}</p>
   </div>
</template>

<script>
export default {
  name: 'homePage',
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped="scoped" lang="scss">
.homePage {
  .page-container {
    width: 100%;
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
    top: 35%;
    position: absolute;
  }
}
</style>