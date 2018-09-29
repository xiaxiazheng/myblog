// 后台启动的服务地址
import { baseUrl } from '@/config.js'

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
    return axios.get(baseUrl + '/addtreenode', {params});
  },
  modifyTreeNode(params) {
    return axios.get(baseUrl + '/modifytreenode', {params});
  },
  deleteTreeNode(params) {
    return axios.get(baseUrl + '/deletetreenode', {params});
  },
  changeSort(params) {
    return axios.get(baseUrl + '/changesort', {params});
  },
  changeFather(params) {
    return axios.get(baseUrl + '/changefather', {params});
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
  changeContSort(params) {
    return axios.get(baseUrl + '/changecontsort', {params});
  },
  /** 获取某个类型的图片名称列表 */
  getImgList(params) {
    return axios.get(baseUrl + '/getimglist', {params});
  },
  deleteImg(params) {
    return axios.get(baseUrl + '/deleteimg', {params});
  },
  deleteTreeContImg(params) {
    return axios.get(baseUrl + '/deletetreecontimg', {params});
  },
}