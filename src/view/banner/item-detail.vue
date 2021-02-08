<template>
  <div class="container">
    <div class="top_container">
      <div class="title">Banner-Item详情</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider></el-divider>

    <el-form ref="form" :model="initData" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="initData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="initData.keyword"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <!--        <el-input v-model="initData.type_name"></el-input>-->
        <el-autocomplete
          v-model="initData.type_name"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入类型"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="图片">
        <upload-imgs ref="uploadImg" :value="[{ display: initData.img }]"></upload-imgs>
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
  name: 'item-detail',
  components: { UploadImgs },
  props: {
    initData: {
      Type: Object,
    },
  },
  created() {
    console.log('item-detail 初始化数据')
    console.log(this.initData)
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
      console.log('保存中的initData')
      console.log(this.initData)
      const saveData = this.initData
      // saveData.type = null
      console.log(saveData)
      // 更新banner-item
      const res = await Banner.updateItem(saveData)
      if (res.code === 2) {
        this.$message({
          message: '更新成功',
          type: 'success',
        })
      } else {
        this.$message.error('更新失败，请稍后重试~')
      }
    },
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
    return {}
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
