//引用后端实现的接口
import request from '@/utils/request'

export default{
  addVideo(video) {
    return request({
      // 接口的地址
      url: `/teacher/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  // 删除章节
  deleteChapter(id) {
    return request({
      // 接口的地址
      url: `/teacher/chapter/` + id,
      method: 'delete',
    })
  },
  // 根据id查询Video
  getVideoById(id) {
    return request({
      // 接口的地址
      url: `/teacher/video/getVideo/` + id,
      method: 'get',
    })
  },
  updateVideo(video){
    return request({
      // 接口的地址
      url: `/teacher/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
  removeById(id){
    return request({
      // 接口的地址
      url: `/teacher/video/` + id,
      method: 'delete',
    })
  },
  deleteVideo(id){
    return request({
      // 接口的地址
      url: `/vod/deleteVideo/` + id,
      method: 'delete',
    })
  }

}
