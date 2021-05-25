import { get, put } from '../lin/plugin/axios'

class Order {
  /**
   * 分页查询订单概要数据(无查询条件)
   * @param page 页码
   * @param count 每页数据量
   * @returns {AxiosPromise<any>}
   */
  static async getOrders(page = 1, count = 5) {
    const res = get('v1/order/summary', { page, count })
    return res
  }

  /**
   * 分页查询订单概要数据(根据订单号查询)
   * @param page 页码
   * @param count 每页数据量
   * @param orderNo 订单号
   * @returns {AxiosPromise<any>}
   */
  static async getOrdersByOrderNo(page = 1, count = 5, orderNo) {
    const res = get('v1/order/summary/orderno', { page, count, orderNo })
    return res
  }

  /**
   * 分页查询订单概要数据(根据收货人查询)
   * @param page 页码
   * @param count 每页数据量
   * @param receiver 收货人
   * @returns {AxiosPromise<any>}
   */
  static async getOrdersByReceiver(page = 1, count = 5, receiver) {
    const res = get('v1/order/summary/receiver', { page, count, receiver })
    return res
  }

  /**
   * 分页查询订单概要数据(根据联系方式询)
   * @param page 页码
   * @param count 每页数据量
   * @param phone 联系电话
   * @returns {AxiosPromise<any>}
   */
  static async getOrdersByPhone(page = 1, count = 5, phone) {
    const res = get('v1/order/summary/phone', { page, count, phone })
    return res
  }

  /**
   * 分页查询订单概要数据(根据订单状态查询)
   * @param page 页码
   * @param count 每页数据量
   * @param status 订单状态
   * @returns {AxiosPromise<any>}
   */
  static async getOrdersByStatus(page = 1, count = 5, status) {
    const res = get('v1/order/summary/status', { page, count, status })
    return res
  }

  /**
   * 分页查询订单概要数据(根据时间区间查询)
   * @param page 页码
   * @param count 每页数据量
   * @param startTime 起始时间
   * @param endTime 结束时间
   * @returns {AxiosPromise<any>}
   */
  static async getOrdersByTime(page = 1, count = 5, startTime, endTime) {
    const res = get('v1/order/summary/time', { page, count, startTime, endTime })
    return res
  }

  /**
   * 根据订单id，获取指定订单详情
   * @param id
   * @returns {AxiosPromise<any>}
   */
  static async getOrderDetail(id) {
    const res = get(`v1/order/detail/${id}`)
    return res
  }

  /**
   * 更新订单数据
   * @param data
   * @returns {AxiosPromise<any>}
   */
  static async updateOrder(data) {
    const res = put('v1/order/update', data)
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  Order
}
