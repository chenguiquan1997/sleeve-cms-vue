<template>
  <div class="container">
    <div class="top_container">
      <div class="title">SPU 详情</div>
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
        <el-select  size="medium"  clearable v-model="selectedSketchSpec" placeholder="请选择" @focus="sketchSpecFocus">
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
        <el-button v-if="this.id !== -1" type="primary" @click="submitClick"
                   v-permission="{permission: '创建SPU', type: 'disabled'}">更新</el-button>
        <el-button v-else type="primary" @click="saveClick"
                   v-permission="{permission: '创建SPU', type: 'disabled'}">保存</el-button>
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
    } else {
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
      console.log('从后端获取的spu数据：')
      console.log(res)
      console.log('赋值之前的formData: ')
      console.log(this.$data.formData)
      // this.$data.formData = res
      this.convert(res)
      console.log('赋值res后的formData: ')
      console.log(this.$data.formData)
      // 获取标签数据
      this.$data.dynamicTags = res.tag_list
      this.mainImgData = [{ display: res.img }]
      this.themeImgData = [{ display: res.spu_theme_img }]
      this.rotationImgData = res.rotation_imgs ? res.rotation_imgs.map((it, index) => ({ id: index, display: it })) : []
      this.detailImgData = res.spu_detail_imgs ? res.spu_detail_imgs.map((it, index) => ({ id: index, display: it })) : []
      this.initSpecs(res.spu_specs)
      this.initCategory(res.root_category_id, res.category_id)
      this.initDefaultSku(res.default_sku_id, res.default_sku)
      this.initDefaultSketchSpec(res.sketch_spec_id, res.default_sketch_spec)
      console.log('初始化的规格值：')
      console.log(this.$data.specs)
    },
    /**
     * 将从后端查询出来的数据，转换成formData
     */
    convert(res) {
      this.$data.formData.id = res.id
      this.$data.formData.title = res.title
      this.$data.formData.subtitle = res.subtitle
      this.$data.formData.price = res.price
      this.$data.formData.discount_price = res.discount_price
      this.$data.formData.parent_category_id = res.category_id
      this.$data.formData.root_category_id = res.root_category_id
      this.$data.formData.category_name = res.category_name
      this.$data.formData.default_sku = res.default_sku
      this.$data.formData.default_sku_id = res.default_sku_id
      this.$data.formData.sketch_spec = res.default_sketch_spec
      this.$data.formData.sketch_spec_id = res.sketch_spec_id
      this.$data.formData.online = res.online
      this.$data.formData.tag_list = res.tag_list
      this.$data.formData.spu_specs = res.spu_specs
      this.$data.formData.description = res.description
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
      this.defaultSkuId = id
      // 默认sku
      this.$data.selectedSku = name
      console.log('初始化默认sku')
      console.log(this.$data.skukey)
      console.log(this.$data.skuValue)
    },
    /**
     * 初始化可视化规格
     */
    initDefaultSketchSpec(id, name) {
      this.$data.defaultSketchSpecId = id
      this.$data.selectedSketchSpec = name
    },
    /**
     * 默认sku选择器,获得焦点时，触发的事件
     */
    async skuFocus() {
      if (this.id === -1) {
        this.$message({
          message: '请先创建完成SPU及SKU后，再选择默认SKU',
          type: 'warning',
        })
        return
      }
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
      if (s.length < 1) {
        this.$message({
          message: '请先选择商品规格',
          type: 'warning',
        })
        return
      }
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
      const { inputValue } = this
      console.log('标签的inputValue: ')
      console.log(inputValue)
      // 如果有值，则添加
      if (inputValue) {
        // 判断当前 spu 的 tag 数量是否 >= 3, 大于则不允许添加
        if (this.dynamicTags.length >= 3) {
          console.log('标签数量大于3')
          this.$message.warning('tag 标签最多允许添加3个~')
        } else if (this.inputValue.length > 5) {
          console.log('标签字数大于5')
          this.$message.warning('tag 标签最大字数为5个~')
        } else {
          this.dynamicTags.push(inputValue)
          this.$data.formData.tag_list = this.dynamicTags
          console.log('标签数据集：')
          console.log(this.dynamicTags)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /**
     * 提交时，获取默认sku数据
     */
    getDefaultSku() {
      const type = typeof this.$data.selectedSku
      let skuId = -1
      if (type === 'string') {
        // 需要从data中获取sku id
        skuId = this.$data.defaultSkuId
      }
      if (type === 'number') {
        // 直接拿到value 值就可以了
        skuId = this.$data.selectedSku
      }
      if (skuId === -1) {
        this.$data.formData.default_sku_id = null
      } else {
        this.$data.formData.default_sku_id = skuId
      }
    },
    /**
     * 获取当前 SPU 所属的分类信息
     */
    getBelongCategory() {
      // eslint-disable-next-line prefer-destructuring
      this.$data.formData.root_category_id = this.$data.selectedCategory[0]
      // eslint-disable-next-line prefer-destructuring
      this.$data.formData.parent_category_id = this.$data.selectedCategory[1]
    },
    /**
     * 获取当前 SPU 选定的规格
     */
    getSelectedSpecs() {
      const specArr = []
      this.$data.specs.forEach(spec => {
        specArr.push(spec[0])
      })
      if (specArr.length < 1) {
        this.$message({
          message: '请选择SPU规格',
          type: 'warning',
        })
        throw new Error('规格未选择')
      }
      this.$data.formData.spu_specs = specArr
    },
    /**
     * 获取可视化规格
     */
    getSketchSpec() {
      const type = typeof this.$data.selectedSketchSpec
      let specId = -1
      if (type === 'string') {
        // 需要从data中获取sku id
        specId = this.$data.defaultSketchSpecId
      }
      if (type === 'number') {
        // 直接拿到value 值就可以了
        specId = this.$data.selectedSketchSpec
      }
      this.$data.formData.sketch_spec_id = specId
    },
    /**
     * 获取主图
     */
    async getMainImg() {
      const mainImgData = await this.$refs.mainImgRef.getValue()
      if (mainImgData.length < 1) {
        this.$message({
          message: '请添加SPU主图片',
          type: 'warning',
        })
        throw new Error('SPU主图未添加')
      }
      this.$data.formData.main_img_data = mainImgData[0].display
    },
    /**
     * 获取主题图
     * @returns {Promise<void>}
     */
    async getThemeImg() {
      const themeImgData = await this.$refs.themeImgRef.getValue()
      if (themeImgData.length < 1) {
        this.$message({
          message: '请添加主题图片',
          type: 'warning',
        })
        throw new Error('主题图片未添加')
      }
      this.$data.formData.theme_img_data = themeImgData[0].display
    },
    /**
     * 获取轮播图
     * @returns {Promise<void>}
     */
    async getRotationImg() {
      const rotationImgData = await this.$refs.rotationImgRef.getValue()
      const rotationImgArr = []
      rotationImgData.forEach(img => {
        rotationImgArr.push(img.display)
      })
      if (rotationImgArr.length < 1) {
        this.$message({
          message: '请添加轮播图',
          type: 'warning',
        })
        throw new Error('轮播图未添加')
      }
      this.$data.formData.rotation_img_data = rotationImgArr
    },
    /**
     * 获取详情图
     * @returns {Promise<void>}
     */
    async getDetailImg() {
      const detailImgData = await this.$refs.detailImgRef.getValue()
      const detailImgArr = []
      detailImgData.forEach(img => {
        detailImgArr.push(img.display)
      })
      if (detailImgArr.length < 1) {
        this.$message({
          message: '请添加详情图',
          type: 'warning',
        })
        throw new Error('详情图未添加')
      }
      this.$data.formData.detail_img_data = detailImgArr
    },
    /**
     * 更新 SPU 数据
     */
    async submitClick() {
      try {
        this.getSelectedSpecs()
        this.getBelongCategory()
        this.getDefaultSku()
        this.getSketchSpec()
        await this.getMainImg()
        await this.getThemeImg()
        await this.getRotationImg()
        await this.getDetailImg()
      } catch (error) {
        console.log('捕获到异常')
        return
      }
      const data = this.$data.formData
      const res = await Spu.updateSpu(data)
      if (res.code === 2) {
        this.$message({
          message: '更新成功',
          type: 'success',
        })
      } else {
        this.$message.error('更新失败，请稍后重试')
      }
      // 更新完成后，模拟手动触发“返回”按钮
      this.rollbackClick()
    },
    /**
     * 保存 SPU 数据
     */
    async saveClick() {
      console.log('进入保存方法')
      try {
        this.getSelectedSpecs()
        this.getBelongCategory()
        this.getDefaultSku()
        this.getSketchSpec()
        await this.getMainImg()
        await this.getThemeImg()
        await this.getRotationImg()
        await this.getDetailImg()
      } catch (error) {
        console.log('捕获到异常')
        return
      }
      console.log(this.$data.formData)
      // 发送请求
      const res = await Spu.saveSpu(this.$data.formData)
      if (res.code === 1) {
        this.$message({
          message: '创建成功',
          type: 'success',
        })
      } else {
        this.$message.error('创建失败，请稍后重试')
      }
      this.rollbackClick()
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
        parent_category_id: -1,
        root_category_id: -1,
        category_name: null,
        default_sku: null,
        default_sku_id: -1,
        sketch_spec: null,
        sketch_spec_id: -1,
        online: false,
        main_img_data: null,
        theme_img_data: null,
        rotation_img_data: null,
        detail_img_data: null,
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
      // 记录默认skuId
      defaultSkuId: -1,
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
      // 记录默认可视化规格id
      defaultSketchSpecId: -1,
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
