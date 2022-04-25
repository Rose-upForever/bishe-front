//引用后端实现的接口
import request from '@/utils/request'

export default{
 getAllStudentInfo(page,size) {
  return request({
    // 接口的地址
    url: `/exam/studentManage/students/${page}/${size}`,
    method: 'get'
        })
    }
}