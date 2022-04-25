<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <!-- v-model是双向绑定，techerQuery是从后端获取的json数据，将其绑定在表单项之中 -->
        <!--   在此处使用双向绑定，在表单中输入查询信息的时候，同时可以将输入的查询信息绑定到techerQuery中，最后techerQuery作为一个变量
          输入到gettList()中，在后端进行查询 -->
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="sta1" label="已发布"/>
          <el-option :value="sta2" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- prop对应数据库中的属性名 -->
      <el-table-column prop="title" label="名称" width="160" />

      <el-table-column label="状态" width="80">
        <!-- scope=是范围的意思，通过下面的这个语句可以获得整个表格的数据，然后通过scope.row.level来获得每一行的数据 -->
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width = "100"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="viemCount" label="浏览数量" width="60" />

      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <!-- 路由 to 指定了要要跳转的路由，Scope。row，id 将老师的id显示在路由之中，由于后面我们需要在save的页面之中提前渲染需要修改的讲师的数据
          我们就通过路径中是否有id 的值来判断是要修改还是添加教室数据。如果是要添加教室数据，则不能提前渲染。-->
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程的基本信息</el-button>
          </router-link>
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <!-- scope.row.id就是获取每一行的id值，并将其传入到删除讲师的方法之中，删除讲师方法通过id值对讲师进行删除 -->
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
//引入接口配置文件
import course from '@/api/edu/course'
export default {

  //写核心代码的位置
  //data定义将要使用的变量和初始值数据变量和初始值
  data() {
    return {
      list:null,
      page:1,//当前页
      limit:10,//每页显示的记录数
      courseQuery:{},
      total:0,//总记录数
      sta1:'Normal',
      sta2:'Draft'
    }
  },
  //在页面渲染之前执行，一边表用method中的方法
  created() {
    this.getList()
  },
  // 创建具体执行的方法。调用teacher.js中定义的方法
  methods: {
    getList(page = 1){
      this.page = page
      course.getPageList(this.page,this.limit,this.courseQuery)
        .then(response =>{
          //response就是接口返回的数据
          this.list = response.data.records
          this.total = response.data.total
          console.log(response)
          console.log(this.list)
          console.log(this.total)
        })
        .catch(error =>{
          console.log(error)
        })
    },
    removeDataById(id) {
      //elment-ui的confirm组件
      this.$confirm('此操作将永久课程记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {  //点击确定，执行then方法
        //调用删除的方法
        course.deleteAll(id)
          .then(response =>{//删除成功
            //提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //回到列表页面
            this.getList()
          })
      }) //点击取消，执行catch方法
    }
  }

}
</script>
