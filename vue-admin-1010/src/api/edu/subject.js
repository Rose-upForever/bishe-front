//引用后端实现的接口
import request from '@/utils/request'

export default{
 getSubjectList() {
  return request({
    // 接口的地址
    url: `/teacher/subject/getAllSubject`,
    method: 'get'
        })
    }
}
