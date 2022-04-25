<template>
    <div>
       <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调
        <input type="file" name="file"/>
      -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/oss/avaoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
      </el-form>
    </div>
</template>
<script>
import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default{
  //声明组件  声明之后才能使用
  components: { ImageCropper, PanThumb },
    data() {
        return {
          teacher:{
            name: '',
            sort: 0,
            level: 1,
            career: '',
            intro: '',
            avatar: ''
          },
           //上传弹框组件是否显示
          imagecropperShow:false,
          imagecropperKey:0,//上传组件key值
          BASE_API:process.env.BASE_API, //获取dev.env.js里面地址
          saveBtnDisabled:false,  // 保存按钮是否禁用,
          }
    },
    // 再多次跳转到同一页面的时候，created方法只会执行一次。
    created() {
     this.init()
    },
    watch: {  //监听
    $route(to, from) { //路由变化方式，路由发生变化，方法就会执行,解决跳转到同一页面的时候页面信息无法清除的问题。
      this.init()
    }
  },
    methods: {
       close() { //关闭上传弹框的方法
        this.imagecropperShow=false
        //上传组件初始化
        this.imagecropperKey = this.imagecropperKey+1
    },
     //上传成功方法
    cropSuccess(data) {
      this.imagecropperShow=false
      //上传之后接口返回图片地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey+1
    },
      init() {
        // 判断是否需要提前将讲师数据渲染到页面之中
        if(this.$route.params && this.$route.params.id){
            const id = this.$route.params.id
            this.getInfo(id)
        }else{
          //解决先点击修改再点添加原来的数据会存在于表单中的问题。
          this.teacher = {}
        }
      },

        saveOrUpdate(){
          // 判断是修改还是添加
          // 根据teacher中是否有id。如果有id，则是修改，否则是添加
          if(! this.teacher.id){
            this.saveTeacher()
          }else{
            this.updateTeacher()
          }
        },
        saveTeacher(){
            teacher.addTeacher(this.teacher)
            .then(response => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                //  实现路由跳转回到教师列表页面当中去
                this.$router.push('/teacher/table')
            })
        },
        //调用讲师查询接口
        getInfo(id){
          teacher.getTeacherInfo(id)
          .then(response => {
            //将从后端查询到的teacher数据赋值给data中的对象。
            this.teacher = response.data.teacher
          })
        },
        updateTeacher(){
          teacher.updateTeacherInfo(this.teacher)
          .then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.$router.push('/teacher/table')
          })
        }
    }
 }

</script>
