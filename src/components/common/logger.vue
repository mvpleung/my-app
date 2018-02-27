<template>
  <div class="logger-container">
    <mt-switch v-model="config.console">日志开关{{ config.console }}</mt-switch>
    <mt-field placeholder="手动输入路径跳转"
      v-model="path"
      disable-clear>
      <mt-button size="small"
        @click.native="$router.push(path)">GO</mt-button>
    </mt-field>
    <p>修改配置，请返回刷新页面</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: window.$globalConfig,
      path: ''
    };
  },
  watch: {
    config: {
      handler(val, oldVal) {
        window.$globalConfig = this.config;
        try {
          sessionStorage.$globalConfig = JSON.stringify(this.config);
        } catch (error) {}
      },
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.logger-container {
  padding: 25px;
  .mint-field {
    margin-top: 25px;
  }
  p {
    margin-top: 80px;
    color: red;
  }
}
</style>