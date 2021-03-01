<template>
  <div class="container" v-if="!showDetailFlag">
    <div class="top_container">
      <div class="title">一级分类列表</div>
      <el-button class="add_category_btn" type="primary" plain @click="addCategory"
                 v-permission="{permission: '创建分类', type: 'disabled'}">
        添加分类</el-button>
    </div>
    <el-table :data="categoryList" style="width: 100%" :stripe="true" :cell-style="cellStyle">
      <el-table-column fixed prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片" width="200">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="online" label="状态" width="120"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <el-button @click="handlerChilderns(scope.row)" type="primary" plain size="mini">子分类</el-button>
          <el-button @click="handlerEditItem(scope.row.id)" type="primary" plain size="mini">查看</el-button>
          <el-button type="danger" v-permission="{ permission: '删除分类', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.total" :page-size="this.$data.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
  <category-detail v-else @rollback-event="rollbackEmit" :id="this.$data.categoryId"
                   :category-level="this.$data.categoryLevel" ></category-detail>
</template>

<script>
import { Category } from '../../model/category'
import { getSlashYMDHMS } from '../../util/date-1'
import Page from '../../component/custom/page'
import CategoryDetail from './category-detail'

export default {
  name: 'category-list',
  components: { CategoryDetail, Page },
  props: {

  },
  created() {
    this.getOneLevel()
  },
  methods: {
    rollbackEmit() {
      this.$data.showDetailFlag = false
      // 用户在分类详情页点击“返回按钮”后，一级分类中，要将categoryId设置为初始化状态，
      // 否则会影响“添加分类”按钮
      this.$data.categoryId = -1
      console.log(`当前页：${this.page}`)
      this.getOneLevel(this.page, this.pageSize)
    },
    /**
     * 获取一级分类数据
     */
    async getOneLevel(page, count) {
      const res = await Category.getOneLevelCategory(page, count)
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
    pageEmit(page) {
      console.log('pageEmit方法中监听到的事件')
      console.log(page)
      this.page = page
      this.getOneLevel(page, this.pageSize)
    },
    /**
     * 添加分类
     */
    addCategory() {
      console.log('触发添加分类操作')
      this.$data.showDetailFlag = true
      this.$data.categoryLevel = 1
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
    // 用户点击“删除”按钮时触发的操作
    handlerRemoveItem() {
      console.log('触发删除操作')
    },
    /**
     * 用户点击"子分类"按钮时，触发的操作
     * @param row
     */
    handlerChilderns(row) {
      console.log('查询子分类')
      this.$router.push({
        path: `/sub-category/${row.id}/list`,
        query: { categoryName: row.name },
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'color: #1a1a1b'
    }
  },
  data() {
    return {
      categoryList: null,
      total: 0,
      pageSize: 3,
      removeFlag: false,
      showDetailFlag: false,
      categoryId: -1,
      categoryLevel: -1,
      // 保存分页组件中的页码
      page: 1,
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    padding: 0px 30px 10px 30px;
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
  .status {
    color: red;
  }
</style>
