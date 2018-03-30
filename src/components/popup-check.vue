/*
 * 弹出选择层
 * @Author: liangzc 
 * @Date: 2018-02-01 17:44:59 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-23 15:38:54
 */
<template>
  <popup ref="popupCheck"
    :title="title"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    @close="close"
    @confirm="ok"
    class="mint-popup-check">
    <slot name="content" />
    <mt-radio v-show="showControl"
      v-model="controlCheck"
      align="right"
      :options="[controlTitle]" />
    <mt-checklist v-if="multiple"
      v-model="checkList"
      align="right"
      :options="checkOptions" />
    <mt-radio v-else
      v-model="checkRadio"
      align="right"
      :options="checkOptions" />
  </popup>
</template>

<script type="text/babel">
import Popup from './popup';
export default {
  name: 'popup-check',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * 是否显示控制项
     */
    showControl: {
      type: Boolean,
      default: true
    },
    /**
     * 控制标题
     */
    controlTitle: {
      type: String,
      default: ''
    },
    /**
     * 取消键文本
     */
    cancelText: {
      type: String
    },
    /**
     * 确认键文本
     */
    confirmText: {
      type: String
    },
    /**
     * 是否为多选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 选择项
     */
    options: {
      type: Array,
      default: () => []
    },
    /**
     * 取消监听
     */
    cancel: {
      type: Function
    },
    /**
     * 确认监听
     */
    confirm: {
      type: Function
    },
    /**
     * label 对应得取值key
     */
    labelKey: {
      type: String,
      default: 'label'
    },
    /**
     * vaule 对应得取值key
     */
    valueKey: {
      type: String,
      default: 'value'
    },
    value: null
  },
  data() {
    return {
      controlCheck: null,
      checkOptions: [],
      checkList: [],
      checkRadio: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.$utils.bubbleScroll('.mint-popup-content');
      Array.from(
        document.querySelectorAll(
          '.mint-popup-check .mint-popup-content .mint-radiolist>label'
        )
      ).forEach(el => el.remove());
      Array.from(
        document.querySelectorAll(
          '.mint-popup-check .mint-popup-content .mint-checklist>label'
        )
      ).forEach(el => el.remove());
    });
    this.filterOptions();
  },
  watch: {
    value: {
      handler(val) {
        if (this.multiple) {
          this.checkList = Array.isArray(val) ? val : [val];
        } else {
          this.checkRadio =
            Object.prototype.toString.call(val) === '[object Object]' ?
              val[this.valueKey] :
              val;
        }
      },
      deep: true
    },
    options(val) {
      this.filterOptions();
    },
    controlCheck(val) {
      if (val && val.length > 0) {
        this.checkList = [];
        this.checkRadio = null;
      }
    },
    checkList(val) {
      if (val.length > 0) this.controlCheck = null;
    },
    checkRadio(val) {
      if (val && val !== '') this.controlCheck = null;
    }
  },
  methods: {
    open() {
      document.body.addEventListener(
        'touchmove',
        e => {
          e.preventDefault();
        },
        false
      );
      this.$refs.popupCheck.open();
    },
    close() {
      this.cancel && this.cancel();
    },
    filterOptions() {
      if (
        Object.prototype.toString.call(this.options[0]) === '[object Object]'
      ) {
        this.checkOptions = this.options.map(option => {
          return {
            label: option[this.labelKey],
            value: option[this.valueKey],
            disabled: option.disabled
          };
        });
      } else {
        this.checkOptions = this.options;
      }
    },
    ok() {
      let result = [];
      if (this.multiple) {
        if (this.checkList.length > 0) {
          result = this.options.find(option =>
            this.checkList.some(check => check.value === option[this.valueKey])
          );
        }
      } else {
        result = this.options.find(
          check => check[this.valueKey] === this.checkRadio
        );
      }
      this.confirm && this.confirm(result);
      this.$emit('confirm', result);
    }
  },
  components: {
    Popup
  }
};
</script>
<style lang="scss">
.mint-popup-check {
  &.mint-popup-data {
    width: 100%;
    height: 70%;
    .mint-popup-content {
      -webkit-overflow-scrolling: touch; /* ios 自带滚动条不平滑解决方法 */
    }
    .mint-radiolist {
      margin-bottom: 30px;
    }
  }
}
</style>