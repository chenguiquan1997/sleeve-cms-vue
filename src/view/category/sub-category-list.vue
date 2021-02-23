<template>
  <div class="container" v-if="!showDetailFlag">
    <div class="top_container">
      <div class="left_container">
        <div class="title">{{superCategoryName}} 分类列表</div>
        <el-button class="add_category_btn" type="primary" plain @click="addCategory"
                   v-permission="{permission: '创建分类', type: 'disabled'}">添加子分类</el-button>
      </div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-table :data="categoryList" style="width: 100%" :stripe="true">
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
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.total" :page-size="this.$data.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
  <category-detail v-else @rollback-event="rollbackEmit" :id="this.$data.categoryId"
  :parent-id="this.$data.id" :category-level="this.$data.categoryLevel"></category-detail>
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
    // 从路由中获取分级分类名称
    this.$data.superCategoryName = this.$route.query.categoryName
    // 从路由中获取父级分类id
    this.$data.superCategoryId = this.$route.params.id
    console.log('一级分类id')
    console.log(this.$data.superCategoryId)
    let res = this.getTwoLevel(1, this.$data.pageSize, this.$data.superCategoryId)
    console.log('二级分类数据')
    console.log(res)
  },
  methods: {
    /**
     * 用户在 “子分类” 页面，点击 “返回” 按钮时，触发的路由操作
     */
    rollbackClick() {
      this.$router.push({
        path: '/category/list'
      })
    },
    /**
    * 用户在分类详情页面，点击“返回”按钮时，触发的操作
    */
    rollbackEmit() {
      this.$data.showDetailFlag = false
      this.$data.categoryId = -1
    },
    /**
     * 获取二级分类数据
     */
    async getTwoLevel(page, size, parentId) {
      const res = await Category.getTwoLevelCategory(page, size, parentId)
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
    /**
     * 用户点击分页组件中的页码时，触发的操作
     */
    pageEmit(page) {
      console.log('pageEmit方法中监听到的事件')
      console.log(page)
      this.$data.page = page
      // 直接调用方法请求分页数据
      this.getTwoLevel(page, this.$data.pageSize, this.$data.superCategoryId)
    },
    /**
     * 添加分类
     */
    addCategory() {
      console.log('触发添加分类操作')
      this.$data.showDetailFlag = true
      this.$data.categoryLevel = 2
      this.$data.id = this.$data.superCategoryId
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
    /**
     *用户点击“删除”按钮时，触发的操作
     */
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
      categoryId: -1,
      superCategoryName: null,
      superCategoryId: -1,
      // 用于添加子分类时，传入的参数
      id: -1,
      // 保存分页组件中的页码
      page: 1
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    padding: 0px 30px 10px 30px;
  }
  .top_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    margin-bottom: 12px;
  }
  .left_container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .rollback {
    cursor: pointer;
    color: $theme;
  }
  .add_category_btn {
    height: 32px;
    margin-left: 20px;
  }
</style>
