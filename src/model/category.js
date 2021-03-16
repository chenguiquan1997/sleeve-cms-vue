// eslint-disable-next-line no-unused-vars
import da from 'element-ui/src/locale/lang/da'
import { get, post, put, _delete } from '../lin/plugin/axios'

class Category {
  /**
   * 查询一级分类数据
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getOneLevelCategory(page = 1, count = 3) {
    const res = await get('v1/category/all/oneLevel', {
      page,
      count
    })
    return res
  }

  /**
   * 根据 id 查询分类明细
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getCategoryDetail(id) {
    const res = await get(`v1/category/detail/${id}`)
    return res
  }

  /**
   * 根据父级分类id，分页查询所属的二级分类数据
   * @param page 当前页码
   * @param size 每页数据量
   * @param parentId 父级分类id
   * @returns {Promise<void>}
   */
  static async getTwoLevelCategory(page = 1, size = 2, parentId) {
    const res = await get(`v1/category/all/twoLevel/${parentId}`, {
      page, size
    })
    return res
  }

  /**
   * 更新分类详情
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async updateCategoryDetail(data) {
    const res = await put('v1/category/update', data)
    return res
  }

  /**
   * 新增分类
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async save(data) {
    const res = await post('v1/category/save', data)
    return res
  }

  /**
   * 根据 id 获取分类名称
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getName(id) {
    const res = await get(`v1/category/name/${id}`)
    return res
  }

  /**
   * 根据 id 修改指定六宫格数据
   * @param data
   * @returns {Promise<void>}
   */
  static async updateGridById(data) {
    const res = await put('v1/category/grid/update', data)
    return res
  }

  /**
   * 根据 id 删除指定六宫格数据
   * @param id
   * @returns {Promise<void>}
   */
  static async removeGridById(id) {
    const res = await put(`v1/category/grid/remove/${id}`)
    return res
  }

  /**
   * 查询分类以及所属子分类
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getCategoryAndChildren() {
    const res = await get('v1/category/children')
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Category,
}
