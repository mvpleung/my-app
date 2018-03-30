/*
 * 车牌录入(闲置未用)
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-12 10:53:33
 */
<template>
  <div class="vehicle-input">
    <!-- <mt-field label="车牌号"
      placeholder="请选择车牌号码"
      v-model="presetNumber"
      @click.native="keyboardVisible = !keyboardVisible"
      disabled /> -->
    <mixed-keyboard :args="{presetNumber}"
      :callbacks="{oncompleted, onkeypressed}">
      <div class="page-bottom-area">
        <mt-button type="primary"
          size="large"
          :disabled="$utils.isEmpty(presetNumber)"
          @click.native="next">下一步</mt-button>
      </div>
    </mixed-keyboard>
    <mt-popup v-model="keyboardVisible"
      position="bottom">
      <mixed-keyboard :args="{presetNumber}"
        :callbacks="{oncompleted, onkeypressed}" />
    </mt-popup>
  </div>
</template>
<script>
import { MixedKeyboard } from 'vehicle-keyboard';
export default {
  data() {
    return {
      presetNumber: '',
      keyboardVisible: false
    };
  },
  created() {
    document.setTitle('输入车牌');
  },
  methods: {
    /**
     * 车牌录入完成
     * @param {String} presetNumber 车牌号码
     * @param {Boolean} isAutoCompleted 是否自动完成
     */
    oncompleted(presetNumber, isAutoCompleted) {
      if (isAutoCompleted && this.presetNumber.length !== presetNumber.length) {
        this.keyboardVisible = !this.keyboardVisible;
        this.presetNumber = presetNumber;
      } else if (!isAutoCompleted) {
        //点击确定时
        this.presetNumber = presetNumber;
      }
    },
    /**
     * 键位按下监听
     * @param {Object} key 键位对象
     */
    onkeypressed(key) {
      if (key.FUN_OK) {
        this.keyboardVisible = !this.keyboardVisible;
      }
    },
    /**
     * 下一步
     */
    next() {
      if (this.$route.query.redirect) {
        this.go(`${this.$route.query.redirect}?plate=${this.presetNumber}`);
        this.$bus.emit('onPlateChoice', this.presetNumber);
      } else {
        let route = this.$store.getters.routeChain.slice(
          -2,
          this.$store.getters.chainLength - 1
        )[0];
        if (route) {
          this.go(`${route.path}?plate=${this.presetNumber}`);
          this.$bus.emit('onRecordBack', this.presetNumber);
        }
      }
    },
    go(path) {
      if (
        this.$route.query.callback &&
        this.$route.query.callback.indexOf('pay') >= 0
      ) {
        //存在支付跳转
        this.$utils.goPay(this, path);
      } else {
        this.$router.push(path);
      }
    }
  },
  components: {
    MixedKeyboard
  }
};
</script>
<style lang="scss">
.vehicle-input {
  .mint-field {
    padding-top: 25px;
    border: 0.51px #d9d9d9 solid;
  }
  .mixed-keyboard-box {
    height: 100%;
    margin-top: 30px;
    background: #fff;
    border: none;
    .input-widget {
      margin-left: 10px;
      margin-right: 10px;
    }
    .single-keyboard-box {
      height: 15rem;
      position: absolute;
      bottom: 0;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  .mint-popup.mint-popup-bottom {
    width: 100%;
  }
}
</style>


