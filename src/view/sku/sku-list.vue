<template>
  <div class="container" v-if="!detailFlag">
    <div class="top_container">
      <a class="title">SKU列表</a>
      <el-button class="add_sku_btn" type="primary" plain @click="addSku"
                 v-permission="{permission: '创建Sku', type: 'disabled'}">
        创建 SKU</el-button>
    </div>
    <el-table :data="skuList" style="width: 100%" :stripe="true" height="600">
      <el-table-column prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片" width="150">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"
                  style="width: 80px; height: 80px"></el-image>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="belong_spu" label="所属SPU" width="150"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100"></el-table-column>
      <el-table-column prop="stock" label="库存" width="100"></el-table-column>
      <el-table-column prop="online" label="是否上架" width="100"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handerDetail(scope.row.id)">编辑</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                     size="mini" plain @click="handlerRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <page @page-event="pageEmit" :current-page="this.$data.page"
          :total="this.$data.total" :page-size="this.$data.pageSize" :remove-flag="this.$data.removeFlag"></page>
  </div>
  <sku-detail v-else :id="this.$data.id" @rollback-event="rollback"></sku-detail>
</template>

<script>
import Page from '../../component/custom/page'
import { Sku } from '../../model/sku'
import { getSlashYMDHMS } from '../../util/date-1'
import SkuDetail from './sku-detail'

export default {
  name: 'sku-list',
  components: { SkuDetail, Page },
  created() {
  },
  mounted() {
    this.getSkuSummaryList(1, 5)
  },
  methods: {
    /**
     * 分页获取 sku 概要数据
     * @param page
     * @param count
     * @returns {Promise<*>}
     */
    async getSkuSummaryList(page, count) {
      const res = await Sku.getSkuSummary(page, count)
      this.formateDate(res.items)
      this.formateOnline(res.items)
      this.$data.skuList = res.items
      console.log(res)
      return res
    },
    /**
     * 格式化创建时间
     * @param items
     */
    formateDate(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
      })
    },
    /**
     * 格式化上下架
     * @param items
     */
    formateOnline(items) {
      items.forEach(item => {
        if (item.online) {
          item.online = '上线'
        } else {
          item.online = '下线'
        }
      })
    },
    addSku() {

    },
    handerDetail(id) {
      console.log('触发编辑')
      this.$data.detailFlag = true
      this.$data.id = id
    },
    /**
     * 执行删除操作
     */
    handlerRemove() {
      console.log()
    },
    pageEmit() {
    },
    /**
     * 监听detail页面发出的“返回”事件
     */
    rollback() {
      console.log('监听到返回事件')
      this.$data.detailFlag = false
      this.$data.id = -1
    }
  },
  data() {
    return {
      id: -1,
      skuList: [],
      total: 0,
      pageSize: 1,
      removeFlag: false,
      detailFlag: false
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
  .add_sku_btn {
    margin-left: 20px;
  }
</style>
