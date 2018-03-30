/*
 * 弹出层
 * @Author: liangzc 
 * @Date: 2018-02-01 17:44:59 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-28 17:12:18
 */
<template>
  <mt-popup v-model="visible"
    :position="position"
    class="mint-popup-data">
    <div class="mint-popup-action">
      <span class="mint-popup-cancel"
        @click="close">{{ cancelText }}</span>
      <span class="mint-popup-title">{{ title }}</span>
      <span class="mint-popup-confirm"
        @click="confirm">{{ confirmText }}</span>
    </div>
    <div class="mint-popup-content">
      <slot />
    </div>
  </mt-popup>
</template>

<script type="text/babel">
export default {
  name: 'popup',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    position: {
      type: String,
      default: 'bottom'
    },
    /**
     * 显示/隐藏时的动效，仅在省略 position 时可配置
     */
    popTransition: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    };
  },
  mounted() {},
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$emit('cancel');
    },
    confirm() {
      this.visible = false;
      this.$emit('confirm');
    }
  }
};
</script>
<style lang="scss">
.mint-popup-data {
  width: 100%;
  height: auto;
  min-height: 50%;
  .mint-popup-action {
    display: inline-flex;
    width: 100%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    span {
      flex: 1;
    }
    .mint-popup-title {
      font-size: 18px;
    }
    .mint-popup-cancel {
      color: #26a2ff;
    }
    .mint-popup-confirm {
      color: #26a2ff;
    }
  }
  .mint-popup-content {
    height: 100%;
    overflow: auto;
  }
}
</style>