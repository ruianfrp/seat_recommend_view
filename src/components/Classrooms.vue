<template>
<div class="w3layouts-main">
<body class="bg-layer">
<section class="section-sm">
	<div class="container">
        <div class="headerbar">
            <ul class="header-ul" style="font-size: 14px;">
                <li><span class="ant-dropdown-trigger">Hi , {{$store.getters.userName}}
                        <i class="el-icon-user" style="margin-left: 2px;"></i>
                    </span>
                    <el-button @click="exit" class="exitBtn" type="danger" icon="el-icon-switch-button" size="mini" circle></el-button>
                </li>
            </ul>
        </div>
		<div class="row">
			<div class="col-md-12">
				<div class="search-result bg-gray">
					<h2>教室总览</h2>
				</div>
			    <div>
            <el-button class="addClassroomBtn" type="primary" v-if="$store.getters.userRole == 1" size="mini" round @click="dialogInsertFormVisible = true">
              添加教室<i class="el-icon-circle-plus-outline el-icon--right"></i>
            </el-button>
            <el-dialog class="dialogClassroom" title="添加教室信息" :visible.sync="dialogInsertFormVisible">
              <el-form class="updateClassrommForm" :model="insertForm" :label-position="right" :rules="insertRules" ref="insertForm">
                <el-form-item label="教室名称" :label-width="formLabelWidth" prop="classroomName">
                  <el-input type="text" v-model="insertForm.classroomName"/>
                </el-form-item>
                <el-form-item label="总座位数" :label-width="formLabelWidth" prop="seatNums">
                  <el-input type="text" v-model.number="insertForm.seatNums"/>
                </el-form-item>
                <el-form-item label="教室简介" :label-width="formLabelWidth" prop="classroomInfo">
                  <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  maxlength="100"
                  show-word-limit
                  v-model="insertForm.classroomInfo"/>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInsertFormVisible=false,resetForm('insertForm')">取 消</el-button>
                <el-button type="primary" @click="insertClassroom('insertForm')">确 定</el-button>
              </div>
            </el-dialog>
			    </div>
			</div>
		</div>
		<div class="row">
			<div id="nav" class="col-md-3">
				<div class="category-sidebar">
					<div class="widget category-list">
						<h4 class="widget-header">座位推荐</h4>
							<ul class="category-list">
                <li @click="getClassroomInfo(1)"><a href="#">全部 <span>{{allSeatNum}}</span></a></li>
                <li v-for="seatNum in seatNumForm" :key="seatNum.seatPlaceNo" @click="getSpecialClassroomInfo(seatNum.seatPlaceNo)"><a href="#">{{seatNum.seatPlace}} <span>{{seatNum.counts}}</span></a></li>
							</ul>
					</div>
				</div>
			</div>
			<div class="col-md-9">
				<div class="product-grid-list">
					<div class="row mt-30" v-if="isRouterAlive">
						<div v-for="classroom in classroomForm" :key="classroom.id" class="col-sm-12 col-lg-4 col-md-6">
							<!-- product card -->
							<div class="product-item bg-light">
								<div class="card">
									<div class="thumb-content">
										<!-- <div class="price">$200</div> -->
										<a :href="'/seat?classroomId=' + classroom.id">
											<img class="card-img-top img-fluid" src="../assets/timg.jpg" alt="Card image cap">
										</a>
									</div>
									<div class="card-body">
										<h4 class="card-title"><a :href="'/seat?classroomId=' + classroom.id">{{classroom.classroomName}}</a></h4>
										<ul class="list-inline product-meta">
											<li class="list-inline-item">
												<a :href="'/seat?classroomId=' + classroom.id"><i class="fa fa-group"></i>总座位：{{classroom.seatNum}}</a>
											</li>
											<li class="list-inline-item">
												<a :href="'/seat?classroomId=' + classroom.id"><i class="fa fa-user"></i>剩余总座位：{{classroom.freeSeatNum}}</a>
											</li>
                      <li class="list-inline-item" v-if="classroom.placeFreeSeat!=0">
												<a :href="'/seat?classroomId=' + classroom.id"><i class="el-icon-message-solid"></i>剩余{{specialPlace}}座位：{{classroom.placeFreeSeat}}</a>
											</li>
										</ul>
										<p class="card-text">{{classroom.classroomInfo}}</p>
                      <div v-if="$store.getters.userRole == 1" class="classroomBtn">
                        <el-button type="warning" icon="el-icon-edit" size="mini" circle
                        @click="dialogFormVisible=true,formCls.ClsSeatNum=classroom.seatNum,formCls.ClsName=classroom.classroomName,
                        formCls.ClsInfo=classroom.classroomInfo,formCls.ClsId=classroom.id"></el-button>
                        <el-dialog class="dialogClassroom" title="修改教室信息" :visible.sync="dialogFormVisible">
                          <el-form class="updateClassrommForm" :model="updateForm" :label-position="right" ref="updateForm">
                            <el-form-item label="教室名称" :label-width="formLabelWidth">
                              <label> {{formCls.ClsName}}</label>
                            </el-form-item>
                            <el-form-item label="总座位数" :label-width="formLabelWidth">
                              <el-input type="text" v-model="updateForm.seatNums"/>
                            </el-form-item>
                            <el-form-item label="教室简介" :label-width="formLabelWidth">
                              <el-input
                              type="textarea"
                              :autosize="{ minRows: 3, maxRows: 5}"
                              maxlength="100"
                              show-word-limit
                              v-model="updateForm.classroomInfo"/>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible=false">取 消</el-button>
                            <el-button type="primary" @click="updateClassroom(formCls.ClsSeatNum,formCls.ClsInfo,formCls.ClsId)">确 定</el-button>
                          </div>
                        </el-dialog>
                      <el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除该教室？" @onConfirm="deleteClassroom(classroom.id)">
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle slot="reference"></el-button>
                      </el-popconfirm>
                    </div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="pagination justify-content-center">
					<nav aria-label="Page navigation example">
						<ul class="pagination">
							<li class="page-item">
								<a class="page-link" href="#" aria-label="Previous">
									<span aria-hidden="true">&laquo;</span>
									<span class="sr-only">Previous</span>
								</a>
							</li>
							<li class="page-item"><a class="page-link" href="#">1</a></li>
							<li class="page-item active"><a class="page-link" href="#">2</a></li>
							<li class="page-item"><a class="page-link" href="#">3</a></li>
							<li class="page-item">
								<a class="page-link" href="#" aria-label="Next">
									<span aria-hidden="true">&raquo;</span>
									<span class="sr-only">Next</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	</div>
</section>
</body>
</div>
</template>

<script>
import axios from 'axios';

export default {
  mounted:function(){
    this.getClassroomInfo(0);
    this.getSeatNumInfo();
  },
  data() {
    return {
        specialPlace:'',
        isRouterAlive:true,
        allSeatNum:'',
        classroomForm:[],
        formCls:{
          ClsName:'',
          ClsSeatNum:'',
          ClsInfo:'',
          ClsId:''
        },
        seatNumForm:[],
        dialogFormVisible: false,
        dialogInsertFormVisible: false,
        updateForm: {
          seatNums: null,
          classroomInfo: null
        },
        insertForm: {
          classroomName: null,
          seatNums: null,
          classroomInfo: null
        },
        formLabelWidth: '80px',
        insertRules: {
          classroomName: [
            { required: true, message: '请输入教室名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          seatNums: [
            { required: true, message: '总座位数不能为空'},
            { type: 'number', message: '总座位数必须为数字'}
          ],
          classroomInfo: [
            { required: true, message: '请输入教室简介', trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    reload:function(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    },
    resetForm(formName) {
      //初始化表单
      this.$nextTick(()=>{
        this.$refs[formName].resetFields();
      })
    },
    getClassroomInfo(a) {
      const path = 'http://localhost:5000/classroom_show';
      axios.get(path).then((res) => {
          this.code = res.data.code;
          this.msg = res.data.info;
          this.classroomForm = res.data.data.classrooms
        }).catch((error) => {
          _this.$message({
            type: 'error',
            message: '操作异常!'
          })
        });
        if(a == 1){
          this.reload()
        }
    },
    getSeatNumInfo() {
      const path = 'http://localhost:5000/seat_num_get';
      axios.get(path).then((res) => {
          this.code = res.data.code;
          this.msg = res.data.info;
          this.allSeatNum = res.data.data.allSeatNum
          this.seatNumForm = res.data.data.seatNums
          if(res.data.code === 403){
            _this.$message({
              type: 'error',
              message: '操作异常!'
            })
          }
        }).catch((error) => {
          _this.$message({
            type: 'error',
            message: '操作异常!'
          })
        });
    },
    deleteClassroom(classrooId){
        console.log(classrooId)
        const _this = this
        _this.$axios.post('http://localhost:5000/classroom_delete', {
          id: classrooId
        }).then(function(res) {
          console.log(res.data);
          if(res.data.code === 200){
            _this.$message({
              type: 'success',
              message: res.data.info
            })
            _this.getClassroomInfo()
            _this.reload()
          }else{
            _this.$message({
              type: 'error',
              message: res.data.error
            })
          }
        }).catch(function(error) {
          _this.$message({
            type: 'error',
            message: '操作异常!'
          })
        });
    },
    insertClassroom(formName){
        const _this = this
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.$axios.post('http://localhost:5000/classroom_insert', {
            classroomName: this.insertForm.classroomName,
            seatNums: this.insertForm.seatNums,
            classroomInfo: this.insertForm.classroomInfo
          }).then(function(res) {
            console.log(res.data);
            if(res.data.code === 200){
              _this.$message({
                type: 'success',
                message: res.data.info
              })
              _this.getClassroomInfo()
              _this.dialogInsertFormVisible = false
              _this.$nextTick(()=>{
                _this.$refs[formName].resetFields();
              })
              _this.reload()
            }else{
              _this.$message({
                type: 'error',
                message: res.data.error
              })
            }
          }).catch(function(error) {
            _this.$message({
              type: 'error',
              message: '该教室已存在！'
            })
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    updateClassroom(seatNum,classroomInfo,classroomId){
        const _this = this
        if(this.updateForm.seatNums == null){
          this.updateForm.seatNums = seatNum
        }
        if(this.updateForm.classroomInfo == null){
          this.updateForm.classroomInfo = classroomInfo
        }
        _this.$axios.post('http://localhost:5000/classroom_update', {
          id: classroomId,
          seatNums: this.updateForm.seatNums,
          classroomInfo: this.updateForm.classroomInfo
        }).then(function(res) {
          console.log(res.data);
          if(res.data.code === 200){
            _this.$message({
              type: 'success',
              message: res.data.info
            })
            _this.getClassroomInfo()
            _this.dialogFormVisible = false
            _this.reload()
          }else{
            _this.$message({
              type: 'error',
              message: res.data.error
            })
          }
        }).catch(function(error) {
          _this.$message({
            type: 'error',
            message: '操作异常!'
          })
        });
    },
    getSpecialClassroomInfo(seatPlaceNo) {
      const _this = this
      _this.$axios.post('http://localhost:5000/classroom_special', {
          seatPlace: seatPlaceNo
        }).then(function(res) {
          console.log(res.data);
          if(res.data.code === 200){
            _this.classroomForm = res.data.data.classrooms
            _this.$message({
              type: 'success',
              message: res.data.info
            })
            _this.reload()
            if(seatPlaceNo == 0){
              _this.specialPlace = "普通"
            }else if(seatPlaceNo == 1){
              _this.specialPlace = "靠窗"
            }else{
              _this.specialPlace = "靠门"
            }
          }else if(res.data.code === 400){
            _this.$message({
              type: 'warning',
              message: res.data.info
            })
          }else {
            _this.$message({
              type: 'error',
              message: res.data.error
            })
          }
        }).catch(function(error) {
          _this.$message({
            type: 'error',
            message: '操作异常!'
          })
        });
    },
    toSeat(classId){
        this.$router.push('/seat')
    },
    exit(){
        this.$confirm('确定退出系统?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        }).then(() => {
            localStorage.removeItem('Authorization');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            this.$router.push('/login')
            this.$message({
                type: 'success',
                message: '退出成功!'
            })
            setTimeout(() => {
                location.reload() // 强制刷新
            }, 1000)
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消退出'
            })
        })
    }
  },
};
</script>

<style>
  body {
    line-height: 1.5;
    font-family: "Muli", sans-serif;
  }
  body {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    color: #212529;
    text-align: left;
    background-color: #fff;
  }
  .w3layouts-main{
    background-image: '../assets/bg.jpg';
    background-repeat: repeat-x;
    animation: slideleft 20000s infinite linear;
    -webkit-animation: slideleft 20000s infinite linear;
    background-size: cover;
    -webkit-background-size:cover;
    -moz-background-size:cover; 
    background-attachment: fixed;
    position: relative;
	min-height: 100vh;
  }
  .bg-layer {
    background: rgba(0, 0, 0, 0.7);
    min-height: 100vh;
  }
  *, ::after, ::before {
      box-sizing: border-box;
  }
  .section-sm {
    padding: 70px 0;
  }

  article, aside, dialog, figcaption, figure, footer, header, hgroup, main, nav, section {
      display: block;
  }

  @media (min-width: 1200px){
    .container {
        max-width: 1140px;
    }
  }
  @media (min-width: 768px){
    .col-md-12 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    .col-md-9 {
      -ms-flex: 0 0 75%;
      flex: 0 0 75%;
      max-width: 75%;
    }
  }
  @media (min-width: 992px){
    .col-lg-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
    }
  }
  div {
      display: block;
  }
  .container {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
  }

  .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
  }
  .search-result {
      padding: 20px;
      margin-bottom: 20px;
  }
  .bg-gray {
      background: #F5F5F5;
  }
  #nav{
    padding-top: 36px;
  }
  h2 {
      font-size: 25px;
      letter-spacing: 2px;
  }
  h1, h2, h3, h4, h5, h6 {
      font-family: "Muli", sans-serif;
      font-weight: 600;
      color: #333;
  }
  .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
      margin-bottom: .5rem;
      line-height: 1.2;
  }
  h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: .5rem;
  }
  .col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto {
      position: relative;
      width: 100%;
      min-height: 1px;
      padding-top: 10px;
      padding-right: 15px;
      padding-left: 15px;
  }
  .widget {
      background: #fff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
      padding: 25px 30px 30px;
      margin-bottom: 30px;
      border-radius: 2px;
  }
  .widget .widget-header {
      display: block;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dedede;
  }
  h1, h2, h3, h4, h5, h6 {
      font-family: "Muli", sans-serif;
      font-weight: 600;
      color: #333;
  }
  ol, ul {
      margin: 0;
      padding: 0;
      list-style: none;
  }
  ul.pagination li {
      margin-right: 10px;
  }
  li {
      display: list-item;
      text-align: -webkit-match-parent;
  }
  .product-item .product-meta li {
      margin-right: 15px;
  }
  .list-inline-item {
      display: inline-block;
  }
  dl, ol, ul {
      margin-top: 0;
      margin-bottom: 1rem;
  }
  .widget.category-list ul li:not(:last-child) {
      border-bottom: 1px solid #F4F7F9;
  }
  p, li, input, select, button {
      font-family: "Muli", sans-serif;
      color: #666;
      font-size: 14px;
      font-weight: 400;
  }
  .page-item:first-child .page-link {
      margin-left: 0;
  }
  .page-link {
      position: relative;
      display: block;
      margin-left: -1px;
      background-color: #fff;
      border: 1px solid #ddd;
  }
  ul.pagination li a {
      font-weight: 600;
      border-radius: 3px !important;
      font-size: 16px;
      padding: 0;
      height: 40px;
      width: 40px;
      line-height: 40px;
      text-align: center;
      border-color: transparent;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
      color: #666;
  }
  .product-item .product-meta li a {
      color: #888;
      font-size: 12px;
  }
  .widget.category-list ul li a {
      padding: 8px 0;
      display: block;
  }
  a {
      transition: all .3s ease-in 0s;
      color: #000;
  }
  p {
      margin-top: 0;
  }
  .justify-content-center {
      justify-content: center!important;
  }
  .pagination {
      display: flex;
      padding-left: 0;
      list-style: none;
      border-radius: .25rem;
  }
  .product-item .product-meta li a i {
      margin-right: 4px;
  }
  .product-item .card .card-body .card-text {
      color: #777;
  }
  .card-text:last-child {
      margin-bottom: 0;
  }
  .fa {
      display: inline-block;
      font: normal normal normal 14px/1 FontAwesome;
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
  }
  .fa-group:before {
      content: "\f0c0";
  }
  .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
      white-space: nowrap;
      clip-path: inset(50%);
  }
  [role=button], a, area, button, input:not([type=range]), label, select, summary, textarea {
      touch-action: manipulation;
  }
  a {
      text-decoration: none;
      background-color: transparent;
  }
  .widget.category-list ul li a span {
      float: right;
      font-size: 10px;
      background: #F4F7F9;
      border-radius: 10px;
      padding: 3px 8px;
      color: #84919B;
  }
  .mt-30 {
      margin-top: 30px;
  }
  .product-item {
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
  }
  .bg-light {
      background: #fff;
  }
  .bg-light {
      background-color: #f8f9fa!important;
  }
  .product-item .card {
      border: none;
  }
  .product-item .card .card-body {
      padding: 20px;
  }
  .card-body {
      flex: 1 1 auto;
  }
  .product-item .card .card-body .card-title {
      font-size: 18px;
      margin-bottom: 5px;
      font-weight: 600;
  }
  .product-item .product-meta {
      margin-bottom: 15px;
  }
  .list-inline {
      padding-left: 0;
      list-style: none;
  }
  .card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border-radius: .25rem;
  }
  .product-item .thumb-content {
      position: relative;
  }
  .card-img-top {
      width: 100%;
      border-top-left-radius: calc(.25rem - 1px);
      border-top-right-radius: calc(.25rem - 1px);
  }
  .img-fluid {
      max-width: 100%;
      height: auto;
  }
  img {
      vertical-align: middle;
      border-style: none;
  }
  .header-ul {
    display: flex;
    width: 200px;
  }
  .header-ul li {
    flex-grow: 1;
    text-align: center;
  }
  .header-ul>li img {
    width: 35px;
    height: 35px;
    border-radius: 100px;
  }
  .ant-dropdown-trigger{
      color: rgb(255, 255, 255);
  }
  .headerbar{
      margin-left: 920px;
  }
  .exitBtn{
      margin-left: 5px;
  }
  .classroomBtn{
      margin-left: 150px;
  }
  .addClassroomBtn{
      margin-left: 950px;
  }
  .updateClassrommForm{
      width: 100%;
  }
  .dialogClassroom{
      width: 100%;
  }
</style>