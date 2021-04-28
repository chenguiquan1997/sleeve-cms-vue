<template>
  <div class="container" v-if="!detailFlag">
    <div class="top_container">
      <a class="title">SPU列表</a>
      <el-button class="add_category_btn" type="primary" plain @click="addSpu"
                 v-permission="{permission: '创建SPU', type: 'disabled'}">
        创建 SPU</el-button>
    </div>
    <el-table :data="spuList" style="width: 100%" :stripe="true" height="600">
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片" width="150">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"
                  style="width: 80px; height: 80px"></el-image>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120"></el-table-column>
      <el-table-column prop="subtitle" label="副标题" width="180"></el-table-column>
      <el-table-column prop="category_name" label="所属分类" width="120"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="online" label="是否上架" width="100"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">详情</el-button>
          <el-button type="danger" v-permission="{ permission: '删除SPU', type: 'disabled' }"
                     size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.total" :page-size="this.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
  <spu-detail v-else :id="this.$data.id" @rollback-event="rollback"></spu-detail>
</template>

<script>
import Page from '../../component/custom/page'
import { Spu } from '../../model/Spu'
import { getSlashYMDHMS } from '../../util/date-1'
import SpuDetail from './spu-detail'

export default {
  name: 'spu-list',
  components: { SpuDetail, Page },
  props: {
  },
  created() {
    this.getSpuList()
  },
  methods: {
    /**
     * 分页获取 Spu 数据
     * @returns {Promise<void>}
     */
    async getSpuList(page, count) {
      const res = await Spu.getSpuList(page, count)
      this.$data.spuList = res.items
      this.formatDate(res.items)
      this.formatOnline(res.items)
      console.log(res)
      this.$data.total = res.total
    },
    /**
     * 格式化日期数据
     * @param items
     */
    formatDate(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
      })
    },
    /**
     * 格式化上下架显示
     * @param items
     */
    formatOnline(items) {
      items.forEach(item => {
        if (item.online) {
          item.online = '上线'
        } else {
          item.online = '下线'
        }
      })
    },
    /*
    * 点击“编辑”按钮
    * */
    handerDetail(id) {
      this.$data.detailFlag = true
      this.$data.id = id
    },
    /**
     * 删除SPU
     */
    async handlerRemove(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await Spu.removeSpu(id)
        this.$message({
          message: res.code === 3 ? '删除成功' : '删除失败，请稍后重试~',
          type: res.code === 3 ? 'successs' : 'error',
        })
        // 重建分页
        this.$data.removeFlag = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }).finally(() => {
        this.$data.removeFlag = false
      })
    },
    /**
     * 点击页码触发
     */
    pageEmit(page) {
      console.log('接收点击页码事件 ')
      console.log(page)
      this.getSpuList(page, this.$data.pageSize)
      this.$data.page = page
    },
    /**
     * 添加SPU
     */
    addSpu() {
      this.$data.detailFlag = true
    },
    /**
     * 点击“返回”按钮时，触发的操作
     */
    rollback() {
      this.$data.detailFlag = false
      this.$data.id = -1
      // 重新加载当前页数据
      this.pageEmit(this.$data.page)
    }
  },
  data() {
    return {
      id: -1,
      spuList: null,
      detailFlag: false,
      page: 1,
      total: 0,
      pageSize: 5,
      // 用于删除操作后，page组件重建分页的标记
      removeFlag: false
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
    align-items: center;
  }
  .title {
    color: $theme;
  }
  .add_category_btn {
    margin-left: 20px;
  }
</style>
