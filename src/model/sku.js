import { get } from '../lin/plugin/axios'

class Sku {
  static async getSkusBySpuId(id) {
    const res = get(`v1/sku//list/${id}`)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Sku
}
