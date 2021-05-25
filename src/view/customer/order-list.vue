<template>
  <div class="container" v-if="!this.$data.showFlag">
    <div class="top_container">
      <a class="title">订单列表</a>
      <div class="right_search">
        <div class="condition_search" style="margin-top: 6px;">
          <el-autocomplete placeholder="请输入内容" v-model="condition"
                           :fetch-suggestions="querySearch"
                           class="input-with-select">
            <el-select class="select" v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="订单号" value="1"></el-option>
              <el-option label="收货人" value="2"></el-option>
              <el-option label="联系电话" value="3"></el-option>
              <el-option label="订单状态" value="4"></el-option>
<!--              <el-option label="全部订单" value="6"></el-option>-->
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="conditionSearchClick"></el-button>
          </el-autocomplete>
        </div>
        <div class="date_search" style="margin-top: 6px;">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
<!--          <el-button slot="append" icon="el-icon-search"></el-button>-->
          <el-button class="button_search" type="primary" icon="el-icon-search" @click="dateSearchClick"></el-button>
        </div>
      </div>
    </div>
    <el-table :data="orderList" style="width: 100%" :stripe="true" height="600">
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="order_no" label="订单号" width="180">
      </el-table-column>
      <el-table-column prop="summary_title" label="商品概要" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="total_count" label="商品数量" width="80"></el-table-column>
<!--      <el-table-column prop="total_price" label="总金额(元)" width="100"></el-table-column>-->
      <el-table-column prop="final_total_price" label="实付金额 /元" width="100"></el-table-column>
      <el-table-column prop="receiver" label="收货人" width="100"></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="100">
        <template slot-scope="scope">
          <el-tag
          :type="scope.row.status === '已完成'? 'success' : scope.row.status === '待支付'?
           'warning' : scope.row.status === '已取消'?'info' : scope.row.status === '已发货'?'error':''"
          >{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="placed_time" label="订单创建时间" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">详情</el-button>
          <el-button type="danger" v-permission="{ permission: '删除订单', type: 'disabled' }"
                     size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.$data.total" :page-size="this.$data.pageSize" :remove-flag="this.$data.removeFlag"></page>
  </div>
  <order-detail v-else :id="this.$data.orderId" @rollback-event="rollbackEvent"></order-detail>
</template>

<script>
import Page from '../../component/custom/page'
import { Order } from '../../model/order'
import { getSlashYMDHMS } from '../../util/date-1'
import OrderDetail from './order-detail'

export default {
  name: 'order',
  components: { OrderDetail, Page },
  props: {
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const res = await Order.getOrders(this.$data.page, this.$data.count)
      this.formateDate(res.items)
      this.$data.total = res.total
      this.$data.page = res.page
      this.$data.orderList = res.items
      this.$data.searchFlag = 0
      console.log(res)
    },
    /**
     * 格式化创建时间
     * @param items
     */
    formateDate(items) {
      items.forEach(item => {
        item.placed_time = getSlashYMDHMS(item.placed_time)
      })
    },
    /**
     * 格式化订单数据
     */
    formateOrderData(res) {
      this.formateDate(res.items)
      this.$data.total = res.total
      this.$data.page = res.page
      this.$data.orderList = res.items
    },
    async pageEmit(page) {
      this.$data.page = page
      console.log(`查询标记：${this.$data.searchFlag}`)
      console.log(typeof this.$data.searchFlag)
      let res = {}
      if (this.$data.searchFlag.toString() === '0') {
        // 无条件分页查询
        console.log('进入无条件查询方法')
        res = await Order.getOrders(page, this.$data.count)
      } else if (this.$data.searchFlag === '1') {
        // 根据订单号查询
        res = await Order.getOrdersByOrderNo(page, this.$data.count, this.$data.condition)
      } else if (this.$data.searchFlag === '2') {
        // 根据收货人查询
        res = await Order.getOrdersByReceiver(page, this.$data.count, this.$data.condition)
      } else if (this.$data.searchFlag === '3') {
        // 根据联系方式查询
        res = await Order.getOrdersByPhone(page, this.$data.count, this.$data.condition)
      } else if (this.$data.searchFlag === '4') {
        // 根据订单状态查询
        const arr = this.$data.condition.split('-')
        // 根据订单状态查询
        res = await Order.getOrdersByStatus(this.$data.page, this.$data.count, arr[0])
      } else if (this.$data.searchFlag === '5') {
        const startTime = this.$data.date[0]
        const endTime = this.$data.date[1]
        // 根据时间段查询
        res = await Order.getOrdersByTime(this.$data.page, this.$data.count, startTime, endTime)
      } else {
        this.$message({
          type: 'error',
          message: '分页查询失败，请刷新重试~'
        })
      }
      this.formateOrderData(res)
    },
    handerDetail(id) {
      this.$data.showFlag = true
      this.$data.orderId = id
    },
    handlerRemove() {
    },
    /**
     * 根据时间区间进行分页查询
     */
    async dateSearchClick() {
      console.log('触发日期搜索点击事件')
      console.log(this.$data.date)
      this.$data.searchFlag = '5'
      this.confirmPage()
      const startTime = this.$data.date[0]
      const endTime = this.$data.date[1]
      const res = await Order.getOrdersByTime(this.$data.page, this.$data.count, startTime, endTime)
      this.formateOrderData(res)
    },
    /**
     * 由于用户在中途可能会改变查询的条件，这就可能造成：查询条件改变，但是页码没有改变的现象，需要重新初始化
     */
    confirmPage() {
      console.log(`searchFlag：${this.$data.searchFlag}`)
      console.log(`select：${this.$data.select}`)
      if (this.$data.searchFlag !== this.$data.select) {
        console.log(`page: ${this.$data.page}`)
        this.$data.page = 1
      }
    },
    /**
     * 根据搜索条件进行分页查询
     */
    async conditionSearchClick() {
      console.log('触发条件搜索点击事件')
      console.log(this.$data.condition)
      console.log(this.$data.select)
      let res = {}
      if (this.$data.select === '1') {
        this.confirmPage()
        // 根据订单号查询
        console.log('根据订单号查询')
        res = await Order.getOrdersByOrderNo(this.$data.page, this.$data.count, this.$data.condition)
      } else if (this.$data.select === '2') {
        this.confirmPage()
        console.log('根据收货人查询')
        // 根据收货人查询
        res = await Order.getOrdersByReceiver(this.$data.page, this.$data.count, this.$data.condition)
      } else if (this.$data.select === '3') {
        this.confirmPage()
        console.log('根据联系方式查询')
        // 根据联系方式查询
        res = await Order.getOrdersByPhone(this.$data.page, this.$data.count, this.$data.condition)
      } else if (this.$data.select === '4') {
        this.confirmPage()
        console.log('根据订单状态查询')
        const arr = this.$data.condition.split('-')
        // 根据订单状态查询
        res = await Order.getOrdersByStatus(this.$data.page, this.$data.count, arr[0])
      }
      this.$data.searchFlag = this.$data.select
      this.formateOrderData(res)
    },
    inputFocusEvent() {
      console.log('获取焦点')
    },
    querySearch(queryString, cb) {
      if (this.$data.select !== '4') {
        cb([])
      } else {
        cb([{ value: '1-待支付' }, { value: '2-已支付' }, { value: '3-已发货' }, { value: '4-已完成' }, { value: '5-已取消' }])
      }
    },
    rollbackEvent() {
      console.log('接收到返回事件')
      this.$data.showFlag = false
      this.$data.id = -1
    }
  },
  data() {
    return {
      orderList: [],
      page: 1,
      count: 10,
      total: -1,
      pageSize: 10,
      removeFlag: false,
      // 条件查询的标记
      select: '',
      // 可以知道是根据哪个条件查询
      condition: '',
      // 存储日期条件的参数
      date: '',
      // 查询条件的标记 0:无条件查询, 1:订单号, 2:收货人, 3:联系电话, 4:订单状态, 5:时间段查询
      searchFlag: '0',
      showFlag: false,
      orderId: -1,
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    padding: 0 30px 10px 30px;
    position: relative;
  }
  .top_container {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .right_search {
    display: flex;
    flex-direction: row;
    position: fixed;
    right: 48px;
  }
  .condition_search {
    margin-right: 50px;
  }
  .button_search {
    padding: 11px 16px;
    border-radius: 4px;
  }
  .select {
    width: 110px;
    padding-left: 0px;
  }
  .title {
    color: $theme;
  }
</style>
