<template>
  <div class="container">
    <div class="top_container">
      <div class="title">一级分类列表</div>
      <el-button class="add_category_btn" type="primary" plain @click="addCategory"
                 v-permission="{permission: '创建分类', type: 'disabled'}">
        添加分类</el-button>
    </div>
    <el-table :data="categoryList" style="width: 100%">
      <el-table-column fixed prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="online" label="状态"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handlerChilderns(scope.row)" type="primary" plain size="mini">子分类</el-button>
          <el-button @click="handlerEditItem(scope.row)" type="primary" plain size="mini">编辑</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page @page-event="pageEmit"
          :total="this.total" :page-size="this.$data.pageSize" :remove-flag="this.removeFlag"></page>
  </div>
</template>

<script>
import { Category } from '../../model/category'
import { getSlashYMDHMS } from '../../util/date-1'
import Page from '../../component/custom/page'

export default {
  name: 'category-list',
  components: { Page },
  props: {

  },
  created() {
    this.getOneLevel()
  },
  methods: {
    /**
     * 获取一级分类数据
     */
    async getOneLevel() {
      const res = await Category.getOneLevelCategory()
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
    handlerEditItem() {
      console.log('触发编辑操作')
    },
    handlerRemoveItem() {
      console.log('触发删除操作')
    },
    handlerChilderns() {
      console.log('查询子分类')
    }
  },
  data() {
    return {
      categoryList: null,
      total: 0,
      pageSize: 3,
      removeFlag: false
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
</style>
