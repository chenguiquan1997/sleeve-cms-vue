<template>
  <div class="container">
    <div class="top_container">
      <div class="title">SKU 详情</div>
      <span class="rollback" @click="rollbackClick"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <el-divider></el-divider>
    <el-form class="form_container" ref="form" :model="formData" label-position="left" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="formData.price" @change="handleChangePrice" :precision="2" :min="1" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="折扣价 " prop="discount_price">
        <el-input-number v-model="formData.discount_price" @change="handleChangePrice" :precision="2" :min="0" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="SKU编码" prop="sku_code">
        <el-input disabled v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="formData.stock" @change="handleChangeStock" :min="1" :max="9999"></el-input-number>
      </el-form-item>
      <el-form-item label="所属SPU" prop="belong_spu">
<!--        <el-input></el-input>-->
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

export default {
  name: 'sku-detail',
  components: { UploadImgs },
  props: {
    id: {
      Default: -1,
      Type: Number
    }
  },
  created() {
  },
  mounted() {
    this.getDetailById(this.id)
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
      this.$data.formData.price = res.price
      this.$data.formData.discount_price = res.discount_price
      this.$data.formData.stock = res.stock
      this.$data.formData.online = res.online
      this.$data.formData.code = res.code
      this.$data.specKeys = res.sku_specs
      this.$data.mainImgData = [{ display: res.img }]
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
    submitClick() {
    },
    saveClick() {
    }
  },
  data() {
    return {
      formData: {
        id: null,
        img: null,
        title: null,
        belong_spu: null,
        price: null,
        discount_price: null,
        stock: null,
        online: false,
        code: null,
        create_time: null
      },
      // 当前sku所拥有的规格
      specKeys: [],
      mainImgData: [],
      // 规格所拥有的规格值
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
