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
      <el-button @click="updateDialog" v-permission="{ permission: '创建规格', type: 'disabled' }">更新</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Spec } from '../../model/spec'

export default {
  name: 'spec-value-edit',
  props: {
    id: {
      Type: Number,
      Default: -1
    },
    dialogFormVisible: {
      Type: Boolean,
      Default: false
    }
  },
  watch: {
    id: function () {
      this.$data.valueId = this.id
      // 根据id，查询当前的规格值数据
      this.getSpecValueById(this.id)
    }
  },
  created() {
  },
  methods: {
    /*
    * 更新规格值
    * */
    async updateDialog() {
      let res = await Spec.updateSpecValue(this.$data.formData)
      this.$message({
        type: res.code === 2 ? 'success' : 'error',
        message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
      })
      // 自动取消dialog显示
      this.cancelDialog()
    },
    /**
     * 取消dialog显示
     */
    cancelDialog() {
      this.$emit('spec-value-cancel-event')
    },
    async getSpecValueById(id) {
      let res = await Spec.searchSpecValueById(id)
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
      valueId: -1
    }
  }
}
</script>

<style scoped>

</style>
