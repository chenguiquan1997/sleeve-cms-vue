import { get } from '../lin/plugin/axios'

class Category {
  /**
   * 查询一级分类数据
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getOneLevelCategory() {
    const res = await get('v1/category/all/oneLevel')
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Category,
}
