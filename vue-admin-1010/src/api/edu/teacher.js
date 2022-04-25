//引用后端实现的接口
import request from '@/utils/request'

export default{
 getPageList(current,limit,teacherQuery) {
  return request({
    url: `/teacher/pageTeacherCondition/${current}/${limit}`,
    method: 'post',
    //data就i表示将对象转化成json传递到后端接口中去
    data: teacherQuery
        })
    },
    deleteTeacher(id) {
        return request({
          url: `/teacher/${id}`,
          method: 'delete'
              })
            },
    // 添加讲师
    addTeacher(teacher) {
        return request({
          url: `/teacher/addTeacher`,
          method: 'post',
          data: teacher
              })
            },
    // 根据id查询讲师
    getTeacherInfo(id) {
      return request({
        url: `/teacher/findTeacherById/${id}`,
        method: 'get'
        })
    },
    updateTeacherInfo(teacher) {
      return request({
        url: `/teacher/updateTeacher`,
        method: 'post',
        data: teacher
        })
      }
}
