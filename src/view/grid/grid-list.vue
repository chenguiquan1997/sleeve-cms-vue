<template>
  <div class="container" >
    <div class="top_container">
      <div class="title">六宫格列表</div>
      <el-button class="add_category_btn" type="primary" plain @click="addGrid"
                 v-permission="{permission: '创建Grid', type: 'disabled'}">
        创建六宫格</el-button>
    </div>
    <el-table :data="gridList" style="width: 100%" :stripe="true">
      <el-table-column fixed prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="grid_img" label="图片" width="200">
        <el-image v-if="scope.row.grid_img" slot-scope="scope" :src="scope.row.grid_img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="分类" width="150"></el-table-column>
      <el-table-column prop="grid_online" label="状态" width="150"></el-table-column>
      <el-table-column prop="idx" label="排序" width="150"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handlerEditItem(scope.row.id)" type="primary" plain size="mini">查看</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Grid', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <grid-edit v-if="this.$data.showDialogComponent" :dialog-form-visible="this.showDialogFlag"
               :id="this.$data.id" @dialog-event="dialogEvent"></grid-edit>
  </div>
</template>

<script>
import { Grid } from '../../model/grid'
import { getSlashYMDHMS } from '../../util/date-1'
import GridEdit from './grid-edit'
import { Category } from '../../model/category'

export default {
  name: 'grid-list',
  components: { GridEdit },
  props: {
  },
  created() {
    this.getGrids()
  },
  methods: {
    addGrid() {
      console.log('触发addGrid')
    },
    /**
     * 获取六宫格数据
     */
    async getGrids() {
      let res = await Grid.getGrid()
      console.log('grid数据：')
      console.log(res)
      this.formatDateAndOnline(res)
      this.$data.gridList = res
    },
    /**
     * 格式化日期,online数据
     * @param items
     */
    formatDateAndOnline(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
        if (item.grid_online) {
          item.grid_online = '上线'
        } else {
          item.grid_online = '下线'
        }
      })
    },
    /**
     * 点击“查看”按钮时，触发的操作
     * @param id
     */
    handlerEditItem(id) {
      this.$data.showDialogFlag = true
      this.$data.showDialogComponent = true
      this.$data.id = id
    },
    /**
     * 用户在dialog组件中，点击“取消”按钮，发出的事件，回传到父组件的操做
     */
    dialogEvent() {
      this.$data.showDialogFlag = false
      this.$data.showDialogComponent = false
    },
    /**
     * 点击“删除”按钮，触发的操作
     * @param id
     */
    async handlerRemoveItem(id) {
      console.log('触发删除操作')
      console.log(id)
      let res = await Category.removeGridById(id)
      this.$message({
        type: res.code === 3 ? 'success' : 'error',
        message: res.code === 3 ? '删除成功!' : '删除失败，请稍后重试~'
      })
      this.getGrids()
    }
  },
  data() {
    return {
      gridList: null,
      showDialogFlag: false,
      id: -1,
      showDialogComponent: false
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
