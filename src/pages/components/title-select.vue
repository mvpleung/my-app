/*
 * 抬头选择
 * @Author: liangzc 
 * @Date: 2018-03-14 16:21:01 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 14:24:01
 */
<template>
  <div class="title-select mint-cell">
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
      <template>
        <mt-spinner v-show="loading"
          type="triple-bounce"
          :size="60" />
        <mt-cell :title="popupTitle"
          v-show="!loading">
          <router-link to="titlelist">管理抬头>></router-link>
        </mt-cell>
        <div v-show="titleList.length>0"
          class="page-container-scroll">
          <mt-cell v-for="(title, index) in titleList"
            :key="index"
            v-show="!loading"
            @click.native="select(title)"
            class="mint-cell--large">
            <template slot="title">
              <span class="mint-cell-text">
                {{ title.name }}
                <mt-badge size="small"
                  v-if="['1', '2'].find(item => item === title.type)"
                  color="#abaaaa">
                  {{ title.type | titleType }}
                </mt-badge>
              </span>
              <span class="mint-cell-label">
                联系电话
              </span>
              <span class="mint-cell-label">
                电子邮箱
              </span>
              <span v-if="title.type === '2'"
                class="mint-cell-label">
                企业税号
              </span>
            </template>
            <template>
              <span class="mint-cell-label ignore">
                {{ title.phone }}
              </span>
              <span class="mint-cell-label ignore">
                {{ title.eMail }}
              </span>
              <span v-if="title.type === '2'"
                class="mint-cell-label ignore">
                {{ title.businessTax }}
              </span>
            </template>
          </mt-cell>
        </div>
        <div class="page-bottom-area"
          v-show="!loading && titleList.length === 0">
          <mt-button size="large"
            type="primary"
            @click.native="addTitle">{{ buttonText }}</mt-button>
        </div>
      </template>
    </mt-popup>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'title-select',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '发票抬头'
    },
    /**
     * 弹出层标题
     */
    popupTitle: {
      type: String,
      default: '选择发票抬头'
    },
    /**
     * 占位
     */
    placeHolder: {
      type: String,
      default: '请选择发票抬头'
    },
    /**
     * 按钮文本
     */
    buttonText: {
      type: String,
      default: '新增发票抬头'
    },
    /**
     * 是否高亮提示
     */
    isPrimary: {
      type: Boolean,
      default: false
    },
    value: {},
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
      titleInfo: this.value || {},
      titleList: []
    };
  },
  created() {
    this.$nextTick(() => {
      document.querySelector('.page-container-scroll').style.height =
        window.innerHeight * 0.6 + 'px';
      this.$utils.bubbleScroll('.page-container-scroll');
      this.getTitleList();
      this.$bus.on('refreshTitle', title => {
        this.getTitleList();
      });
    });
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.titleInfo = val || '';
      },
      deep: true
    },
    titleInfo: {
      handler(val, oldVal) {
        this.$emit('input', val);
      },
      deep: true
    }
  },
  computed: {
    holderClass() {
      return [
        this.className,
        this.isPrimary &&
        (this.$utils.isEmptyObject(this.titleInfo) ||
          this.$utils.isEmpty(this.titleInfo.id)) ?
          'mint-cell--primary' :
          ''
      ];
    },
    holderVal() {
      return this.$utils.isEmptyObject(this.titleInfo) ?
        this.placeHolder :
        this.titleInfo.name;
    }
  },
  filters: {
    titleType(type) {
      return type === '1' ? '个人' : type === '2' ? '单位' : '';
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
     * 通过授权身份标识获取车辆记录
     */
    getTitleList() {
      this.loading = true;
      this.axios
        .get('v1/phtons/invoiceHeaderList', {
          params: {
            phone: this.$store.getters.user.mobile
          },
          silence: true
        })
        .then(resp => {
          this.loading = false;
          this.titleList = resp.result_data || [];
        })
        .catch(err => {
          this.loading = false;
        });
    },
    /**
     * 新增发票抬头
     */
    addTitle() {
      this.$utils.removeSessionItem('titleInfo');
      this.$router.push('edittitle');
    },
    /**
     * 选择抬头回调
     */
    select(title) {
      this.titleInfo = title;
      this.complete ? this.complete(title) : this.$emit('complete', title);
      this.visible = false;
    }
  }
};
</script>
<style lang="scss">
.title-select.mint-cell {
  .mint-cell {
    border: none;
    background: none;
  }
  .mint-popup-bottom {
    width: 100%;
    min-height: 40%;
    max-height: 80%;
    .mint-spinner-triple-bounce {
      text-align: center;
      margin-top: 20%;
    }
    .page-container-scroll {
      overflow: auto;
      .mint-cell--large {
        .mint-cell-value {
          display: block;
          text-align: right;
          flex: 2;
          .mint-cell-label.ignore {
            &:last-child {
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>
