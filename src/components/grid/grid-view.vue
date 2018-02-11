/*
 * 九宫格
 * @Author: liangzc 
 * @Date: 2018-02-01 15:27:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:18:05
 */
<template>
  <div class="weui-grids">
    <slot name="grid">
      <grid-item v-for="(item, key) in items"
        :key="key"
        :label="item[labelKey]"
        :subLabel="item[subLabelKey]"
        :icon="item[iconKey]"
        :link="item[linkKey]" />
    </slot>
  </div>
</template>
<script>
export default {
  name: 'grid-view',
  props: {
    /**
     * 列数
     */
    cols: Number,
    /**
     * 数据列表
     */
    items: {
      type: Array,
      default: () => []
    },
    /**
     * label 标签取值key
     */
    labelKey: {
      type: String,
      default: 'label'
    },
    /**
     * subLabel 副标签取值key
     */
    subLabelKey: {
      type: String,
      default: 'subLabel'
    },
    /**
     * icon 标签取值key
     */
    iconKey: {
      type: String,
      default: 'icon'
    },
    /**
     * link 标签取值key
     */
    linkKey: {
      type: String,
      default: 'link'
    }
  },
  data() {
    return {
      childrenSize: 3
    };
  },
  computed: {
    /**
     * 列数
     */
    column() {
      return this.cols || this.childrenSize;
    },
    hasSlot() {
      return this.$slots.grid != null;
    }
  },
  components: {
    'grid-item': this.hasSlot ? null : require('./grid-item')
  }
};
</script>
<style lang="scss">
.weui-grids {
  position: relative;
  overflow: hidden;
}
.weui-grids:before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.weui-grids:after {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-left: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
</style>


