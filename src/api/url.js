import axios from 'axios'
// 后台启动的服务地址
const baseUrl = 'http://localhost:3000'

export default {
  /** 登录 */
  postLogin(params) {
    return axios.post(baseUrl + '/login', params);
  },
  /** 操作树 */
  getTree(params) {
    return axios.get(baseUrl + '/tree', {params});
  },
  addTreeNode(params) {
    return axios.get(baseUrl + '/addtreenode', params);
  },
  modifyTreeNode(params) {
    return axios.get(baseUrl + '/modifytreenode', params);
  },
  deleteTreeNode(params) {
    return axios.get(baseUrl + '/deletetreenode', {params});
  },
  /** 操作子节点内容 */
  getNodeCont(params) {
    return axios.get(baseUrl + '/cont', {params});
  },
  addNodeCont(params) {
    return axios.post(baseUrl + '/addnodecont', params);
  },
  modifyNodeCont(params) {
    return axios.post(baseUrl + '/modifynodecont', params);
  },
  deleteNodeCont(params) {
    return axios.get(baseUrl + '/deletenodecont', {params});
  },
}