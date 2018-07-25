import axios from 'axios'
// 后台启动的服务地址
const baseUrl = 'http://localhost:3000'

export default {
  /** 登录 */
  postLogin(params) {
    return axios.post(baseUrl + '/login', params);
  },
}