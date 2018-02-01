/*
 * 九宫格子项
 * @Author: liangzc 
 * @Date: 2018-02-01 15:27:15 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-01 17:29:59
 */
<template>
  <a href="javascript:;" class="weui-grid" @click="onClick" :style="style">
    <div class="weui-grid__icon" v-if="hasIconSlot || icon">
      <slot name="icon"><img :src="icon" alt=""></slot>
    </div>
    <p v-if="hasLabelSlot || label" class="weui-grid__label">
      <slot name="label">
        <span v-html="label"></span>
      </slot>
    </p>
    <slot></slot>
  </a>
</template>
<script>
export default {
  name: 'grid-item',
  props: {
    /**
     * 标签文本
     */
    label: String,
    /**
     * 图片地址
     */
    icon: String,
    /**
     * 路由地址，可选值['BACK', { replace: true }, '']
     */
    link: String
  },
  data() {
    return {
      hasIconSlot: false,
      hasLabelSlot: false
    };
  },
  mounted() {
    this.$slots.icon && (this.hasIconSlot = true);
    this.$slots.label && (this.hasLabelSlot = true);
  },
  computed: {
    /**
     * 动态调整宽度
     */
    style() {
      const column = this.$parent.column;
      if (!column || column === 3) {
        return;
      }
      return {
        width: `${100 / column}%`
      };
    }
  },
  methods: {
    onClick() {
      this.$emit('item-click');
      if (/^javas/.test(this.link) || !this.link) return;
      const useRouter =
        typeof this.link === 'object' ||
        ($router && typeof this.link === 'string' && !/http/.test(this.link));
      if (useRouter) {
        if (typeof this.link === 'object' && this.link.replace === true) {
          $router.replace(this.link);
        } else {
          this.link === 'BACK' ? $router.go(-1) : $router.push(this.link);
        }
      } else {
        window.location.href = this.link;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.weui-grid {
  position: relative;
  float: left;
  padding: 20px 10px;
  width: calc(100% /3);
  box-sizing: border-box;
  .weui-grid__icon {
    width: 28px;
    height: 28px;
    margin: 0 auto;
  }
  .weui-grid__icon + .weui-grid__label {
    margin-top: 5px;
  }
  .weui-grid__label {
    display: block;
    text-align: center;
    color: #000000;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .weui-grid__icon img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.weui-grid:before {
  content: ' ';
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
.weui-grid:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.weui-grid:active {
  background-color: #ececec;
}
</style>


