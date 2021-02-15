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
            :value="[{ display: formData.img}]"
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
          <el-button type="primary" @click="submitClick"
                     v-permission="{permission: '创建Banner', type: 'disabled'}">更新</el-button>
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
      Type: Number
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    rollbackClick() {
      this.$emit('rollback-event')
    },
    async getDetail() {
      const res = await Category.getCategoryDetail(this.id)
      this.$data.formData = res
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
     * 更新表单
     */
    async submitClick() {
      console.log('更新时打印的结果')
      const img = await this.$refs.mainImgRef.getValue()
      this.$data.formData.img = img[0].display
      console.log(this.$data.formData)
    }
  },
  data() {
    return {
      formData: {
        name: '测试',
        level_name: '一级分类',
        online: false,
        parent_name: null,
        img: null,
        description: null
      }
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
