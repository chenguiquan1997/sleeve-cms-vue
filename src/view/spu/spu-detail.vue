<template>
  <div class="container">
    <div class="top_container">
      <div class="title">规格详情</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider></el-divider>
    <el-form class="form_container" ref="form" :model="formData" label-position="left" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input v-model="formData.subtitle" placeholder="请输入副标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="formData.price" placeholder="请输入当前商品真实价格"></el-input>
      </el-form-item>
      <el-form-item label="折扣价" prop="discount_price">
        <el-input v-model="formData.discount_price" placeholder="请输入当前商品折扣价"></el-input>
      </el-form-item>
<!--      <el-form-item label="所属分类" prop="category_name">-->
<!--        <el-input v-model="formData.category_name" placeholder="请输入所属分类"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="所属分类" prop="category_name">
        <el-cascader
          placeholder="试试搜索：服装..." v-model="selectedCategory" :options="categories" filterable></el-cascader>
      </el-form-item>
      <el-form-item label="默认SKU" prop="default_sku">
<!--        <el-input v-model="formData.default_sku" placeholder="请输入默认SKU"></el-input>-->
        <el-select v-model="selectedSku"
                   filterable @focus="skuFocus" placeholder="请选择默认SKU">
          <el-option
            v-for="item in this.$data.defaultSkus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架" prop="online">
        <el-switch v-model="formData.online"
                   active-text="上架" inactive-text="下架"
                   active-color="#3963bc" inactive-color="#ff4949"/>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <upload-imgs ref="mainImgRef" :value="this.mainImgData" :sortable="true" :max-num="1"></upload-imgs>
      </el-form-item>
      <el-form-item label="主题图" prop="img">
        <upload-imgs ref="themeImgRef" :value="this.themeImgData" :sortable="true" :max-num="1"></upload-imgs>
      </el-form-item>
      <el-form-item label="轮播图" prop="img">
        <upload-imgs ref="rotationImgRef" :value="this.rotationImgData" :sortable="true"></upload-imgs>
      </el-form-item>
      <el-form-item label="详情图" prop="img">
        <upload-imgs ref="detailImgRef" :value="this.detailImgData" :sortable="true"></upload-imgs>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag :key="tag" v-for="tag in this.$data.formData.tag_list" closable
                :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
      </el-form-item>
      <el-form-item label="选择规格" prop="specs">
       <el-cascader placeholder="选择规格（可多选）" v-model="specs" :props="cascaderProps"></el-cascader>
      </el-form-item>
      <el-form-item label="可视规格">
        <el-select  size="medium"  v-model="selectedSketchSpec" placeholder="请选择" @focus="sketchSpecFocus">
          <el-option v-for="item in sketchSpecs" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea"
                  maxlength="30" placeholder="请输入当前SPU的描述"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitClick"
                   v-permission="{permission: '创建规格', type: 'disabled'}">更新</el-button>
        <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImgs from '../../component/base/upload-image/index'
import { Spu } from '../../model/Spu'
import { Spec } from '../../model/spec'
import { Category } from '../../model/category'
import { Sku } from '../../model/sku'

export default {
  name: 'spu-detail',
  components: { UploadImgs },
  props: {
    id: {
      Type: Number,
      Default: -1
    }
  },
  created() {
  },
  mounted() {
    if (this.id !== -1) {
      this.getSpuDetail(this.id)
      this.getCategories()
    }
  },
  methods: {
    /**
     * 获取当前SPU明细
     * @param id
     */
    async getSpuDetail(id) {
      const res = await Spu.getSpuDetail(id)
      console.log(res)
      this.$data.formData = res
      // 获取标签数据
      this.$data.dynamicTags = res.tag_list
      this.$data.mainImgData = [{ display: res.img }]
      this.$data.themeImgData = [{ display: res.for_theme_img }]
      this.$data.rotationImgData = res.rotation_imgs ? res.rotation_imgs.map((it, index) => ({ id: index, display: it })) : []
      this.$data.detailImgData = res.spu_detail_imgs ? res.spu_detail_imgs.map((it, index) => ({ id: index, display: it })) : []
      this.initSpecs(res.spu_specs)
      this.initCategory(res.root_category_id, res.category_id)
      // this.initDefaultSku(res.default_sku_id, res.default_sku)
      console.log('初始化的规格值：')
      console.log(this.$data.specs)
    },
    /**
     * 初始化当前SPU的已选规格
     */
    initSpecs(specs) {
      this.$data.specs = specs.map(item => [item.id])
    },
    /**
     * 初始化当前SPU的已选分类
     */
    initCategory(rootId, cId) {
      this.selectedCategory = [rootId, cId]
    },
    /**
     * 初始化默认sku
     */
    initDefaultSku(id, name) {
      this.$data.selectedSku.value = id
      this.$data.selectedSku.label = name
      console.log('初始化默认sku')
      console.log(this.$data.skukey)
      console.log(this.$data.skuValue)
    },
    /**
     * 默认sku选择器,获得焦点时，触发的事件
     */
    async skuFocus() {
      // 获取焦点后，需要从远程服务器获取当前SPU所拥有的SKU数据
      const res = await Sku.getSkusBySpuId(this.id)
      this.$data.defaultSkus = res
      console.log(res)
    },
    /**
     * 可视化规格选择器,获得焦点时，触发的事件
     */
    async sketchSpecFocus() {
      // 先拿到当前spu所拥有的规格id
      const s = this.$data.specs
      // 拼接的可视化规格字符串
      let ids = String('')
      s.forEach(item => {
        ids = ids.concat(item[0])
          .concat(',')
      })
      ids = ids.slice(0, -1)
      // 去服务器查j
      const res = await Spec.getSketchSpecs(ids)
      this.$data.sketchSpecs = res
      console.log(res)
    },
    /**
     * 获取所属分类数据
     */
    async getCategories() {
      this.$data.categories = await Category.getCategoryAndChildren()
    },
    /**
     * 获取所有可选规格
     */
    // eslint-disable-next-line no-empty-function
    async getSpecs() {
    },
    /**
     * 点击返回按钮触发的操作
     */
    rollbackClick() {
      this.$emit('rollback-event')
    },
    /**
     * 删除标签时触发的操作
     */
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    /**
     * 添加标签时，触发的操作
     */
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      // 如果有值，则添加
      if (inputValue) {
        // 判断当前 spu 的 tag 数量是否 >= 3, 大于则不允许添加
        if (this.dynamicTags.length >= 3) {
          this.$message.warning('tag 标签最多允许添加3个~')
        } else if (this.inputValue.length > 5) {
          this.$message.warning('tag 标签最大字数为5个~')
        } else {
          this.dynamicTags.push(inputValue)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    submitClick() {
      console.log('当前spu选定的规格：')
      console.log(this.$data.specs)
      console.log('当前spu选定的分类数据：')
      console.log(this.$data.selectedCategory)
      console.log('当前spu选定的默认sku: ')
      console.log(this.$data.selectedSku)
      console.log('当前spu选定的标签')
      console.log(this.$data.formData.tag_list)
      console.log('当前spu选定的可视化规格')
      console.log(this.$data.selectedSketchSpec)
    }
  },
  data() {
    return {
      formData: {
        id: null,
        title: null,
        subtitle: null,
        price: null,
        discount_price: null,
        category_name: null,
        default_sku: null,
        online: null,
        tag_list: null,
        spu_specs: null,
        description: null
      },
      mainImgData: [],
      themeImgData: [],
      rotationImgData: [],
      detailImgData: [],
      // 规格级联选择器的数据集,保存当前spu选定的规格id
      specs: [],
      // 分类级联选择器的数据集
      categories: [],
      // 双向绑定的分类数据
      selectedCategory: [],
      // 双向绑定的默认sku
      selectedSku: null,
      // 默认sku数据集
      defaultSkus: [],
      // 标签tags数据集
      dynamicTags: [],
      // 是否显示标签输入框的标记
      inputVisible: false,
      // 标签输入框绑定的值
      inputValue: '',
      // 可视化规格数据集
      sketchSpecs: [],
      // 已选择的可视化规格
      selectedSketchSpec: null,
      // 级联选择器的属性
      cascaderProps: {
        multiple: true,
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          // console.log('触发懒加载方法')
          try {
            const res = await Spec.getSpecSummary()
            const nodes = res.map(item => ({
              label: `${item.id}-${item.name}`,
              value: item.id,
              leaf: level >= 0,
            }))
            // console.log('nodes: ')
            // console.log(nodes)
            resolve(nodes)
          } catch (e) {
            this.$message.error('获取规格信息失败，请检查网络')
          }
        }
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
    margin-top: 20px;
  }
  .form_container {
    width: 650px;
  }
  .rollback {
    cursor: pointer;
  }
  .title {
    text-align: center;
    color: $theme;
    height: 30px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
