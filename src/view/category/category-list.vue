<template>
  <div class="container">
    <div class="top_container">
      <div class="title">一级分类列表</div>
      <el-button class="add_category_btn" type="primary" plain @click="addCategory"
                 v-permission="{permission: '创建分类', type: 'disabled'}">
        添加Banner-Item</el-button>
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
  </div>
</template>

<script>
import { Category } from '../../model/category'

export default {
  name: 'category-list',
  props: {

  },
  created() {
    this.getOneLevel()
  },
  methods: {
    async getOneLevel() {
      const res = await Category.getOneLevelCategory()
      console.log(res)
      this.$data.categoryList = res.items
    },
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
      categoryList: null
    }
  }
}
</script>

<style scoped>

</style>
