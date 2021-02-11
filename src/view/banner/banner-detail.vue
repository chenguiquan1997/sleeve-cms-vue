<template>
  <div class="container" v-if="!itemFlag">
    <div class="top_container">
      <div class="title">Banner详情</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider></el-divider>
    <el-form class="form_container" ref="form" :model="bannerDetailData" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="bannerDetailData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="bannerDetailData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <upload-imgs
          ref="mainImgRef"
          :value="[{ display: bannerDetailData.img }]"
          :sortable="true"
          :max-num="1"
        ></upload-imgs>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="bannerDetailData.description" type="textarea"
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
    <!--      banner-item 内容-->
    <el-divider class="item-divider"></el-divider>
    <div class="item_top_container">
      <div class="title">Banner-Item列表</div>
      <el-button class="add_item_btn" type="primary" plain @click="addBannerItem"
                v-permission="{permission: '创建Banner', type: 'disabled'}">
        添加Banner-Item</el-button>
    </div>
    <el-table :data="bannerItems" style="width: 100%">
      <el-table-column fixed prop="id" label="id" width="80"></el-table-column>
      <el-table-column prop="img" label="图片">
        <el-image v-if="scope.row.img" slot-scope="scope" :src="scope.row.img"></el-image>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="keyword" label="item唯一标识"></el-table-column>
      <el-table-column prop="type_name" label="类型"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handlerEditItem(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button type="danger" v-permission="{ permission: '删除Banner', type: 'disabled' }"
                     size="mini" plain @click="handlerRemoveItem">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
<!--  <banner-item v-else @item-close-emit="itemCloseEmit" :init-data="itemData"></banner-item>-->
  <banner-item v-else @item-close-emit="itemCloseEmit" :id="itemId" :is-create="isCreate"
               :banner-id="this.bannerDetailData.id"></banner-item>
</template>

<script>
import BannerList from './banner-list'
import { Banner } from '../../model/banner'
import UploadImgs from '../../component/base/upload-image/index'
import { getSlashYMDHMS } from '../../util/date-1'
import BannerItem from './banner-item'

export default {
  name: 'banner-detail',
  props: {
    detailId: {
      type: Number,
    },
  },
  components: {
    BannerItem,
    UploadImgs,
    // eslint-disable-next-line vue/no-unused-components
    BannerList,
  },
  async created() {
    console.log('detail 中的')
    console.log(this.detailId)
    this.getBannerDetailById(this.detailId)
  },
  methods: {
    /**
     * 触发返回操作
     */
    rollbackClick() {
      console.log('点击返回按钮触发')
      this.$emit('detail-close-emit')
    },
    /**
     * 获取banner详情
     */
    async getBannerDetailById(id) {
      const bannerAndItems = await Banner.getBannerDetailById(id)
      console.log(bannerAndItems)
      this.$data.bannerDetailData = bannerAndItems
      console.log('items 数据')
      console.log(bannerAndItems.banner_items)
      this.formatDate(bannerAndItems.banner_items)
      this.$data.bannerItems = bannerAndItems.banner_items
    },
    /**
     * 提交表单
     * @returns {Promise<void>}
     */
    async submitClick() {
      const imgData = await this.$refs.mainImgRef.getValue()
      const paramData = {}
      paramData.name = this.bannerDetailData.name
      paramData.title = this.bannerDetailData.title
      if (imgData.length > 0) {
        paramData.img = imgData[0].display
      }
      paramData.description = this.bannerDetailData.description
      const res = await Banner.update(this.detailId, paramData)
      console.log(res)
      if (res.code === 2) {
        this.$message({
          message: '保存成功',
          type: 'success',
        })
      } else {
        this.$message.error('保存失败，请稍后重试')
      }
    },
    /**
     * 重置detail表单
     */
    resetForm(formName) {
      console.log('进入重置方法')
      this.$refs[formName].resetFields()
    },
    /**
     * 格式化日期数据
     * @param bannerItemList
     */
    formatDate(bannerItemList) {
      bannerItemList.forEach(bannerItem => {
        bannerItem.create_time = getSlashYMDHMS(bannerItem.create_time)
      })
    },
    /**
     * 点击"编辑"按钮，携带数据，跳转到banner-item详情页
     */
    handlerEditItem(data) {
      console.log('点击编辑按钮，接收到的数据')
      this.itemFlag = true
      this.itemId = data.id
    },
    /**
     * 删除指定BannerItem
     */
    handlerRemoveItem() {
      console.log('删除指定BannerItem')
    },
    /**
     * banner-item 页面点击 ‘返回’时，触发的操作
     */
    itemCloseEmit() {
      this.itemFlag = false
      this.isCreate = false
    },
    /**
     * 添加 banner-item
     */
    addBannerItem() {
      console.log('添加banner-item')
      this.itemFlag = true
      this.isCreate = true
    },
  },
  data() {
    return {
      bannerDetailData: null,
      // 是否显示banner-item组件的标记
      itemFlag: false,
      // 是否为创建banner-item的标记
      isCreate: false,
      bannerItems: null,
      itemId: null,
    }
  },
}
</script>

<style lang="scss" scoped>
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
  text-align: center;
  color: $theme;
}
.form_container {
  width: 600px;
}
.item-divider {
  margin-bottom: 12px;
}
.item_top_container {
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  margin-bottom: 12px;
}
.add_item_btn {
  height: 32px;
  margin-left: 20px;
}
</style>
