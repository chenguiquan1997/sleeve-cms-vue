// eslint-disable-next-line no-unused-vars
import { get, put, _delete, post } from '../lin/plugin/axios'

class Banner {
  /**
   * 分页获取 banner 列表
   * @param page 页码
   * @param count 每页查询数据量
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getBanners(page = 0, count = 10) {
    const bannerList = await get('v1/banner/all', {
      page,
      count,
    })
    return bannerList
  }

  /**
   * 根据id,查询具体的banner详情，以及关联的bannerItems
   * @param id
   * @returns {AxiosPromise<any>}
   */
  static async getBannerDetailById(id) {
    const bannerAndItems = get(`v1/banner/searchBannerAndItems/${id}`)
    return bannerAndItems
  }

  /**
   * 更新 banner
   * @param id
   * @param data 提交的form表单数据
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async update(id, data) {
    const res = await put(`v1/banner/updateBannerBy/${id}`, data)
    return res
  }

  /**
   * 逻辑删除 banner
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async delete(id) {
    const res = await _delete(`v1/banner/remove/${id}`)
    return res
  }

  /**
   * 更新 banner-item
   * @param data
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async updateItem(data, id) {
    const res = await put(`v1/banner/item/update/${id}`, data)
    return res
  }

  /**
   * 创建 banner-item
   * @param data 请求体参数
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async createItem(data) {
    const res = await post('v1/banner/item/add', data)
    return res
  }

  /**
   * 获取 banner-item 类型
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async searchtypes() {
    const res = await get('v1/banner/item/search/types')
    return res
  }

  /**
   * 根据 id 获取 指定banner-item
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async searchItem(id) {
    const res = await get(`v1/banner/item/search/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Banner,
}
