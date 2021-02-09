<template>
  <el-table class="container" v-if="!detailFlag" :data="bannerList" style="width: 100%" :stripe="true">
    <el-table-column prop="id" label="id" width="80"></el-table-column>
    <el-table-column prop="img" label="图片">
      <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
    </el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="description" :show-overflow-tooltip="true" label="描述"></el-table-column>
    <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">查看</el-button>
        <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                   size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <banner-detail v-else @detail-close-emit="detailCloseEmit" :detail-id="detailId"></banner-detail>
</template>

<script>
import { Banner } from '../../model/banner'
import { getSlashYMDHMS } from '../../util/date-1'
import BannerDetail from './banner-detail'

export default {
  name: 'banner-list',
  components: {
    BannerDetail,
  },
  created() {
    this.getBanners()
  },
  methods: {
    /**
     * 获取banner列表数据
     * @returns {Promise<void>}
     */
    async getBanners() {
      const bannerList = await Banner.getBanners()
      this.formatDate(bannerList.items)
      this.$data.bannerList = bannerList.items
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
      console.log('触发删除操作')
      console.log(id)
      this.$confirm('此操作将永久删除当前记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await Banner.delete(id)
        this.$message({
          type: res.code === 3 ? 'success' : 'error',
          message: res.code === 3 ? '删除成功!' : '删除失败，请稍后重试~'
        })
        // 重新刷新一遍页面数据
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * 点击‘返回’按钮，监听到的事件
     */
    detailCloseEmit() {
      console.log('banner-list 中已经监听到close')
      this.detailFlag = false
    },
  },
  data() {
    return {
      bannerList: [],
      detailFlag: false,
      detailId: -1,
    }
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 30px 30px 0 30px;
}
</style>
