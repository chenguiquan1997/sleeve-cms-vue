<template>
  <div class="container">
    <div class="top_container">
      <div class="title" v-if="this.id !== -1">SKU 详情</div>
      <div class="title" v-else>创建 SKU</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider class="divider"></el-divider>
    <el-form class="form_container" ref="form" :model="formData" label-position="left" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="formData.price" @change="handleChangePrice" :precision="2" :min="1" :max="99999.99"></el-input-number>
      </el-form-item>
      <el-form-item label="折扣价 " prop="discount_price">
        <el-input-number v-model="formData.discount_price" @change="handleChangePrice" :precision="2" :min="0.00" :max="99999.00"></el-input-number>
      </el-form-item>
      <el-form-item label="SKU编码" prop="sku_code">
        <el-input disabled v-model="formData.code" placeholder="无需填写，后台自动生成..."></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="formData.stock" @change="handleChangeStock" :min="0" :max="9999"></el-input-number>
      </el-form-item>
<!--      如果是修改数据，那么当选择spu的时候，需要给用户一个友好的提示-->
      <el-form-item label="所属SPU" prop="belong_spu">
        <el-input v-model="formData.belong_spu" disabled placeholder="无需填写，后台自动生成..."></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="online">
        <el-switch v-model="formData.online"
                   active-text="上架" inactive-text="下架"
                   active-color="#3963bc" inactive-color="#ff4949"/>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <upload-imgs ref="mainImgRef" :value="this.mainImgData" :sortable="true" :max-num="1"></upload-imgs>
      </el-form-item>
      <el-form-item v-for="(specKey, index) in this.$data.specKeys" :key="index" :label="`选择${specKey.key_name}`" :prop="specKey.key_name">
        <el-select v-model="specKey.value_name"
                   clearable filterable @focus="getSpec(specKey.key_id)">
          <el-option v-for="item in specs" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="this.id !== -1" type="primary" @click="submitClick"
                   v-permission="{permission: '更新SKU', type: 'disabled'}">更新</el-button>
        <el-button v-else type="primary" @click="saveClick"
                   v-permission="{permission: '创建SKU', type: 'disabled'}">保存</el-button>
        <!--          <el-button type="primary" @click="resetForm('form')">重置</el-button>-->
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Sku } from '../../model/sku'
  import UploadImgs from '../../component/base/upload-image/index'
  import { Spec } from '../../model/spec'
  import { Spu } from '../../model/Spu'

  export default {
  name: 'sku-detail',
  components: { UploadImgs },
  props: {
    id: {
      Default: -1,
      Type: Number
    },
    spuId: {
      Default: -1,
      Type: Number
    },
    spuName: {
      Default: null,
      Type: String
    }
  },
  created() {
    console.log(`created:skuid值：${this.id}`)
  },
  async mounted() {
    console.log(`skuid值：${this.id}`)
    // 证明是更新 sku
    if (this.id !== -1) {
      this.getDetailById(this.id)
    } else {
      // 证明是创建 sku,
      console.log('当前为创建sku逻辑')
      this.$data.formData.spu_id = this.spuId
      this.$data.formData.belong_spu = this.spuName
      const res = await Spu.searchSpuSpec(this.spuId)
      this.$data.specKeys = res
    }
  },
  methods: {
    /**
     * 点击“返回”按钮，触发的操作
     */
    rollbackClick() {
      this.$emit('rollback-event')
    },
    /**
     * 更改库存时，触发的事件
     */
    handleChangeStock() {
      console.log('更改库存时触发事件')
    },
    /**
     * 更改价格时，触发的事件
     */
    handleChangePrice() {
      console.log('更改价格时触发事件')
      // 每次更改价格时，都需要判断，折扣价是否大于真实价格
      if (this.formData.discount_price > this.formData.price) {
        this.$message({
          message: '商品的折扣价不可以高于价格',
          type: 'warning',
        })
      }
    },
    /**
     * 获取sku详情
     * @param id
     * @returns {Promise<void>}
     */
    async getDetailById(id) {
      const res = await Sku.getDetailById(id)
      console.log(res)
      this.convert(res)
    },
    /**
     * 赋值转换
     */
    convert(res) {
      this.$data.formData.id = res.id
      this.$data.formData.title = res.title
      this.$data.formData.belong_spu = res.belong_spu
      this.$data.formData.spu_id = res.spu_id
      this.$data.formData.price = res.price
      this.$data.formData.discount_price = res.discount_price
      this.$data.formData.stock = res.stock
      this.$data.formData.online = res.online
      this.$data.formData.code = res.code
      this.$data.specKeys = res.sku_specs
      this.$data.mainImgData = [{ display: res.img }]
      console.log('刚赋值的spec:')
      console.log(this.$data.specKeys)
    },
    /**
     * 获取当前sku所拥有的规格
     * @param keyId
     */
    async getSpec(keyId) {
      console.log(`获取的规格id=${keyId}`)
      const res = await Spec.getSpecValues(keyId)
      console.log(res)
      const specArr = []
      if (res.length > 1) {
        res.forEach(item => {
          const spec = {}
          spec.lable = item.id
          spec.value = `${item.id} - ${item.value}`
          specArr.push(spec)
        })
      }
      console.log(specArr)
      this.$data.specs = specArr
    },
    /**
     * 获取主图
     */
    async getMainImg() {
      const mainImgData = await this.$refs.mainImgRef.getValue()
      if (mainImgData.length < 1) {
        this.$message({
          message: '请添加SKU主图片',
          type: 'warning',
        })
        throw new Error('SKU主图未添加')
      }
      this.$data.formData.img = mainImgData[0].display
    },
    /**
     * 修改和保存时，处理当前sku选中的规格值
     */
    specHandler(specs) {
      if (specs.length > 0) {
        const newSpecObj = []
        specs.forEach(spec => {
          const newSpec = {}
          newSpec.key_id = spec.key_id
          newSpec.key_name = spec.key_name
          let arr = []
          try {
            arr = spec.value_name.split('-')
          } catch (e) {
            console.log('捕获到规格值不可拆分异常')
            console.log(spec.key_name)
            this.$message({
              message: `请选择：${spec.key_name}`,
              type: 'warning',
            })
            return
          }
          if (spec.value_name.length < 1) {
            this.$message({
              message: `请选择：${spec.key_name}`,
              type: 'warning',
            })
            return
          }
          // 这一块逻辑是更新sku时，用到的
          if (this.id !== -1) {
            console.log('进入修改规格逻辑')
            // value_id, 如果不相等，则证明用户已经将规格值改变，需要替换规格值id
            if (spec.value_id.toString() !== this.trim(arr[0])) {
              newSpec.value_id = this.trim(arr[0])
              newSpec.value_name = this.trim(arr[1])
            } else {
              console.log('规格值id相等，不进行替换：')
              newSpec.value_id = spec.value_id
              newSpec.value_name = this.trim(arr[1])
            }
          } else {
            console.log('进入创建规格逻辑')
            newSpec.value_id = this.trim(arr[0])
            newSpec.value_name = this.trim(arr[1])
          }
          newSpecObj.push(newSpec)
        })
        return newSpecObj
      }
      this.$message.error('获取SKU规格错误')
    },
    /**
     * 去除字符串两端的空格
     */
    trim(str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
    },
    /**
     * 更新 sku
     */
    async submitClick() {
      // 对 img 进行赋值
      this.getMainImg()
      this.$data.formData.belong_specs = this.specHandler(this.$data.specKeys)
      console.log('最终的formData：')
      console.log(this.$data.formData)
      const res = await Sku.updateSkuDetail(this.$data.formData)
      console.log(res)
      if (res.code === 2) {
        this.$message({
          message: '更新成功',
          type: 'success',
        })
      } else {
        this.$message.error('更新失败，请稍后重试')
      }
      this.rollbackClick()
    },
    /**
     * 校验 Title
     */
    checkTitle() {
      if (this.$data.formData.title === null || this.$data.formData.length < 1) {
        this.$message({
          message: '请添加SKU标题',
          type: 'warning',
        })
        throw new Error('SKU标题未添加')
      }
    },
    /**
     * 创建 sku
     */
    async saveClick() {
      console.log('点击保存 sku 按钮')
      this.getMainImg()
      this.$data.formData.belong_specs = this.specHandler(this.$data.specKeys)
      this.checkTitle()
      const res = await Sku.saveSku(this.$data.formData)
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
        img: '',
        title: null,
        belong_spu: null,
        spu_id: null,
        price: null,
        discount_price: null,
        stock: null,
        online: false,
        code: null,
        create_time: null,
        belong_specs: []
      },
      // 当前sku所拥有的规格
      specKeys: [],
      mainImgData: [],
      // 规格所拥有的规格值，存放的是已经整理好的待选规格列表
      specs: []
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
  .divider {
    margin-top: 10px;
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
</style>
