import { get, post, put } from '../lin/plugin/axios'

class Sku {
  /**
   * 通过spuid 查询所属的sku
   * @param id spu id
   * @returns {AxiosPromise<any>}
   */
  static async getSkusBySpuId(id) {
    const res = get(`v1/sku//list/${id}`)
    return res
  }

  /**
   * 分页获取 sku 概要数据
   * @param page 当前数据页
   * @param count 当前数据页的数据量
   * @returns {AxiosPromise<any>}
   */
  static async getSkuSummary(page = 1, count = 5) {
    const res = get('v1/sku/summary', { page, count })
    return res
  }

  /**
   * 分页查询指定Spu下的sku列表
   * @param spuId spuid
   * @param page 当前数据页
   * @param count 当前数据页的数据量
   * @returns {AxiosPromise<any>}
   */
  static async getSkuSummaryBySpu(spuId, page = 1, count = 5) {
    const res = get(`v1/sku/summary/${spuId}`, { page, count })
    return res
  }

  /**
   * 根据id，获取指定sku详情
   * @param id  skuId
   * @returns {AxiosPromise<any>}
   */
  static async getDetailById(id) {
    const res = get(`v1/sku/detail/${id}`)
    return res
  }

  /**
   * 更新 SKU
   * @param data
   * @returns {AxiosPromise<any>}
   */
  static async updateSkuDetail(data) {
    const res = put('v1/sku/update', data)
    return res
  }

  /**
   * 创建 SKU
   * @param data
   * @returns {AxiosPromise<any>}
   */
  static async saveSku(data) {
    const res = post('v1/sku/save', data)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Sku
}
