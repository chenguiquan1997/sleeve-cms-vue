import { _delete, get, post, put } from '../lin/plugin/axios'

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

  /**
   * 更新 SPU
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async updateSpu(data) {
    const res = await put('v1/spu/update', data)
    return res
  }

  /**
   * 创建 SPU
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async saveSpu(data) {
    const res = await post('v1/spu/save', data)
    return res
  }

  /**
   * 逻辑删除指定 spu
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async removeSpu(id) {
    const res = await _delete(`/v1/spu/remove/${id}`)
    return res
  }

  /**
   * 根据 spu id，查询所属 SPU
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  static async searchSpuSpec(id) {
    const res = await get(`/v1/spu/spec/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Spu
}
