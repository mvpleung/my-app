/*
 * 选择发票抬头
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 15:50:56
 */
<template>
  <div class="invoice-title">
    <div class="page-header">
      <h3 class="page-header-title">发票抬头</h3>
    </div>
    <me-scroll ref="mescroll"
      class="page-container"
      :opt-up="{ empty: { tip: '暂无发票抬头' }, use:false}"
      :down-callback="getTitleList">
      <mt-cell v-for="(title, index) in titleList"
        :key="index"
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
          <span class="mint-cell-label">
            操作
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
          <span class="mint-cell-label ignore">
            <a @click="editTitle(title)">编辑</a>
            <a @click="deleteTitle(title)">删除</a>
          </span>
        </template>
      </mt-cell>
    </me-scroll>
    <div class="page-bottom-area"
      v-show="!loading">
      <mt-button size="large"
        type="primary"
        @click.native="addTitle">新增发票抬头</mt-button>
    </div>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  data() {
    return {
      loading: false,
      titleList: []
    };
  },
  created() {
    document.setTitle('发票抬头');
    this.$bus.on('refreshTitle', title => {
      if (this.$utils.isEmpty(title.id)) {
        //id不存在，新增
        this.getTitleList();
      } else {
        //编辑
        this.titleList = this.titleList.map(titleInfo => {
          return titleInfo.id === title.id ? title : titleInfo;
        });
      }
    });
  },
  activated() {
    this.$utils.removeSessionItem('titleInfo');
  },
  filters: {
    titleType(type) {
      return type === '1' ? '个人' : type === '2' ? '单位' : '';
    }
  },
  methods: {
    /**
     * 获取抬头列表
     */
    getTitleList() {
      this.loading = true;
      this.axios
        .get('v1/phtons/invoiceHeaderList', {
          params: {
            phone: this.$store.getters.user.mobile
          }
        })
        .then(resp => {
          this.titleList = resp.result_data || [];
          if (this.titleList.length === 0) {
            this.$refs.mescroll.instance.showEmpty();
          }
          this.$refs.mescroll.instance.endErr();
          this.loading = false;
        })
        .catch(err => {
          this.$refs.mescroll.instance.showEmpty();
          this.$refs.mescroll.instance.endErr();
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
     * 编辑发票抬头
     */
    editTitle(title) {
      this.$utils.setSessionItem('titleInfo', title, true);
      this.$router.push('edittitle');
    },
    /**
     * 删除发票抬头
     */
    deleteTitle(title) {
      this.$messagebox.confirm('确定删除吗？').then(action => {
        this.axios
          .get('v1/phtons/deleteHeader', {
            params: {
              id: title.id
            }
          })
          .then(resp => {
            this.titleList.remove(title);
          });
      });
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.invoice-title {
  .page-container {
    height: 80%;
    .mint-cell--large {
      .mint-cell-title {
        .mint-cell-label:last-child {
          visibility: hidden;
        }
      }
      .mint-cell-value {
        display: block;
        text-align: right;
        .mint-cell-label.ignore {
          &:last-child {
            word-break: break-all;
          }
          a {
            font-size: 13px;
            &:first-child {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .page-bottom-area {
    position: fixed;
  }
}
</style>



