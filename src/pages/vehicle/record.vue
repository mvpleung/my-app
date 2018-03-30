/*
 * 车辆记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 15:41:58
 */
<template>
  <div class="vehicle-record">
    <div v-show="!showInput">
      <div class="page-header">
        <h3 class="page-header-title">最近车辆记录</h3>
      </div>
      <me-scroll ref="mescroll"
        class="page-container"
        :opt-up="{ empty: { tip: '暂无车辆记录' },use:false}"
        :opt-down="{autoShowLoading:true}"
        :down-callback="getPlateList">
        <mt-cell v-for="(record, index) in records"
          :key="index"
          :title="record"
          @click.native="presetNumber = record;next()"
          is-link
          class="mint-cell--large" />
      </me-scroll>
      <div class="page-bottom-area">
        <mt-button size="large"
          type="primary"
          @click.native="showInput=!showInput">其他车牌</mt-button>
      </div>
    </div>
    <div v-show="showInput">
      <mt-cell title="车辆记录"
        icon="back"
        @click.native="showInput=false" />
      <mixed-keyboard :args="{presetNumber}"
        :callbacks="{oncompleted}">
        <div class="page-bottom-area">
          <mt-button type="primary"
            size="large"
            :disabled="$utils.isEmpty(presetNumber)"
            @click.native="next">下一步</mt-button>
        </div>
      </mixed-keyboard>
    </div>
  </div>
</template>
<script>
import { MixedKeyboard } from 'vehicle-keyboard';
import Mescroll from 'vue-mescroll/mescroll';
export default {
  data() {
    return {
      presetNumber: '',
      showInput: false,
      records: []
    };
  },
  created() {
    document.setTitle('选择车辆');
  },
  methods: {
    /**
     * 车牌录入完成
     * @param {String} presetNumber 车牌号码
     * @param {Boolean} isAutoCompleted 是否自动完成
     */
    oncompleted(presetNumber, isAutoCompleted) {
      if (isAutoCompleted && this.presetNumber.length !== presetNumber.length) {
        this.presetNumber = presetNumber;
      } else if (!isAutoCompleted) {
        //点击确定时
        this.presetNumber = presetNumber;
      }
    },
    /**
     * 通过授权身份标识获取车辆记录
     */
    getPlateList() {
      const { id_type: idType, id } = this.$store.getters.user;
      this.axios
        .get('v1/phtons/getPlateList', {
          params: { idType, id },
          silence: true
        })
        .then(resp => {
          this.records = resp.plates;
          this.showInput = this.$utils.isEmptyArray(this.records);
          if (this.showInput) {
            this.$refs.mescroll.instance.showEmpty();
          }
          this.$refs.mescroll.instance.endErr();
        })
        .catch(err => {
          this.$refs.mescroll.instance.showEmpty();
          this.$refs.mescroll.instance.endErr();
        });
    },
    /**
     * 下一步
     */
    next() {
      if (this.$route.query.redirect) {
        this.go(
          this.$utils.setUrlParams(
            {
              plate: this.presetNumber
            },
            this.$route.query.redirect
          )
        );
      } else {
        let route = this.$store.getters.routeChain.slice(
          -2,
          this.$store.getters.chainLength - 1
        )[0];
        if (route) {
          this.go(`${route.path}?plate=${this.presetNumber}`);
        }
      }
      this.$bus.emit('onPlateChoice', this.presetNumber);
    },
    go(path) {
      if (path.startWith('/pay')) {
        //存在支付跳转
        this.$utils.goPay(this, path);
      } else {
        this.$router.push(path);
      }
    }
  },
  components: {
    MixedKeyboard,
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.vehicle-record {
  .page-container {
    height: 80%;
  }
  .mescroll + .page-bottom-area {
    position: fixed;
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
      button.key {
        font-size: 20px;
      }
    }
  }
}
</style>




