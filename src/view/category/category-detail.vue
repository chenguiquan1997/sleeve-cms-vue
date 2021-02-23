<template>
    <div class="container">
      <div class="top_container">
        <div class="title">分类详情</div>
        <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
      </div>
      <el-divider></el-divider>
      <el-form class="form_container" ref="form" :model="formData" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="分类等级" prop="level_name">
          <el-input v-model="formData.level_name" placeholder="请输入标题" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="online">
          <el-switch v-model="formData.online"
                     active-text="上线" inactive-text="下线"
                     active-color="#3963bc" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="父级分类" prop="parent_name">
          <el-autocomplete :disabled="true"
            v-model="formData.parent_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入父级分类"
            @select="handleSelect"
          >
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <upload-imgs
            ref="mainImgRef"
            :value="this.initData"
            :sortable="true"
            :max-num="1"
          ></upload-imgs>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea"
                    maxlength="30" placeholder="请输入当前Banner的描述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="this.id !== -1" type="primary" @click="submitClick"
                     v-permission="{permission: '创建分类', type: 'disabled'}">更新</el-button>
          <el-button v-else type="primary" @click="saveClick"
                     v-permission="{permission: '创建分类', type: 'disabled'}">保存</el-button>
          <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>

import UploadImgs from '../../component/base/upload-image/index'
import { Category } from '../../model/category'

export default {
  name: 'category-detail',
  components: { UploadImgs },
  props: {
    id: {
      Type: Number,
      Default: -1
    },
    // 当用户点击“添加分类”按钮时，用于区分是哪一个级别的分类
    categoryLevel: {
      Type: Number
    },
    // 如果添加的是二级分类，那么还需要得到它父级分类的id
    parentId: {
      Type: Number,
      Default: -1
    }
  },
  async created() {
    // 表示用户点击“查看”按钮，触发的操作
    if (this.id !== -1) {
      this.getDetail()
      console.log('点击查看按钮进入')
      console.log(`categoryId: ${this.id}`)
    } else if (this.categoryLevel === 1) { // 表示用户点击“添加一级分类”按钮，触发的操作
      this.$data.formData.is_root = 1
      this.$data.formData.level_name = '一级分类'
      this.$data.formData.level = 1
      this.$data.formData.parent_name = '无'
      console.log('点击一级分类按钮进入')
    } else if (this.categoryLevel === 2 && this.parentId !== -1) { // 表示用户点击“添加二级分类”按钮，触发的操作
      this.$data.formData.is_root = 0
      this.$data.formData.parent_id = this.parentId
      this.$data.formData.level_name = '二级分类'
      this.$data.formData.level = 1
      // 需要根据父级分类id,查询父级分类名
      let name = await Category.getName(this.parentId)
      this.$data.formData.parent_name = name
      console.log('点击二级分类按钮进入')
    }
  },
  methods: {
    /**
     * 用户在分类详情页点击“返回”按钮时，触发的事件
     */
    rollbackClick() {
      this.$emit('rollback-event')
    },
    async getDetail() {
      const res = await Category.getCategoryDetail(this.id)
      this.$data.formData = res
      this.$data.initData = [{ display: res.img }]
      console.log('后端返回的res')
      console.log(res)
    },
    /**
     * 异步搜索父级分类(因为当前只有两级分类，所以只需要搜索所有一级分类即可)
     */
    querySearchAsync(queryString, cb) {
      console.log('服务器远程搜索')
      const res = null
      console.log('搜索的数据')
      console.log(res)
      if (res.length === 0) {
        this.$message.error('获取数据失败，请稍后重试~')
      }
      cb(res)
    },
    /**
     *
     * */
    handleSelect() {
    },
    /**
     * 更新分类数据
     */
    async submitClick() {
      console.log('更新时打印的结果')
      const img = await this.$refs.mainImgRef.getValue()
      this.$data.formData.img = img[0].display
      console.log(this.$data.formData)
      const res = await Category.updateCategoryDetail(this.$data.formData)
      console.log('更新分类返回结果')
      console.log(res)
      if (res.code === 2) {
        this.$message({
          type: res.code === 2 ? 'success' : 'error',
          message: res.code === 2 ? '更新成功!' : '更新失败，请稍后重试~'
        })
      }
    },
    /**
     * 新增分类数
     */
    async saveClick() {
      console.log('触发新增分类数据操作')
      const imgData = await this.$refs.mainImgRef.getValue()
      const img = imgData[0].display
      this.formData.img = img
      console.log(this.formData)
      let res = await Category.save(this.formData)
      console.log(res)
      if (res.code === 1) {
        this.$message({
          type: res.code === 1 ? 'success' : 'error',
          message: res.code === 1 ? '创建成功!' : '创建失败，请稍后重试~'
        })
      }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        level_name: '',
        online: false,
        parent_name: null,
        img: null,
        description: null,
        parent_id: null,
        id: null,
        is_root: null,
        level: null
      },
      initData: []
    }
  }
}
</script>

<style scoped lang="scss">
.container {
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
  text-align: center;
  color: $theme;
}
.form_container {
    width: 600px;
  }
</style>
