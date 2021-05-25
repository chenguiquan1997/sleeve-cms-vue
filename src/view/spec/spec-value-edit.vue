<template>
  <el-dialog title="修改规格值" :visible="this.dialogFormVisible" :show-close="false">
    <el-form :model="formData">
      <el-form-item label="名称" prop="value">
        <el-input v-model="formData.value"></el-input>
      </el-form-item>
      <el-form-item label="扩展" prop="extend">
        <el-input v-model="formData.extend" placeholder="请输入规格值扩展"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="this.valueId !== -1" @click="updateDialog" v-permission="{ permission: '更新规格', type: 'disabled' }">更新</el-button>
      <el-button v-if="this.specId1 !== -1" @click="createDialog" v-permission="{ permission: '创建规格', type: 'disabled' }">保存</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Spec } from '../../model/spec'

export default {
  name: 'spec-value-edit',
  props: {
    // 规格值id
    id: {
      Type: Number,
      Default: -1
    },
    dialogFormVisible: {
      Type: Boolean,
      Default: false
    },
    // 规格id
    specId: {
      Type: Number,
      Default: -1
    }
  },
  watch: {
    id() {
      this.$data.valueId = this.id
      // 根据id，查询当前的规格值数据
      this.getSpecValueById(this.id)
    },
    specId() {
      console.log('进入specId赋值逻辑：')
      this.$data.specId1 = this.specId
    }
  },
  created() {
  },
  methods: {
    /*
    * 更新规格值
    * */
    async updateDialog() {
      const res = await Spec.updateSpecValue(this.$data.formData)
      this.$message({
        type: res.code === 2 ? 'success' : 'error',
        message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
      })
      this.$data.valueId = -1
      // 自动取消dialog显示
      this.cancelDialog()
    },
    /**
     * 创建规格值
     */
    async createDialog() {
      console.log('触发创建规格值')
      if (this.specId !== -1) {
        // 执行创建逻辑
        this.$data.formData.key_id = this.specId
        console.log(this.$data.formData)
        const res = await Spec.addSpecValue(this.$data.formData)
        console.log(res.code)
        this.$message({
          type: res.code === 1 ? 'success' : 'error',
          message: res.code === 1 ? '创建成功!' : '创建失败，请稍后重试~'
        })
        this.$data.specId1 = -1
        // 自动取消dialog显示
        this.cancelDialog()
      }
    },
    /**
     * 取消dialog显示
     */
    cancelDialog() {
      this.$emit('spec-value-cancel-event')
    },
    async getSpecValueById(id) {
      const res = await Spec.searchSpecValueById(id)
      this.$data.formData = res
    }
  },
  data() {
    return {
      formData: {
        id: null,
        value: null,
        extend: null,
        key_id: null
      },
      valueId: -1,
      specId1: -1
    }
  }
}
</script>

<style scoped>

</style>
