<template>
  <div class="container">
    <div class="top_container">
      <div class="title">创建Banner</div>
<!--      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>-->
    </div>
    <el-divider class="divider"></el-divider>
    <el-form class="form_container" ref="form" :model="formData" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <upload-imgs ref="mainImgRef" :value="initData" :sortable="true" :max-num="1"></upload-imgs>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea"
                  maxlength="30" placeholder="请输入当前Banner的描述"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitClick"
                   v-permission="{permission: '创建Banner', type: 'disabled'}">保存</el-button>
        <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImgs from '../../component/base/upload-image/index'
import { Banner } from '../../model/banner'

export default {
  name: 'banner-create',
  components: { UploadImgs },
  props: {
  },
  methods: {
    async submitClick() {
      const imgData = await this.$refs.mainImgRef.getValue()
      this.formData.img = imgData[0].display
      console.log(imgData)
      console.log(this.formData)
      const res = await Banner.saveBanner(this.formData)
      console.log(res)
      if (res.code === 1) {
        this.$message({
          message: '保存成功',
          type: 'success',
        })
      } else {
        this.$message({
          message: res.code === 20004 ? 'Banner名称重复，请修改~' : '保存失败，请稍后重试~',
          type: 'error',
        })
      }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        title: '',
        img: '',
        description: ''
      },
      initData: []
    }
  }
}

</script>

<style scoped lang="scss">
  .container {
    margin-bottom: 100px;
  }
  .top_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: $theme;
    margin-top: 30px;
  }
  .rollback {
    cursor: pointer;
  }
  .title {
    margin-left: 30px;
    text-align: center;
    color: $theme;
  }
  .form_container {
    width: 600px;
  }
  .divider {
    margin-left: 30px;
    width: 913px;
  }
</style>
