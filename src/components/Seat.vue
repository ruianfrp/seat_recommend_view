<template>
<div class="content">
	<h1>座位详情</h1>
	<div class="main">
		<h2>{{classroomInfo.classroomName}}</h2>
		<div class="demo">
			<div id="seat-map" class="seatCharts-container" tabindex="0" aria-activedescendant="4_1">
				<div class="front">讲台</div>					
				<div class="seatCharts-row" v-for="(row,i) in seatList" :key="i">
					<div class="seatCharts-cell seatCharts-space">{{i+1}}</div>
					<div v-for="(col,j) in row" :key="j">
						<div v-if="col==0" role="checkbox" aria-checked="false" focusable="true" tabindex="-1" class="seatCharts-seat seatCharts-cell available"></div>
						<div v-if="col==1" role="checkbox" aria-checked="false" focusable="true" tabindex="-1" class="seatCharts-seat seatCharts-cell unavailable"></div>
						<div v-if="col==2" class="seatCharts-cell seatCharts-space"></div>
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
				<div id="legend" class="seatCharts-legend"><ul class="seatCharts-legendList"><li class="seatCharts-legendItem"><div class="seatCharts-seat seatCharts-cell available"></div><span class="seatCharts-legendDescription">无人</span></li><li class="seatCharts-legendItem"><div class="seatCharts-seat seatCharts-cell unavailable"></div><span class="seatCharts-legendDescription">有人</span></li></ul></div>
			</div>
			<div style="clear:both"></div>
	    </div>	
	</div>
	<p class="copy_rights">© 2020 Self-study seat search and seat recommendation system. </p>
</div>
</template>

<script>
import axios from 'axios';

export default {
	mounted:function(){
		this.getClassroomInfo();
		this.getSeatInfo();
	},
	data() {
		return {
			classroomId:'',
			seatList:[],
			classroomInfo:{}
		};
  	},
	methods: {
		getClassroomInfo(){
			const _this = this
			_this.classroomId = window.location.href.split('?')[1].split('=')[1];
			console.log("这是" + this.classroomId)
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
						console.log(_this.classroomInfo)
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
			console.log("那是" + _this.classroomId)
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
				}).catch(function(error) {
					_this.$message({
						type: 'error',
						message: '操作异常!'
					})
			});

		}
	},
}
</script>
<style>
body{
	height: 100%;
	padding:0;
	margin:0;
    background:url(../assets/bg.jpg) no-repeat center;
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
div.seatCharts-container {
    border-right: 1px solid #adadad;
    width: 60%;
    padding: 0 20px 0 0;
    float: left;
}
div.seatCharts-legend {
	padding-left: 0px;
	}
ul.seatCharts-legendList {
	padding-left: 0px;
	}
.seatCharts-legendItem{
	margin-top: 10px;
	line-height: 2;
	}
span.seatCharts-legendDescription {
	margin-left: 5px;
	line-height: 30px;
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

</style>