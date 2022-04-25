//引用后端实现的接口
import request from '@/utils/request'

export default{
 getAllChapterVideo(courseId) {
   return request({
     // 接口的地址
     url: `/teacher/chapter/getChapterVideo/` + courseId,
     method: 'get'
   })
 },
  addChapter(chapter) {
    return request({
      // 接口的地址
      url: `/teacher/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 查询章节
  getChapterById(chapterId) {
    return request({
      // 接口的地址
      url: `/teacher/chapter/getChapter/` + chapterId,
      method: 'get',
    })
  },
  // 修改章节
  updateChapter(chapter) {
    return request({
      // 接口的地址
      url: `/teacher/chapter/updateChapter` ,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId) {
    return request({
      // 接口的地址
      url: `/teacher/chapter/` + chapterId,
      method: 'delete',
    })
  }
}
