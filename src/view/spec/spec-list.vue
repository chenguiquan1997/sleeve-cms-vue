<template>
  <div class="container" v-if="!this.showSpecDetailFlag">
    <div class="top_container">
      <div class="title">规格列表</div>
      <el-button class="add_spec_btn" type="primary" plain @click="addSpec"
                 v-permission="{permission: '创建规格', type: 'disabled'}">
        创建新规格</el-button>
    </div>
    <el-table :data="specList" style="width: 100%" :stripe="true">
      <el-table-column fixed prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="name" label="规格名" width="150"></el-table-column>
      <el-table-column prop="unit" label="单位" width="150"></el-table-column>
      <el-table-column prop="standard" label="标准" width="150"></el-table-column>
      <el-table-column prop="description" label="规格描述" width="150"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handlerEditItem(scope.row.id)" type="primary" plain size="mini">查看</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Grid', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.$data.total" :page-size="this.$data.pageSize" :remove-flag="this.$data.removeFlag"></page>
  </div>
  <spec-detail v-else @rollback-emit="rollbackEmit" :id="this.$data.id"></spec-detail>
</template>

<script>
import { Spec } from '../../model/spec'
import { getSlashYMDHMS } from '../../util/date-1'
import Page from '../../component/custom/page'
import SpecDetail from './spec-detail'

export default {
  name: 'spec-list',
  components: { SpecDetail, Page },
  props: {
  },
  created() {
    this.getSpecs(1, this.$data.pageSize)
  },
  methods: {
    /*
    * 分页获取规格列表数据
    * */
    async getSpecs(page, size) {
      let res = await Spec.getSpecs(page, size)
      this.formatDateAndStandard(res.items)
      this.$data.specList = res.items
      this.$data.total = res.total
      console.log(res)
    },
    /**
     * 格式化日期,standard数据
     * @param items
     */
    formatDateAndStandard(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
        if (item.standard) {
          item.standard = '标准'
        } else {
          item.standard = '非标'
        }
      })
    },
    /**
     * 监听 page 组件发出的事件
     * @param page 当前页码
     * @returns {Promise<void>}
     */
    async pageEmit(page) {
      this.$data.page = page
      await this.getSpecs(page, this.$data.pageSize)
    },
    /**
     * 点击“查看”按钮，触发的操作
     * @param id
     */
    handlerEditItem(id) {
      this.$data.showSpecDetailFlag = true
      this.$data.id = id
    },
    /**
     * 点击“删除”按钮，触发的操作
     * @param id
     */
    handlerRemoveItem(id) {

    },
    async rollbackEmit() {
      this.$data.showSpecDetailFlag = false
      // 从新刷新当前页面数据
      await this.getSpecs(this.$data.page, this.$data.pageSize)
    },
    /**
     * 添加规格操作
     */
    addSpec() {
      console.log('创建规格')
      this.$router.push({
        path: '/spec/create',
      })
    }
  },
  data() {
    return {
      specList: null,
      total: 0,
      id: -1,
      pageSize: 3,
      removeFlag: false,
      showSpecDetailFlag: false
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
  .add_spec_btn {
    margin-left: 20px;
  }
</style>
