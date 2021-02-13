<template>
  <div class="paging_container">
    <el-pagination :background="true" layout="total, prev, pager, next, jumper" :total="this.total"
                   :page-size="this.pageSize" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: {
    pageSize: {
      Type: Number,
      Default: 3
    },
    total: {
      Type: Number,
      Default: 0
    },
    removeFlag: {
      Type: Boolean,
      Default: false
    }
  },
  created() {
  },
  watch: {
    removeFlag: function f() {
      console.log(`removeFlag: ${this.removeFlag}`)
      if (this.removeFlag) {
        // 执行删除后的操作
        this.rebuildPage(this.$data.currPage)
        console.log('page组件中执行删除操作')
        // 执行完删除操作后，将removeFlag重新设置成false
      } else {
        console.log('当前removeFlag为false,无需执行')
      }
    },
    total: function t() {
      console.log('page组件中接收到的total: ')
      console.log(this.total)
    },
    pageSize: function p() {
      console.log('page组件中接收到的pageSize:')
      console.log(this.pageSize)
    }
  },
  methods: {
    /**
     * 当用户点击具体页码时，触发的事件
     * @param val
     * @returns {Promise<void>}
     */
    async handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // 因为服务端是从第0页开始，前端是从第1页显示，所以需要做-1操作
      this.$data.currPage = val
      const page = val - 1
      console.log(`发送给后端的页码：${page}`)
      // this.getBanners(page, this.pageSize)
      // 组件内部发出一个点击事件，然后父组件中调用‘获取当前页数据的方法’
      this.$emit('page-event', page)
    },
    /**
     * 用户点击‘删除’按钮时，重新构建页面分页数据
     * @param currPage
     */
    rebuildPage(currPage) {
      console.log(`rebuildPage中的当前页：${currPage}`)
      // 向上取整,有小数就整数部分加1，获取总页数
      const totalPage = Math.ceil(this.total / this.pageSize)
      console.log(`总页数：${totalPage}`)
      // 判断当前请求的页数，是不是最后一页，如果不是最后一页，那么还需要请求当前页数据
      if (currPage !== totalPage) {
        this.handleCurrentChange(currPage)
        return
      }
      // 取最后一页的数据个数，如果为0，则认为没有散页数据
      const num = this.total % this.pageSize
      console.log(`余数：${num}`)
      if (num !== 1) {
        // 如果 mun ！= 1，那么重新获取当前页的数据，就可以了
        this.handleCurrentChange(currPage)
      } else {
        // 如果 === 1，那么需要获取前一页的数据
        this.handleCurrentChange(currPage - 1)
      }
    }
  },
  data() {
    return {
      currPage: 1
    }
  }
}
</script>

<style scoped lang="scss">
.paging_container {
  position: absolute;
  margin-top: 20px;
  margin-right: 20px;
  right: 20px;
}
</style>
