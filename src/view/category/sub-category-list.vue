<template>
  <div class="container" v-if="!showDetailFlag">
    <div class="top_container">
      <div class="title">{{superCategoryName}} 分类列表</div>
      <el-button class="add_category_btn" type="primary" plain @click="addCategory"
                 v-permission="{permission: '创建分类', type: 'disabled'}">
        添加分类</el-button>
    </div>
    <el-table :data="categoryList" style="width: 100%">
      <el-table-column fixed prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="online" label="状态" width="120"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handlerEditItem(scope.row.id)" type="primary" plain size="mini">查看</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page @page-event="pageEmit"
          :total="this.total" :page-size="this.$data.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
  <category-detail v-else @rollback-event="rollbackEmit" :id="this.$data.categoryId"></category-detail>
</template>

<script>
import CategoryDetail from './category-detail'
import Page from '../../component/custom/page'
import { Category } from '../../model/category'
import { getSlashYMDHMS } from '../../util/date-1'

export default {
  name: 'sub-category-list',
  components: { Page, CategoryDetail },
  props: {

  },
  created() {
    this.getTwoLevel()
    this.$data.superCategoryName = this.$route.query.categoryName
    this.$data.superCategoryId = this.$route.params.id
  },
  methods: {
    rollbackEmit() {
      this.$data.showDetailFlag = false
    },
    /**
     * 获取一级分类数据
     */
    async getTwoLevel() {
      const res = await Category.
      console.log(res)
      // 处理 日期 和 状态
      this.formatDateAndOnline(res.items)
      this.$data.categoryList = res.items
      this.$data.total = res.total
    },
    /**
     * 格式化日期,online数据
     * @param items
     */
    formatDateAndOnline(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
        if (item.online) {
          item.online = '上线'
        } else {
          item.online = '下线'
        }
      })
    },
    pageEmit(count) {
      console.log('pageEmit方法中监听到的事件')
      console.log(count)
      this.getOneLevel(count, this.pageSize)
    },
    /**
     * 添加分类
     */
    addCategory() {
      console.log('触发添加分类操作')
    },
    /**
     * 用户点击“查看”按钮时，触发的操作
     * @param categoryId
     */
    handlerEditItem(categoryId) {
      console.log('触发编辑操作')
      this.$data.showDetailFlag = true
      this.$data.categoryId = categoryId
    },
    handlerRemoveItem() {
      console.log('触发删除操作')
    }
  },
  data() {
    return {
      categoryList: null,
      total: 0,
      pageSize: 3,
      removeFlag: false,
      showDetailFlag: false,
      categoryId: 1,
      superCategoryName: null,
      superCategoryId: 0
    }
  }
}
</script>

<style scoped>

</style>
