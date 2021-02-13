<template>
    <div class="container">
      <div class="top_container">
        <div class="title">分类详情</div>
        <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
      </div>
      <el-divider></el-divider>
      <el-form class="form_container" ref="form" :model="" label-width="80px">
        <el-form-item label="" prop="">
          <el-input v-model="" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-input v-model="" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <upload-imgs
            ref="mainImgRef"
            :value="[{ display:  }]"
            :sortable="true"
            :max-num="1"
          ></upload-imgs>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model=".description" type="textarea"
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
export default {
  name: 'category-detail',
}
</script>

<style scoped lang="scss">
.container {
}
</style>
