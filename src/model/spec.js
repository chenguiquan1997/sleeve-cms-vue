import { _delete, get, post, put } from '../lin/plugin/axios'

class Spec {
  /**
   * 获取所有规格
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpecs(page = 1, size = 3) {
    const res = await get('v1/spec/key/all', { page, size })
    return res
  }

  /**
   * 根据规格 id 分页获取规格值
   * @param id 规格 id
   * @param page 页码
   * @param size 每页数据量
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpecValueById(id, page = 1, size = 3) {
    const res = await get(`v1/spec/value/all/${id}`, { page, size })
    return res
  }

  /**
   * 根据规格id,查询指定规格
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpecDetailById(id) {
    const res = await get(`v1/spec/key/${id}`)
    return res
  }

  /**
   * 根据规格id,更新指定规格
   * @param data
   * @returns {Promise<void>}
   */
  static async updateSpecKey(data) {
    const res = await put('v1/spec/key/update', data)
    return res
  }

  /**
   * 根据规格值id,更新指定规格值
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async updateSpecValue(data) {
    const res = await put('v1/spec/value/update', data)
    return res
  }

  /**
   * 根据规格值id,查询指定规格值
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async searchSpecValueById(id) {
    const res = await get(`v1/spec/value/${id}`)
    return res
  }

  /**
   * 创建规格
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async saveKey(data) {
    const res = await post('v1/spec/key/save', data)
    return res
  }

  /**
   * 删除指定规格
   * @param id 规格id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async removeKey(id) {
    const res = await _delete(`v1/spec/key/delete/${id}`)
    return res
  }

  /**
   * 删除指定规格值
   * @param id 规格值id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async removeValue(id) {
    const res = await _delete(`v1/spec/value/delete/${id}`)
    return res
  }

  /**
   * 获取所有规格名
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpecSummary() {
    const res = await get('v1/spec/key/summary')
    return res
  }

  /**
   * 根据一组id，获取可视化规格
   * @param ids
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSketchSpecs(ids) {
    const res = await get('v1/spec/key/sketch/ids', { ids })
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Spec
}
