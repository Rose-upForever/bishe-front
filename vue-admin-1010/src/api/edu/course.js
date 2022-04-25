import request from '@/utils/request'
import {methods} from "babel-plugin-transform-runtime/lib/definitions";

export default{
 addCourse(courseInfo) {
  return request({
    // 接口的地址
    url: '/teacher/course/addCourseInfo',
    method: 'post',
    data:courseInfo
        })
    },
    //查询所有的讲师
    getAllTeacher(){
        return request({
            url: '/teacher/findAll',
            method: 'get'
        })
    },

    // 根据课程id查询课程基本信息
    getCourseInfo(courseId){
        return request({
            url:`/teacher/course/getCourseInfo/${courseId}`,
            method:'get'
        })
    },

    // 修改课程的基本方法
    updateCourseInfo(courseInfo){
        return request({
            url:'/teacher/course/updateCourseInfo',
            method:'post',
            data:courseInfo
        })
    },
   getPublishCourse(id){
       return request({
           url:`/teacher/course/getPublishCourseInfo/`+  id,
           method:'get'
       })
   },
  publishCourse(courseId){
      return request({
          url:`/teacher/course/publishCourse/${courseId}`,
          method:'post'
      })
  },
  getCourseList(){
   return request({
          url:`/teacher/course/findAll`,
          method:'get'
      })
  },
  getPageList(current, limit, courseQuery){
    return request({
        url:`/teacher/course/pageCourseCondition/${current}/${limit}`,
        method:'post',
        data:courseQuery
    })
  },
  deleteAll(id){
   return request({
     url:`/teacher/course/delete/${id}`,
     method:'delete'
    })
  }

}
