<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="space-between">
      <el-col :span="12">
          <div class="top_container">
            <div class="title">规格详情</div>
            <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
          </div>
          <el-divider></el-divider>
          <el-form class="form_container" ref="form" :model="formData" label-position="left">
            <el-form-item label="规格名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="规格描述" prop="description">
              <el-input v-model="formData.description" placeholder="请输入规格描述"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入当前规格单位"></el-input>
            </el-form-item>
            <el-form-item label="是否标准" prop="standard">
              <el-switch v-model="formData.standard"
                         active-text="标准" inactive-text="非标"
                         active-color="#3963bc" inactive-color="#ff4949"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitClick"
                         v-permission="{permission: '创建规格', type: 'disabled'}">更新</el-button>
              <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="12">
        <div class="top_container1">
          <div class="title">规格值列表</div>
          <el-button class="add_spec_btn" type="primary" plain @click="addSpecValue"
                     v-permission="{permission: '创建规格值', type: 'disabled'}">
            添加规格值</el-button>
        </div>
        <el-divider></el-divider>
        <el-table :data="specValueList" style="width: 100%" :stripe="true">
          <el-table-column fixed prop="id" label="id" width="70"></el-table-column>
          <el-table-column prop="value" label="规格值名称" width="120"></el-table-column>
          <el-table-column prop="extend" label="扩展" width="120"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handlerEditItem(scope.row.id)" type="primary" plain size="mini">编辑</el-button>
              <el-button type="danger" v-permission="{ permission: '删除规格值', type: 'disabled' }"
                         size="mini" plain @click="handlerRemoveItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <page @page-event="pageEmit" :current-page="this.$data.page"
              :total="this.$data.total" :page-size="this.$data.pageSize"
              :remove-flag="this.$data.removeFlag"></page>
      </el-col>
    </el-row>
    <spec-value-edit :dialog-form-visible="this.$data.showDialog" :id="this.$data.valueId"
                     :spec-id="this.$data.keyId" @spec-value-cancel-event="specValueCancel"></spec-value-edit>
  </div>
</template>

<script>
import { Spec } from '../../model/spec'
import Page from '../../component/custom/page'
import { getSlashYMDHMS } from '../../util/date-1'
import SpecValueEdit from './spec-value-edit'

export default {
  name: 'spec-detail',
  components: { SpecValueEdit, Page },
  props: {
    id: {
      Type: Number,
      Default: -1
    }
  },
  created() {
    if (this.id !== -1) {
      console.log('id值：')
      console.log(this.id)
      this.getSpecKeyDetail(this.id)
      this.getSpecValue(this.id, 1, this.$data.pageSize)
    }
  },
  methods: {
    /*
    * 根据规格id,获取规格值
    * */
    async getSpecValue(id, page, size) {
      const res = await Spec.getSpecValueById(id, page, size)
      console.log('规格值列表：')
      console.log(res)
      this.formatDate(res.items)
      this.$data.specValueList = res.items
      this.$data.total = res.total
    },
    /**
     * 格式化日期
     * @param items
     */
    formatDate(items) {
      items.forEach(item => {
        item.create_time = getSlashYMDHMS(item.create_time)
      })
    },
    /**
     * 根据规格id,查询指定规格
     */
    async getSpecKeyDetail(id) {
      const spec = await Spec.getSpecDetailById(id)
      spec.create_time = getSlashYMDHMS(spec.create_time)
      this.$data.formData = spec
    },
    /**
     * 点击"返回"按钮，发出到父组件的事件
     */
    rollbackClick() {
      this.$emit('rollback-emit')
    },
    /**
     * 点击“更新”按钮，触发的事件
     */
    async submitClick() {
      console.log(this.$data.formData)
      const res = await Spec.updateSpecKey(this.$data.formData)
      console.log(res)
      this.$message({
        type: res.code === 2 ? 'success' : 'error',
        message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
      })
    },
    /**
     * 重置表单操作
     */
    resetForm() {
    },
    /**
     * 添加规格值
     */
    addSpecValue() {
      console.log('触发添加规格值操作')
      //  需要传入规格id
      this.$data.showDialog = true
      this.$data.keyId = this.id
    },
    /**
     * 点击规格值中的“编辑”按钮
     * @param id
     */
    handlerEditItem(id) {
      this.$data.showDialog = true
      this.$data.valueId = id
      console.log(`valueId：${this.$data.valueId}`)
    },
    /**
     * 点击规格值中的“删除”按钮
     * @param id
     */
    handlerRemoveItem(id) {
    },
    /**
     * 点击页码触发的操作
     * @param page
     */
    pageEmit(page) {
      this.$data.page = page
      console.log(`收到的页码：${page}`)
      this.getSpecValue(this.id, page, this.$data.pageSize)
    },
    /**
     * 取消显示dialog
     */
    specValueCancel() {
      this.$data.showDialog = false
      // 主动刷新当前页面数据
      this.getSpecValue(this.id, this.$data.page, this.$data.pageSize)
    }
  },
  data() {
    return {
      formData: {
        id: -1,
        name: null,
        description: null,
        unit: null,
        standard: null,
      },
      specValueList: null,
      page: 1,
      total: 0,
      pageSize: 8,
      removeFlag: false,
      showDialog: false,
      valueId: -1,
      keyId: -1
    }
  }
}
</script>

<style scoped lang="scss">
  .top_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: $theme;
    margin-top: 20px;
  }
  .top_container1 {
    display: flex;
    flex-direction: row;
    color: $theme;
    margin-top: 20px;
    align-items: center;
  }
  .rollback {
    cursor: pointer;
  }
  .title {
    text-align: center;
    color: $theme;
    height: 30px;
  }
  .add_spec_btn {
    height: 30px;
    margin-left: 30px;
  }
</style>
