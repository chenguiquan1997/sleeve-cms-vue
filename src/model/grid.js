import { get } from '../lin/plugin/axios'

class Grid {
  /**
   * 获取六宫格数据
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getGrid() {
    let res = await get('v1/category/grid')
    return res
  }

  /**
   * 根据id, 获取指定六宫格数据
   * @param id 分类id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getGridById(id) {
    let res = await get(`v1/category/grid/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Grid
}
