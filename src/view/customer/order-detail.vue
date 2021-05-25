<template>
  <div class="container">
    <div class="top_container">
      <div class="title">订单详情</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider class="divider"></el-divider>
    <div >
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="订单号" prop="order_no">
                <el-input disabled size="medium" v-model="form.order_no"></el-input>
              </el-form-item>
              <el-form-item label="图片" prop="snap_img">
                <el-image style="height:100px;width:100px;" :src="form.snap_img"></el-image>
              </el-form-item>
              <el-form-item label="标题" prop="summary_title">
                <el-input disabled size="medium" v-model="form.summary_title"></el-input>
              </el-form-item>
<!--              <el-form-item label="预付编号" prop="prepay_id">-->
<!--                <el-input disabled size="medium" v-model="form.prepay_id"></el-input>-->
<!--              </el-form-item>-->
              <el-form-item label="应付金额" prop="total_price">
                <el-input-number disabled v-model="form.total_price" :precision="2" :step="0.1"></el-input-number>
              </el-form-item>
              <el-form-item label="实付金额" prop="final_total_price">
                <el-input-number disabled v-model="form.final_total_price" :precision="2" :step="0.1"></el-input-number>
              </el-form-item>
              <el-form-item label="商品数量" prop="total_count">
                <el-input-number disabled v-model="form.total_count" :step="1" step-strictly></el-input-number>
              </el-form-item>
              <el-form-item label="下单时间" prop="placed_time">
                <el-input disabled size="medium" v-model="form.placed_time"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-tag :type="form.status === '已完成'? 'success' : form.status === '待支付'?
                  'warning' : form.status === '已取消'?'info' : form.status === '已发货'?'error':''"
                  >{{form.status}}</el-tag>
              </el-form-item>
              <el-form-item>
                <el-select v-model="orderStatus" placeholder="请选择订单状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <div v-if="form.address" class="address">
                  <div class="header">
                    <span class="name">收货人：{{ form.address.user_name }}</span>
                    <span class="mobile">电话：{{ form.address.mobile }}</span>
                  </div>
                  <div class="detail">
                    {{ form.address.province }} {{ form.address.city }} {{ form.address.county }} {{form.address.detail}}
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="详情" prop="snap_items">
                <el-table v-if="form.product_items" stripe :data="form.product_items">
                  <el-table-column fixed="left" prop="id" label="id" width="100"></el-table-column>
                  <el-table-column prop="img" label="图片" width="100">
                    <template v-if="scope.row.img" slot-scope="scope">
                      <img class="display_img" :src="scope.row.img" :alt="scope.row.img" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="标题" width="100"></el-table-column>
                  <el-table-column prop="single_price" label="单价" width="100"></el-table-column>
                  <el-table-column prop="final_price" label="交易金额" min-width="100"></el-table-column>
                  <el-table-column fixed="right" prop="count" label="数量" width="100"></el-table-column>
                  <el-table-column prop="spec_values" label="规格" width="100"></el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="物流单号" prop="delivery_no">
                <el-input size="medium" v-model="form.delivery_no" placeholder="请填写物流单号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-if="this.id !== -1" type="primary" @click="submitClick"
                           v-permission="{permission: '更新订单', type: 'disabled'}">更新</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Order } from '../../model/order'
import { getSlashYMDHMS } from '../../util/date-1'

export default {
  name: 'order-detail',
  props: {
    id: {
      Type: Number,
      Default: -1
    }
  },
  created() {
  },
  mounted() {
    if (this.id !== -1) {
      this.getOrderDetail(this.id)
    }
  },
  methods: {
    /**
     * 点击“返回”按钮，触发的操作
     */
    rollbackClick() {
      console.log('点击返回按钮')
      this.$emit('rollback-event')
    },
    /**
     * 获取订单详情
     * @param id 订单id
     */
    async getOrderDetail(id) {
      const res = await Order.getOrderDetail(id)
      this.formateDate(res)
      this.formateSpec(res.product_items)
      console.log(res)
      this.$data.form = res
      console.log(this.$data.form)
    },
    /**
     * 格式化创建时间
     * @param order
     */
    formateDate(order) {
      console.log(typeof order.placed_time)
      order.placed_time = getSlashYMDHMS(order.placed_time)
    },
    /**
     * 格式化商品规格
     * @param order
     */
    formateSpec(items) {
      items.forEach(item => {
        let specs = ''
        item.spec_values.forEach(spec => {
          console.log(spec)
          specs = specs.concat(spec).concat(';')
        })
        console.log(specs)
        item.spec_values = specs
      })
    },
    changeOrderStatus() {

    },
    actionDisabled() {

    },
    /**
     * 更新订单数据
     * @returns {Promise<void>}
     */
    async submitClick() {
      const data = {}
      data.id = this.form.id
      data.order_no = this.form.order_no
      // eslint-disable-next-line radix
      data.status = parseInt(this.$data.orderStatus)
      data.delivery_no = this.form.delivery_no
      console.log(data)
      const res = await Order.updateOrder(data)
      console.log(res)
      this.$message({
        type: res.code === 2 ? 'success' : 'error',
        message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
      })
      // todo
    }
  },
  data() {
    return {
      form: {

      },
      orderStatus: null,
      options: [{
        value: '1',
        label: '待支付'
      }, {
        value: '2',
        label: '已支付'
      }, {
        value: '3',
        label: '已发货'
      }, {
        value: '4',
        label: '已完成'
      }, {
        value: '5',
        label: '已取消'
      }],
    }
  }
}
</script>

<style scoped lang="scss">
  .top_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: $theme;
    margin-top: 20px;
  }
  .divider {
    margin-top: 10px;
  }
  .rollback {
    cursor: pointer;
  }
  .title {
    text-align: center;
    color: $theme;
    height: 30px;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;
      display: inline-flex;
      align-content: space-around;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .id {
        margin-right: 15px;
        font-size: 12px;
        color: #b4b4b4;
      }
      .highlighted .addr {
        color: #ddd;
      }
    }
  }
  .white-color {
    background-color: #fff;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .display_img {
    max-width: 100px;
    max-height: 50px;
    width: auto;
    height: auto;
  }
  .address {
    .header {
      display: flex;
      align-content: center;
      .name {
        font-weight: 600;
        margin-right: 40px;
      }
      .mobile {
        font-weight: 600;
      }
    }
  }
</style>
