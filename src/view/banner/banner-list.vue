<template>
  <div class="container" v-if="!detailFlag">
    <div class="top_container">
      <a class="title">Banner列表</a>
    </div>
    <el-table :data="bannerList" style="width: 100%" :stripe="true">
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片" width="180">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="title" label="标题" width="150"></el-table-column>
      <el-table-column prop="description" :show-overflow-tooltip="true" label="描述"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">查看</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                     size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页组件-->
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.total" :page-size="this.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
  <banner-detail v-else @detail-close-emit="detailCloseEmit" :detail-id="detailId"></banner-detail>
</template>

<script>
import { Banner } from '../../model/banner'
import { getSlashYMDHMS } from '../../util/date-1'
import BannerDetail from './banner-detail'
import Page from '../../component/custom/page'

export default {
  name: 'banner-list',
  components: {
    Page,
    BannerDetail,
  },
  created() {
    this.getBanners(1, this.pageSize)
  },
  methods: {
    /**
     * 获取banner列表数据
     * @returns {Promise<void>}
     */
    async getBanners(page, count) {
      const bannerList = await Banner.getBanners(page, count)
      console.log(bannerList)
      // 格式化日期
      this.formatDate(bannerList.items)
      this.$data.bannerList = bannerList.items
      // 存储当前模块的总数据数量
      this.$data.total = bannerList.total
    },
    /**
     * 格式化日期数据
     * @param bannerList
     */
    formatDate(bannerList) {
      bannerList.forEach(banner => {
        banner.create_time = getSlashYMDHMS(banner.create_time)
      })
    },
    /**
     * 点击‘查看’按钮触发的事件
     */
    handerDetail(data) {
      console.log('触发查看操作')
      console.log(data)
      this.detailFlag = true
      this.detailId = data
    },
    /**
     * 点击 ‘删除’ 按钮触发的事件
     */
    handlerRemove(id) {
      this.$confirm('此操作将永久删除当前记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await Banner.delete(id)
        console.log(res)
        this.$message({
          type: res.code === 3 ? 'success' : 'error',
          message: res.code === 3 ? '删除成功!' : '删除失败，请稍后重试~'
        })
        // 重新刷新一遍页面数据, 这个动作应该传给page子组件去操作
        // this.rebuildPage(this.$data.currPage)
        this.$data.removeFlag = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }).finally(() => {
        console.log('执行finally操作')
        this.$data.removeFlag = false
      })
    },
    /**
     * 点击‘返回’按钮，监听到的事件
     */
    detailCloseEmit() {
      console.log('banner-list 中已经监听到close')
      this.detailFlag = false
    },
    // 用户点击 ‘页码’时，切换页面数据的事件
    pageEmit(page) {
      console.log('pageEmit方法中监听到的事件')
      console.log(page)
      // 当前页= count + 1
      this.$data.page = page
      this.$data.currPage = page + 1
      console.log(`当前页：${this.$data.currPage}`)
      this.getBanners(page, this.pageSize)
    }
    // /**
    //  * 当用户点击具体页码时，触发的事件
    //  * @param val
    //  * @returns {Promise<void>}
    //  */
    // async handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`)
    //   // 因为服务端是从第0页开始，前端是从第1页显示，所以需要做-1操作
    //   this.$data.currPage = val
    //   const page = val - 1
    //   console.log(`发送给后端的页码：${page}`)
    //   this.getBanners(page, this.pageSize)
    // },
    // /**
    //  * 用户点击‘删除’按钮时，重新构建页面分页数据
    //  * @param currPage
    //  */
    // rebuildPage(currPage) {
    //   // 向上取整,有小数就整数部分加1，获取总页数
    //   const totalPage = Math.ceil(this.$data.total / this.$data.pageSize)
    //   console.log(`总页数：${totalPage}`)
    //   // 判断当前请求的页数，是不是最后一页，如果不是最后一页，那么还需要请求当前页数据
    //   if (currPage !== totalPage) {
    //     this.handleCurrentChange(currPage)
    //     return
    //   }
    //   // 取最后一页的数据个数，如果为0，则认为没有散页数据
    //   const num = this.$data.total % this.$data.pageSize
    //   console.log(`余数：${num}`)
    //   if (num !== 1) {
    //     // 如果 mun ！= 1，那么重新获取当前页的数据，就可以了
    //     this.handleCurrentChange(currPage)
    //   } else {
    //     // 如果 === 1，那么需要获取前一页的数据
    //     this.handleCurrentChange(currPage - 1)
    //   }
    // }
  },
  data() {
    return {
      bannerList: [],
      detailFlag: false,
      detailId: -1,
      total: 0,
      pageSize: 3,
      currPage: 1,
      // 用户点击’删除‘操作时，触发的标记，需要传到page组件中
      removeFlag: false,
      // 保存当前分页组件的页码
      page: -1
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 0px 30px 10px 30px;
  position: relative;
}
.top_container {
  height: 60px;
  display: flex;
  align-items: center;
}
.title {
 color: $theme;
}

</style>
