<template>
  <el-dialog title="更新六宫格" :visible="this.dialogFormVisible" :show-close="false">
    <el-form :model="formData">
      <el-form-item label="状态" prop="online">
        <el-switch v-model="formData.grid_online"
                   active-text="上线" inactive-text="下线"
                   active-color="#3963bc" inactive-color="#ff4949"/>
      </el-form-item>
      <el-form-item label="图片" prop="grid_img">
        <upload-imgs
          ref="mainImgRef"
          :value="this.initData"
          :sortable="true"
          :max-num="1"
        ></upload-imgs>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="updateDialog">更新</el-button>
      <el-button type="primary" @click="cancelDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Grid } from '../../model/grid'
import UploadImgs from '../../component/base/upload-image/index'
import { Category } from '../../model/category'

export default {
  name: 'grid-edit',
  components: { UploadImgs },
  props: {
    dialogFormVisible: {
      Type: Boolean,
      Default: false
    },
    id: {
      Type: Number,
      Default: -1
    }
  },
  async created() {
    console.log(`create方法打印的：${this.dialogFormVisible}`)
    console.log(`编辑组件收到的id: ${this.id}`)
    if (this.id !== -1 && this.id > 0) {
      console.log('进入获取grid方法')
      let res = await Grid.getGridById(this.id)
      this.formData = res
      console.log(res)
      this.initData = [{ display: res.grid_img }]
    }
  },
  mounted() {
    console.log('进入mounted方法')
  },
  methods: {
    /**
     * 点击“更新”按钮，触发的操作
     */
    async updateDialog() {
      console.log('更新')
      let imgData = await this.$refs.mainImgRef.getValue()
      let img = imgData[0].display
      this.$data.formData.grid_img = img
      const res = await Category.updateGridById(this.$data.formData)
      console.log(res)
      this.$message({
        type: res.code === 2 ? 'success' : 'error',
        message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
      })
      this.cancelDialog()
    },
    /**
     * 点击“取消”按钮，触发的操作
     */
    cancelDialog() {
      this.$emit('dialog-event')
    }
  },
  data() {
    return {
      formData: {
        id: null,
        grid_online: null,
        grid_img: ''
      },
      initData: []
    }
  }
}
</script>

<style scoped>

</style>
