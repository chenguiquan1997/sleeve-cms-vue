<template>
    <div class="container">
      <div class="top_container">
        <div class="title">创建规格</div>
        <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
      </div>
      <el-divider class="devider"></el-divider>
      <el-form class="form_container" ref="form" :model="formData" label-width="80px">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
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
                     v-permission="{permission: '创建规格', type: 'disabled'}">保存</el-button>
          <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import { Spec } from '../../model/spec'

export default {
  name: 'spec-create',
  props: {
  },
  created() {
  },
  methods: {
    /**
     * 点击“返回”按钮时触发
     */
    rollbackClick() {
      this.$router.push({
          path: '/spec/list'
      })
    },
    /**
     * 点击“保存”按钮时，触发
     */
    async submitClick() {
      if (this.$data.formData.name === null) {
        this.$message({
          type: 'error',
          message: '规格名称不能为空~'
        })
      }
      let res = await Spec.saveKey(this.$data.formData)
      this.$message({
        type: res.code === 1 ? 'success' : 'error',
        message: res.code === 1 ? '创建成功!' : '创建失败，请稍后重试~'
      })
      // 主动触发返回操作
      this.rollbackClick()
    }
  },
  data() {
    return {
      formData: {
        name: null,
        description: null,
        unit: null,
        standard: null
      }
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
    margin: 20px 30px 0 30px;
    width: 900px;
  }
  .rollback {
    cursor: pointer;
  }
  .title {
    text-align: center;
    color: $theme;
    height: 30px;
  }
  .devider {
    margin-left: 30px;
    width: 900px;
  }
  .form_container {
    width: 600px;
    margin-left: 30px;
  }
</style>
