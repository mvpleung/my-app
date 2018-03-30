/*
 * 编辑发票抬头
 * @Author: liangzc 
 * @Date: 2018-02-07 17:58:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-23 17:00:01
 */
<template>
  <div class="edit-title">
    <div class="page-header">
      <mt-radio v-model="title.type"
        :options="[{label: '个人', value: '1'}, {label: '单位', value: '2'}]" />
    </div>
    <div class="page-container">
      <mt-field v-model="title.name"
        label="抬头名称"
        v-verify="{rule: 'required|fullname',error:['抬头名称不能为空','请正确输入抬头名称']}"
        placeholder="请输入抬头名称" />
      <mt-field v-model="title.eMail"
        label="电子邮箱"
        v-verify="{rule: 'required|email',error:['电子邮箱不能为空','请正确输入电子邮箱']}"
        placeholder="请输入电子邮箱" />
      <mt-field v-model="title.phone"
        label="联系电话"
        v-verify="{rule: 'required|mobile',error:['联系手机不能为空','请正确输入手机号码']}"
        :attr="{maxlength:11}"
        placeholder="请输入联系手机" />
      <mt-field v-model="title.businessTax"
        v-if="title.type === '2'"
        label="企业税号"
        v-verify="{rule: 'required|businessTax',
        error:['企业税号不能为空','企业税号为15、18、20为数字或大写字母']}"
        :attr="{maxlength:20}"
        placeholder="15、18、20为数字或大写字母" />
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="editTitle">保存</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: {
        name: '',
        eMail: '',
        phone: '',
        businessTax: '', //税号
        type: '1' //1.个人2.单位
      }
    };
  },
  created() {
    document.setTitle('新增发票抬头');
    this.title = this.$utils.getSessionItem('titleInfo', true) || this.title;
  },
  verify: {
    businessTax: [
      {
        test: 'required',
        message: '企业税号不能为空'
      },
      {
        test: /^([1-9](\d{14}|\d{17}|\d{19})|[A-Z])$/,
        message: '企业税号为15、18、20为数字或大写字母'
      }
    ]
  },
  methods: {
    /**
     * 新增/编辑抬头
     */
    editTitle() {
      if (this.$verify.check()) {
        this.axios
          .get(
            `v1/phtons/${
              !this.$utils.isEmpty(this.title.id) ?
                'editHeader' :
                'insertHeader'
            }`,
            {
              params: {
                userId: this.$store.getters.user.mobile,
                ...this.title
              }
            }
          )
          .then(resp => {
            this.$utils.removeSessionItem('titleInfo');
            this.$bus.emit('refreshTitle', this.title);
            this.$router.back();
          });
      }
    }
  }
};
</script>
<style lang="scss">
.edit-title {
  .page-header {
    text-align: center;
    padding: 15px 0;
    .mint-radiolist {
      display: inline-flex;
      .mint-cell {
        background: none;
        border: none;
        .mint-cell-wrapper {
          background: none;
        }
      }
    }
  }
}
</style>


