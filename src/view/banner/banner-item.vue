<template>
  <div class="container">
    <div class="top_container">
      <div class="title">{{isCreate ? '添加Banner-Item详情' : 'Banner-item详情'}}</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider></el-divider>

    <el-form ref="form" :model="formData" label-width="80px" @submit.native.prevent>
      <el-form-item label="名称">
        <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="formData.keyword" placeholder="请输入主键id"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <!--        <el-input v-model="initData.type_name"></el-input>-->
        <el-autocomplete
          v-model="formData.type_name"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入类型"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="图片">
        <upload-imgs ref="uploadImg" :value="[{ display: formData.img }]"></upload-imgs>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveClick">保存</el-button>
        <el-button type="primary" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import UploadImgs from '../../component/base/upload-image/index'
  import { Banner } from '../../model/banner'

  export default {
  name: 'banner-item',
  components: { UploadImgs },
  props: {
    id: {
      Type: Number
    },
    isCreate: {
      Type: Boolean
    },
    bannerId: {
      Type: Number
    }
  },
  async created() {
    console.log('item-detail 初始化数据')
    // 表示用户点击的是 ‘编辑’ 按钮
    if (!this.isCreate) {
      this.formData = await Banner.searchItem(this.id)
    }
  },
  methods: {
    /**
     * 返回按钮触发的方法
     */
    rollbackClick() {
      this.$emit('item-close-emit')
    },
    /**
     * 保存按钮触发的方法
     */
    async saveClick() {
      console.log('保存中的formData')
      console.log(this.formData)
      let res = null
      if (!this.isCreate) {
        // 更新banner-item
        res = await Banner.updateItem(this.formData, this.formData.id)
      } else {
        // 创建Banner-item
        this.formData.banner_id = this.bannerId
        const imgRef = await this.$refs.uploadImg.getValue()
        this.formData.img = imgRef[0].display
        res = await Banner.createItem(this.formData)
      }
      if (res.code === 2 || res.code === 21004) {
        this.$message({
          message: this.isCreate ? '添加成功' : '更新成功',
          type: 'success',
        })
      } else {
        this.$message.error(this.isCreate ? '添加失败，请稍后重试~' : '更新失败，请稍后重试~')
      }
    },
    // 延迟加载 banner-item 类型列表
    async querySearchAsync(queryString, cb) {
      console.log('服务器远程搜索')
      const res = await Banner.searchtypes()
      console.log('搜索的数据')
      console.log(res)
      if (res.length === 0) {
        this.$message.error('获取数据失败，请稍后重试~')
      }
      cb(res)
    },
    /**
     *
     */
    handleSelect(item) {
      console.log(item)
    },
  },
  data() {
    return {
      formData: {
        img: '',
        keyword: '',
        type: null,
        type_name: '',
        banner_id: ''
      }
    }
  },
}
</script>
<!--scss为css的预处理模式-->
<style lang="scss" scoped>
.top_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title {
  color: $theme;
}
.rollback {
  cursor: pointer;
}
</style>
