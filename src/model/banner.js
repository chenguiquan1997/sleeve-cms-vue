// eslint-disable-next-line no-unused-vars
import { get, put, _delete } from '../lin/plugin/axios'

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
   * 更新 banner-item
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async updateItem(data) {
    const res = await put('v1/banner/item/update', data)
    return res
  }

  /**
   * 获取banner-item 类型
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async searchtypes() {
    const res = await get('v1/banner/item/search/types')
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Banner,
}
