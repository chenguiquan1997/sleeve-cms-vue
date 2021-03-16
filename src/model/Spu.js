import { get } from '../lin/plugin/axios'

class Spu {
  /**
   * 分页获取SPU数据
   * @param page
   * @param count
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpuList(page = 1, count = 5) {
    const res = await get('v1/spu/outline/all', { page, count })
    return res
  }

  /**
   * 根据id, 获取SPU详情数据
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async getSpuDetail(id) {
    const res = await get(`v1/spu/detail/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Spu
}
