<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="primary" @click=openchapterDialog()>添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频" >
              <el-upload
                :on-success="handleVodUploadSuccess"
                :on-remove="handleVodRemove"
                :before-remove="beforeVodRemove"
                :on-exceed="handleUploadExceed"
                :show-file-list="true"
                :file-list="fileList"
                :action=" BASE_API+'/vod/uploadVideo'"
                :limit="1"
                class="upload-demo">
                <el-button size="small" type="primary">上传视频</el-button>
                <el-tooltip placement="right-end">
                  <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                  <i class="el-icon-question"/>
                </el-tooltip>
              </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chapterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}

                <span class="acts">

                    <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                    <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <el-form label-width="120px">

      <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import course from '@/api/edu/course'
import video from '@/api/edu/video'
export default{
    data() {
      return{
        saveBtnDisabled:false,
        courseId:'',
        chapterVideoList:[],
        chapter:{
          title:'',
          sort:0,
          courseId:''
        },
        video:{
          title: '',
          sort: 0,
          free: 0,
          videoSourceId: '',
          videoOriginalName:''
        },
        dialogVideoFormVisible:false,
        dialogChapterFormVisible:false,
        fileList: [],//上传文件列表
        BASE_API: process.env.BASE_API // 接口API地址
      }
    },
    created() {
      //获取路由中的课程id的值
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterList()
      }
    },
    methods: {

      // 删除确认弹窗
      beforeVodRemove(file,fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`)
      },
      handleVodRemove() {
        video.deleteVideo(this.video.videoSourceId)
        .then(res =>{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
            this.fileList = [],
            this.video.videoSourceId = '',
            this.video.videoOriginalName = ''
        })

      },
      //上传视频成功调用的方法
      handleVodUploadSuccess(response, file, fileList) {
        //上传视频id赋值
        this.video.videoSourceId = response.data.videoId
        //上传视频名称赋值
        this.video.videoOriginalName = file.name
        this.fileList = fileList
      },
      handleUploadExceed() {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
      // =================================================================
      openVideo(chapterId){
        this.dialogVideoFormVisible = true
        // 根据弹窗中返回的章节id设置当前小节的章节id
        this.video.chapterId = chapterId
        this.video.title = ''
        this.video.sort = 0
        this.video.free = 0
        this.video.videoSourceId = ''
        this.fileList = []
    },
      // 添加小节
      addVideo(){
        this.video.courseId = this.courseId
        video.addVideo(this.video)
        .then(res => {
            this.dialogVideoFormVisible = false
            this.$message({
              type:'success',
              message:'添加小节 成功'
            })
            this.getChapterList()
        })
      },

      // 删除video
      removeVideo(videoId){
        this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {  //点击确定，执行then方法
          //调用删除的方法
          video.removeById(videoId)
            .then(response =>{//删除成功
              //提示信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //回到列表页面
              this.getChapterList()
            })
        }) //点击取消，执行catch方法
      },

      saveOrUpdateVideo(){
        if(!this.video.id) {this.addVideo()}
        else {this.updateVideo()}
      },

      updateVideo(){
        video.updateVideo(this.video)
          .then(res => {
            // 关闭弹窗
            this.dialogVideoFormVisible = false
            // 提示信息
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // 刷新页面
            this.getChapterList()
          })
      },

      openEditVideo(videoId){
        this.dialogVideoFormVisible = true
        video.getVideoById(videoId)
        .then(res => {
          this.video = res.data.video
        })
      },
      // 点击编辑回显章节数据并打开弹窗
      openEditChatper(chapterId){
        this.dialogChapterFormVisible = true
        //调用接口
        chapter.getChapterById(chapterId)
          .then(res => {
            this.chapter = res.data.chapter
          })
      },
      removeChapter(chapterId){
        //elment-ui的confirm组件
        this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {  //点击确定，执行then方法
          //调用删除的方法
          chapter.deleteChapter(chapterId)
            .then(response =>{//删除成功
              //提示信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //回到列表页面
              this.getChapterList()
            })
        }) //点击取消，执行catch方法
      },

      // 添加章节
      addChapter(){
        this.chapter.courseId = this.courseId,
          chapter.addChapter(this.chapter)
            .then(res => {
              // 关闭弹窗
              this.dialogChapterFormVisible = false
              // 提示信息
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              // 刷新页面
              this.getChapterList()
            })
      },
      updateChapter() {
         chapter.updateChapter(this.chapter)
           .then(res => {

             this.dialogChapterFormVisible = false
             // 提示信息
             this.$message({
               message: '修改成功',
               type: 'success'
             })
             // 刷新页面
             this.getChapterList()
           })
      },
      saveOrUpdate(){
        if(!this.chapter.id) {
          this.addChapter(  )
        }
        else {
          this.updateChapter()
        }
      },

      // 根据课程信息查询章节和小节列表
      getChapterList() {
        chapter.getAllChapterVideo(this.courseId)
        .then(res =>{
          this.chapterVideoList = res.data.allChapter
        })
      },
      openchapterDialog() {
        // 打开弹窗
        this.dialogChapterFormVisible = true
        // 清空表单
        this.chapter.title = ''
        this.chapter.sort = 0
      },
        // 修改课程之间的跳转路径，带上courseId
        previous() {
            this.$router.push({path:'/course/info/' + this.courseId})
        },
        next(){
            this.$router.push({path:'/course/publish/' + this.courseId})
        }
    }
}

</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
