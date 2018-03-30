/*
 * 车牌选择
 * @Author: liangzc 
 * @Date: 2018-03-14 16:21:01 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 16:11:33
 */
<template>
  <div class="vehicle-select mint-cell">
    <span>
      <mt-cell :title="title"
        :class="holderClass"
        :is-link="!disabled"
        :value="holderVal"
        @click.native="open()" />
    </span>
    <mt-popup v-model="visible"
      position="bottom"
      class="mint-popup-data page-container">
      <span v-show="!showInput">
        <mt-spinner v-show="loading"
          type="triple-bounce"
          :size="60" />
        <mt-cell :title="popupTitle"
          v-show="!loading"
          class="mint-cell--noborder" />
        <div class="page-container-scroll">
          <mt-cell v-for="(record, index) in records"
            :key="index"
            v-show="!loading"
            :title="record"
            @click.native="select(record)" />
        </div>
        <div class="page-bottom-area"
          v-show="!loading">
          <mt-button size="large"
            type="primary"
            @click.native="showInput=!showInput">{{ buttonText }}</mt-button>
        </div>
      </span>
      <span v-show="showInput">
        <mt-cell title="车辆记录"
          icon="back"
          @click.native="showInput=false" />
        <mixed-keyboard :args="{presetNumber}"
          v-show="showInput"
          :callbacks="{oncompleted}" />
      </span>
    </mt-popup>
  </div>
</template>

<script type="text/babel">
import { MixedKeyboard } from 'vehicle-keyboard';
export default {
  name: 'vehicle-select',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '车牌号'
    },
    /**
     * 弹出层标题
     */
    popupTitle: {
      type: String,
      default: '最近车辆记录'
    },
    /**
     * 占位
     */
    placeHolder: {
      type: String,
      default: '请选择车牌'
    },
    /**
     * 按钮文本
     */
    buttonText: {
      type: String,
      default: '其他车牌'
    },
    /**
     * 是否高亮提示
     */
    isPrimary: {
      type: Boolean,
      default: false
    },
    value: '',
    /**
     * 样式
     */
    className: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    /**
     * 完成回调
     */
    complete: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      presetNumber: this.value || '',
      showInput: false,
      records: []
    };
  },
  created() {
    this.$nextTick(() => {
      document.querySelector('.page-container-scroll').style.height =
        window.innerHeight * 0.3 + 'px';
      this.$utils.bubbleScroll('.page-container-scroll');
      this.getPlateList();
    });
  },
  watch: {
    value(val) {
      this.presetNumber = val || '';
    },
    presetNumber(val) {
      this.$emit('input', val);
    }
  },
  computed: {
    holderClass() {
      return [
        this.className,
        this.isPrimary && this.$utils.isEmpty(this.presetNumber) ?
          'mint-cell--primary' :
          ''
      ];
    },
    holderVal() {
      return this.$utils.isEmpty(this.presetNumber) ?
        this.placeHolder :
        this.presetNumber;
    }
  },
  methods: {
    open() {
      !this.disabled && (this.visible = true);
    },
    clear() {
      this.presetNumber = '';
      this.open();
    },
    /**
     * 车牌录入完成
     * @param {String} presetNumber 车牌号码
     * @param {Boolean} isAutoCompleted 是否自动完成
     */
    oncompleted(presetNumber, isAutoCompleted) {
      if (!isAutoCompleted) {
        //点击确定时
        this.select(presetNumber);
      }
    },
    /**
     * 通过授权身份标识获取车辆记录
     */
    getPlateList() {
      const { id_type: idType, id } = this.$store.getters.user;
      this.loading = true;
      this.axios
        .get('v1/phtons/getPlateList', {
          params: { idType, id },
          silence: true
        })
        .then(resp => {
          this.loading = false;
          this.records = resp.plates;
          this.showInput = this.$utils.isEmptyArray(this.records);
        })
        .catch(err => {
          this.showInput = true;
          this.loading = false;
        });
    },
    /**
     * 选择车牌回调
     */
    select(record) {
      this.presetNumber = record;
      this.complete ? this.complete(record) : this.$emit('complete', record);
      this.visible = false;
    }
  },
  components: {
    MixedKeyboard
  }
};
</script>
<style lang="scss">
.vehicle-select.mint-cell {
  & > span > .mint-cell {
    border: none;
    background: none;
  }
  .mint-popup-bottom {
    min-height: 30%;
    max-height: 80%;
    .mint-spinner-triple-bounce {
      text-align: center;
      margin-top: 20%;
    }
    .page-container-scroll {
      overflow: scroll;
    }
  }
}
</style>
