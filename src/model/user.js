import { get } from '../lin/plugin/axios'

class User {
  static async getUsers(page = 1, count = 5) {
    const res = get('v1/min/user/all', {
      page,
      count
    })
    return res
  }
}
export {
  // eslint-disable-next-line import/prefer-default-export
  User
}
