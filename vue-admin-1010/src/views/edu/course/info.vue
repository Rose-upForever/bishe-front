<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">
            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="一级分类" @change="subjectLevelOneChanged">

                <el-option
                    v-for="subject in subjectOneList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>

            </el-select>

            <!-- 二级分类 -->
            <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>
        </el-form-item>


        <!-- 课程讲师 TODO -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">

            <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>

        </el-select>
        </el-form-item>

        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.description" />
        </el-form-item>

        <!-- 课程封面 TODO -->
        <!-- 课程封面-->
        <el-form-item label="课程封面">

            <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/oss/avaoss'"
                class="avatar-uploader">
                <img :src="courseInfo.cover" width="150" height="150" >
            </el-upload>

        </el-form-item>

        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
        </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default{
    components: { Tinymce },
    data(){
        return{
            saveBtnDisabled:false,
            courseInfo:{
                title:'',
                subjectParentId:'',//一级分类id
                subjectId:'',//二级分类id
                teacherId:'',
                lessonNum:'',
                description:'',
                cover:'/static/02.jpg',
                price:0
            },
            courseId:'',
            BASE_API:process.env.BASE_API,
            teacherList:[],//封装所有讲师
            subjectOneList:[],
            subjectTwoList:[]
            }
    },
    created(){
        // 获取路径中的id值
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getInfo()
        }else{
          //初始化所有讲师
          this.getTeacherList()
          this.getOneSubject()
        }


    },
    watch:{
      $route(to,from){
      this.init()
      }
    },

    methods: {
        init(){
          if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getInfo()
          }
          else
            this.courseInfo =[]
        },
      // 根据课程id查询课程信息
        getInfo(){
          course.getCourseInfo(this.courseId)
          .then(res => {
            this.courseInfo = res.data.courseInfoVo
            subject.getSubjectList()
            .then(res =>{
              this.subjectOneList  = res.data.list
              //  将一级分类的数组进行遍历，比较与当前的courseInfo中的id相同的课程，然后进行回回显
              for(var i = 0;i<this.subjectOneList.length;i++){
                var oneSubject = this.subjectOneList[i]
                if(this.courseInfo.subjectParentId == oneSubject.id){
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
            this.getTeacherList()
          })
        },
        // 上传封面之前调用的方法
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },

        //上传封面成功调用的方法

        handleAvatarSuccess(res, file){
            this.courseInfo.cover = res.data.url
        },

        subjectLevelOneChanged(value){
            //value就是一级分类的id值,自动获取的，不需要自己去做
            for(var i=0;i< this.subjectOneList.length;i++) {
                //每个一级分类
                var oneSubject = this.subjectOneList[i]
                //判断：所有一级分类id 和 点击一级分类id是否一样
                if(value === oneSubject.id) {
                    //从一级分类获取里面所有的二级分类
                    this.subjectTwoList = oneSubject.children
                    //清空二级分类中的标题
                    this.courseInfo.subjectId = ''
                }
            }

        },
        getOneSubject(){
            subject.getSubjectList()
            .then(res =>{
                this.subjectOneList = res.data.list
            })
        },
        addCourse(){
          course.addCourse(this.courseInfo)
            .then(res=>{
              this.$message({
                type:'success',
                message:'添加课程成功'
              })
              this.$router.push({path:'/course/chapter/'+res.data.courseId})
            })
        },
        update(){
          course.updateCourseInfo(this.courseInfo)
          .then(res =>{
            this.$message({
              type: 'success',
              message: '更新课程成功'
              })
            this.$router.push({path:'/course/chapter/'+this.courseId})
          })
        },

        saveOrUpdate(){
          if(!this.courseInfo.id) {this.addCourse()}
          else {this.update()}
        },
        getTeacherList(){
            course.getAllTeacher()
            .then(res=>{
                this.teacherList = res.data.items
                })
        }
    }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
