import { get } from '../lin/plugin/axios'

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
   * 根据id，获取指定sku详情
   * @param id  skuId
   * @returns {AxiosPromise<any>}
   */
  static async getDetailById(id) {
    const res = get(`v1/sku/detail/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Sku
}
