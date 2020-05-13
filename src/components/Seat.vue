<template>
<div class="w3layouts-main">
	<div class="bg-layer">
		<div class="content">
			<h1>座位详情</h1>
			<div class="headerbar">
				<ul class="header-ul" style="font-size: 14px;">
					<li><el-button class="ant-dropdown-trigger" type="text" @click="dialogTableVisible=true,getCurrentlyAppointment($store.getters.userName)">Hi , {{$store.getters.userName}}
							<i class="el-icon-user" style="margin-left: 2px;"></i>
						</el-button>
						<el-dialog title="当前预约" :visible.sync="dialogTableVisible">
							<el-table :data="gridData">
								<el-table-column property="startTime" label="日期" width="150"></el-table-column>
								<el-table-column property="classroomName" label="教室名称" width="200"></el-table-column>
								<el-table-column property="seat" label="预约座位"></el-table-column>
							</el-table>
						</el-dialog>
						<el-button @click="exit" class="exitBtn" type="danger" icon="el-icon-switch-button" size="mini" circle></el-button>
					</li>
				</ul>
			</div>
			<div class="main" v-if="isRouterAlive">
				<el-button-group class="seatBtn1">
					<el-button @click="back" type="warning" icon="el-icon-back" size="mini" round>返回</el-button>
					<el-button @click="refresh" type="primary" size="mini" round>刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
				</el-button-group>
				<el-button-group class="seatBtn2">
					<el-button @click="savecanvas(classroomInfo.classroomName)" type="success" icon="el-icon-picture-outline" size="mini" round>导出</el-button>
					<el-button @click="refresh" type="primary" size="mini" round>编辑<i class="el-icon-edit-outline el-icon--right"></i></el-button>
				</el-button-group>
				<h2 class="clsName">{{classroomInfo.classroomName}}</h2>
				<div class="demo">
					<div id="seat-map" class="seatCharts-container" tabindex="0" aria-activedescendant="4_1" v-loading="loading" ref="canvas">
						<div>
							<div class="front">讲台</div>
							<div class="left">
								<span class="left_title">窗户</span>
							</div>
							<div class="seatCharts-row" v-for="(row,i) in seatList" :key="i">
								<div class="seatCharts-cell seatCharts-space">{{i+1}}</div>
								<div v-for="(col,j) in row" :key="j">
									<div v-if="col==0" role="checkbox" aria-checked="false" focusable="true" tabindex="-1"
									class="seatCharts-seat seatCharts-cell available" @click="dialogFormVisible=true,seatX=j+1,seatY=i+1"></div>
										<el-dialog class="dialogSeat" title="预约座位" :visible.sync="dialogFormVisible">
											<el-form class="appointmentSeat" :model="ruleForm" ref="ruleForm" label-width="100px">
												<el-form-item label="预约日期" required>
													<el-col :span="11">
														<el-form-item prop="date1" :rules="[
															{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }
														]">
															<el-date-picker
															v-model="ruleForm.date1"
															type="date"
															placeholder="选择日期"
															format="yyyy-MM-dd"
															value-format="yyyy-MM-dd"
															style="width: 100%;"
															:picker-options="pickerOptions0">
															</el-date-picker>
														</el-form-item>
													</el-col>
												</el-form-item>
											</el-form>
											<div slot="footer" class="dialog-footer">
												<el-button @click="dialogFormVisible=false">取 消</el-button>
												<el-button type="primary" @click="appointment(seatX,seatY)">确 定</el-button>
											</div>
										</el-dialog>
									<div v-if="col==1" role="checkbox" aria-checked="false" focusable="true" tabindex="-1" class="seatCharts-seat seatCharts-cell unavailable">
										<i class="el-icon-s-check" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i>
									</div>
									<div v-if="col==2" class="seatCharts-cell seatCharts-space"></div>
									<div v-if="col==3" role="checkbox" aria-checked="false" focusable="true" tabindex="-1" class="seatCharts-seat seatCharts-cell appointment">
										<i class="el-icon-user-solid" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i>
									</div>
									<div v-if="col==4" role="checkbox" aria-checked="false" focusable="true" tabindex="-1" class="seatCharts-seat seatCharts-cell damage">
										<i class="el-icon-warning" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="booking-details">
						<ul class="book-left">	
							<li>总座位数</li>
							<li>空座位数</li>
							<li>教室介绍</li>	
						</ul>
						<ul class="book-right">	
							<li>{{classroomInfo.seatNum}}</li>
							<li>{{classroomInfo.freeSeatNum}}</li>
						</ul>
						<div class="clear">{{classroomInfo.classroomInfo}}</div>
						<div id="legend" class="seatCharts-legend">
							<ul class="seatCharts-legendList">
								<li class="seatCharts-legendItem">
									<div class="seatCharts-seat seatCharts-cell available"></div>
									<span class="seatCharts-legendDescription">无人</span>
								</li>
								<li class="seatCharts-legendItem">
									<div class="seatCharts-seat seatCharts-cell unavailable"><i class="el-icon-s-check" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i></div>
									<span class="seatCharts-legendDescription">有人</span>
								</li>
								<li class="seatCharts-legendItem">
									<div class="seatCharts-seat seatCharts-cell appointment"><i class="el-icon-user-solid" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i></div>
									<span class="seatCharts-legendDescription">已预约</span>
								</li>
								<li class="seatCharts-legendItem">
									<div class="seatCharts-seat seatCharts-cell damage"><i class="el-icon-warning" style="margin: 4px 2px 2px 2px;font-size: 20px;"></i></div>
									<span class="seatCharts-legendDescription">损坏座位</span>
								</li>
							</ul>
						</div>
					</div>
					<div style="clear:both"></div>
				</div>	
			</div>
			<p class="copy_rights">© 2020 Self-study seat search and seat recommendation system. </p>
		</div>
	</div>
</div>
</template>

<script>
import axios from 'axios';
import html2canvas from "html2canvas"

export default {
	mounted:function(){
		this.getClassroomInfo();
		this.getSeatInfo();
	},
	data() {
		return {
			gridData: [],
			seatX:'',
			seatY:'',
			dialogFormVisible: false,
			dialogTableVisible: false,
			isRouterAlive:true,
			classroomId:'',
			seatList:[],
			classroomInfo:{},
			loading: true,
			ruleForm:{
				date1: ''
			},
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
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
		getClassroomInfo(){
			const _this = this
			_this.classroomId = window.location.href.split('?')[1].split('=')[1];
			_this.$axios.post('http://localhost:5000/get_classInfo_by_id', {
				classroomId: this.classroomId
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code === 200){
						_this.$message({
							type: 'success',
							message: res.data.info
						})
						_this.classroomInfo=res.data.data.classroom
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
		getSeatInfo(){
			const _this = this
			_this.classroomId = window.location.href.split('?')[1].split('=')[1];
			_this.$axios.post('http://localhost:5000/seat_real', {
				classroomId: this.classroomId
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code === 200){
						_this.$message({
						type: 'success',
						message: res.data.info
						})
						_this.seatList=res.data.data.seats
						console.log(_this.seatList)
					}else{
						_this.$message({
						type: 'error',
						message: res.data.error
						})
					}
					_this.loading = false
				}).catch(function(error) {
					_this.$message({
						type: 'error',
						message: '操作异常!'
					})
			});
		},
		getCurrentlyAppointment(userNo){
			const _this = this
			console.log(userNo)
			_this.$axios.post('http://localhost:5000/currently_appointment', {
				userNo: userNo
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code === 200){
						_this.$message({
							type: 'success',
							message: res.data.info
						})
						_this.gridData = res.data.data.appointments
					}else if(res.data.code === 300){
						_this.$message({
							type: 'warning',
							message: res.data.warn
							
						})
					}
					else{
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
		appointment(seatX, seatY){
			const _this = this
			_this.classroomId = window.location.href.split('?')[1].split('=')[1];
			_this.$axios.post('http://localhost:5000/seat_appointment', {
				classroomId: this.classroomId,
				seatX: seatX,
				seatY: seatY,
				startTime: this.ruleForm.date1,
				userNo: localStorage.getItem('userName')
				}).then(function(res) {
					console.log(res.data);
					if(res.data.code === 200){
						_this.$message({
							type: 'success',
							message: res.data.info
						})
						_this.loading = false
						_this.dialogFormVisible = false
						_this.getSeatInfo()
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
		savecanvas(classroomName){
			let canvas = document.querySelector('.seatCharts-container');
			let that = this;
			html2canvas(canvas,{scale:2,logging:false,useCORS:true}).then(function(canvas) {
					let type = 'png';
					let imgData = canvas.toDataURL(type);
					// 照片格式处理
					let _fixType = function(type) {
						type = type.toLowerCase().replace(/jpg/i, 'jpeg');
						let r = type.match(/png|jpeg|bmp|gif/)[0];
						return 'image/' + r;
					};
					imgData = imgData.replace(_fixType(type),'image/octet-stream');
					let filename = classroomName + '.' + type;
					that.saveFile(imgData,filename);
			});
		},
		saveFile(data, filename){
			let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = data;
			save_link.download = filename;
		
			let event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
		},
		back(){
			this.$router.push('/classrooms')
		},
		refresh(){
			this.$router.go(0);
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
}
</script>
<style>
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
body{
	height: 100%;
	padding:0;
	margin:0;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    -ms-background-size: cover;
    -moz-background-size: cover;
	font-family: 'Open Sans', sans-serif !important;
}

h1,h2,h3,h4,h5,h6{
	margin:0;	
	font-family: 'Kotta One', serif;
}	
p{
	margin:0;
}
ul{
	margin:0;
	padding:0;
}
label{
	margin:0;
}
/*-- main --*/
.content{
	padding:50px 0;
}
.content h1{
    color: #fff;
    font-size: 38px;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
}
.main{
    width: 50%;
    margin: 45px auto;
    background:rgba(255, 255, 255, 0.88);
    padding: 30px 30px;
}
.main h2 {
    color: #000000;
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
    text-transform: capitalize;
    font-weight: 500;
}
p.copy_rights {
    color: #fff;
    font-size: 14px;
    text-align: center;
}
p.copy_rights a{
	text-decoration:none;
	color:#fff;
}
p.copy_rights a:hover{
	text-decoration:underline;
}
/*-- movie ticket --*/
.front{
    margin: 5px 30px 20px 30px;
    background-color: #D88A04;
    color: #fff;
    text-align: center;
    padding: 9px 0;
    border-radius: 3px;
	}
.booking-details {
    float: right;
    width: 28%;
}
.booking-details h3 {
	margin: 10px 10px 0 0;
	font-size: 16px;
	}
.booking-details p {
    line-height: 1.5em;
    font-size: 18px;
    color: #D88A04;
	font-weight:600;
}
.booking-details p span{
    color: #000;
    font-size: 14px;
	font-weight:normal;
}
div.seatCharts-cell {
	color: rgb(0, 0, 0);
    height: 29px;
    width: 29px;
    line-height: 27px;
    margin: 3px;
    float: left;
    text-align: center;
    outline: none;
    font-size: 13px;
	}
div.seatCharts-seat {
	color: #fff;
	cursor: pointer;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
	}
div.seatCharts-row {
	float: center;
	margin-left: 50px;
	height: 45px;
	}
div.seatCharts-seat.available {
	background-color: #949494;
	}
div.seatCharts-seat.focused {
	background-color: #00B70C;
	border: none;
	}
div.seatCharts-seat.selected {
	background-color: #00B70C;
	}
div.seatCharts-seat.unavailable {
	background-color: #D00000;
	cursor: not-allowed;
	}
div.seatCharts-seat.appointment {
	background-color: #2b8bb8;
	cursor: not-allowed;
	}
div.seatCharts-seat.damage {
	background-color: #c08a14;
	cursor: not-allowed;
	}
div.seatCharts-container {
    border-right: 1px solid #adadad;
    width: 60%;
    padding: 0 20px 0 0;
    float: left;
}
ul.seatCharts-legendList {
	margin-top: 130px;
	}
.seatCharts-legendItem{
	float: left;
	}
span.seatCharts-legendDescription {
	float: left;
	line-height: 30px;
	margin-left: 10px;
	margin-right: 10px;
	}
.checkout-button {
    display: block;
    margin: 16px 0 22px;
    border:none;
    font-size: 16px;
    cursor: pointer;
    background: #D88A04;
    padding: 7px 11px;
    color: #fff;
	outline:none;
	transition: 0.5s all;
    -webkit-transition: 0.5s all;
    -o-transition: 0.5s all;
    -moz-transition: 0.5s all;
    -ms-transition: 0.5s all;
	}
.checkout-button:hover {
    background: #000;
	transition: 0.5s all;
    -webkit-transition: 0.5s all;
    -o-transition: 0.5s all;
    -moz-transition: 0.5s all;
	/*-- w3layouts --*/
    -ms-transition: 0.5s all;
}
#selected-seats {
	max-height: 84px;
	overflow-y: auto;
	overflow-x: none;
	width: 200px;
	}
#selected-seats li{
    border: 1px solid #d3d3d3;
    background: #f7f7f7;
    margin: 6px 0;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #000;
    font-weight: 600;
    padding: 6px 11px;
    width: 50%;
	}
.scrollbar {
    overflow-y: scroll;
}
.booking-details p i {
    color: #000;
    font-size: 18px;
    line-height: 2.2em;
	font-weight:normal;
}
ul.book-left {
    float: left;
    width: 35%;
}
ul.book-right {
    width: 63%;
}
ul.book-left li {
    font-size: 16px;
    font-weight: 600;
    color: #D88A04;
    line-height: 1.9em;
}
ul.book-right li {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    line-height: 1.9em;
}

@media (max-width: 1440px){
	.main {
		width: 50%;
	}
	.content h1 {
		font-size: 33px;
	}	
}
@media (max-width: 1366px){
	.main {
		width: 53%;
	}	
}
@media (max-width: 1280px){
	.main {
		width: 56%;
	}	
}
@media (max-width: 1080px){
	.main {
		width: 67%;
	}	
}
@media (max-width: 1024px){
	div.seatCharts-container {
		width: 57%;
		padding: 0 13px 0 0;
	}
	.booking-details {
		width: 36%;
	}	
}
@media (max-width: 991px){
	div.seatCharts-container {
		width: 58%;
	}
	.content h1 {
		font-size: 31px;
	}	
}
@media (max-width: 800px){
	.main {
		width: 79%;
	}
	/*-- w3layouts --*/
	.booking-details {
		width: 33%;
	}
	div.seatCharts-container {
		width: 62%;
	}
	.front {
		margin: 5px 9px 45px 38px;
	}
	ul.book-right {
		width: 57%;
	}
	.main h2 {
		font-size: 25px;
	}	
}
@media (max-width: 768px){
	div.seatCharts-container {
		width: 60%;
	}
	.main {
		width: 85%;
	}
	.content {
		padding: 112px 0;
	}	
}
@media (max-width: 736px){
	div.seatCharts-container {
		width: 62%;
	}
	.content h1 {
		font-size: 27px;
	}
	.main h2 {
		font-size: 24px;
	}
	.content {
		padding: 74px 0;
	}	
}
@media (max-width: 667px){
	div.seatCharts-container {
		width: 100%;
		padding: 0 0px 0 0;
	    border: none;
	}	
	.booking-details {
		width: 100%;
		margin-top: 35px;
	}
	/*-- agileits --*/
	.main {
		width: 59%;
	}
	.content h1 {
		font-size: 24px;
	}
}
@media (max-width: 640px){
	.content {
		padding: 59px 0;
	}
	.main {
		width: 61%;
	}
	.front {
		margin: 5px 6px 45px 6px;
	}	
}
@media (max-width: 600px){
	.main h2 {
		font-size: 21px;
	}
	.main {
		width: 65%;
	}
	.front {
		margin: 5px 6px 36px 6px;
	}	
}
@media (max-width: 568px){
	.main {
		width: 68%;
	}	
}
@media (max-width: 480px){
	.main {
		padding: 18px 18px;
		width: 81%;
	}
	p.copy_rights {
		font-size: 13px;
		line-height: 1.8em;
		width: 90%;
		margin: 0 auto;
	}	
}
@media (max-width: 414px){
	.main {
		width: 85%;
	}
	div.seatCharts-cell {
		height: 25px;
		width: 25px;
		line-height: 26px;
		margin: 3px;
		font-size: 12px;
	}	
	.content h1 {
		font-size: 22px;
	}
	.main h2 {
		margin-bottom: 21px;
	}
}
@media (max-width: 384px){
	div.seatCharts-cell {
		height: 23px;
		width: 23px;
		line-height: 24px;
	}	
	.content {
		padding: 45px 0;
	}
}
@media (max-width: 375px){
	.main h2 {
		font-size: 20px;
	}
	div.seatCharts-cell {
		margin: 2px 3px 2px 2px;
	}
	.main {
		margin: 28px auto;
	}
	ul.book-right li ,ul.book-left li {
		font-size: 14px;
	}
	.content h1 {
		font-size: 19px;
	}
}
@media (max-width: 320px){
	.content {
		padding: 41px 0;
	}
	.main h2 {
		font-size: 17px;
	}
	.front {
		margin: 5px 6px 25px 6px;
		font-size: 14px;
		padding: 7px 0;
	}
	.content h1 {
		font-size: 18px;
	}
	div.seatCharts-cell {
		margin: 2px 2px 2px 2px;
	}
	.main {
		padding: 15px 8px;
		width: 90%;
	}
	div.seatCharts-cell {
		height: 22px;
		width: 22px;
		line-height: 22px;
		font-size: 11px;
	}
	.checkout-button {
		font-size: 14px;
	}
	span.seatCharts-legendDescription {
		line-height: 0px;
		font-size: 13px;
	}
}
.left{
	float: left;
	display: flex;
	align-items:center;
	height: 310px;
	padding: 10px;
    border-radius: 3px;
	background-color: rgb(119, 188, 201);
    color: #fff;
}
.left_title{
	display: block;
	word-wrap: break-word;
	width: 20px;
}
.seatBtn1{
	float: right;
}
.seatBtn2{
	float: left;
}
.headerbar{
	float: right;
	margin-right: 320px;
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
.exitBtn{
    margin-left: 5px;
}

</style>