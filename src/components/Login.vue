<template>
  <div class="w3layouts-main">
	<div class="bg-layer">
		<h1>自习座位系统登录</h1>
		<div class="header-main">
			<div class="main-icon">
				<span class="fa fa-eercast"></span>
			</div>
			<div class="header-left-bottom">
					<div class="icon1">
						<span class="fa fa-user"></span>
						<input class="userNameText" type="text" placeholder="用户名" v-model="loginForm.username" required=""/>
					</div>
					<div class="icon1">
						<span class="fa fa-lock"></span>
						<input type="password" placeholder="密码" v-model="loginForm.password" required=""/>
					</div>
          <div class="icon2">
						<span class="fa fa-lock"></span>
						<input class="codeText" type="text" placeholder="验证码" v-model="loginForm.verifycode" required=""/>
					</div>
            <div class="identifybox">
              <div class="code" @click="refreshCode">
                  <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
          </div>
					<div class="bottom">
						<button class="btn" @click="login">登 录</button>
					</div>
					<div class="links">
						<p class="right" @click="toRegistered"><a href="">新用户? 注册</a></p>
						<div class="clear"></div>
					</div>
			</div>
		</div>
		<div class="copyright">
			<p>© 2020 Self-study seat search and seat recommendation system. </p>
		</div>
	</div>
  </div>
</template>
 
<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
export default {
  name: "codetest",
  data () {
    return {
      identifyCodes: "1234567890",
      identifyCode: "",
      loginForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      user: {}
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    ...mapMutations(['changeLogin']),
    ...mapMutations(['handleUserName']),
    ...mapMutations(['handleUserRole']),
    login () {
      const _this = this
      if (_this.loginForm.username === '' || _this.loginForm.password === '') {
        _this.$message({
          type: 'error',
          message: '账号密码不能为空!'
        })
      } else if(_this.loginForm.verifycode === ''){
        _this.$message({
          type: 'error',
          message: '请输入验证码!'
        })
      }else if(_this.loginForm.verifycode === _this.identifyCode){
        _this.$axios.post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password,
        },{
          timeout: 1000
          //其他相关配置
        }).then(function(res) {
          console.log(res.data);
          if(res.data.code === 200){
            _this.$message({
              type: 'success',
              message: res.data.info
            })
            _this.user = res.data.data.userInfo;
            _this.userToken = res.data.data.token;
            setTimeout(function(){
                _this.$router.push('/classrooms')
            },1000)
            _this.changeLogin({ Authorization: _this.userToken });
            _this.handleUserName({ userName: _this.user.userName });
            _this.handleUserRole({ userRole: _this.user.userRole });
          }
        }).catch(function(error) {
          _this.$message({
            type: 'error',
            message: '账号或密码错误'
          })
          console.log(error);
        });
      }else{
        _this.$message({
          type: 'error',
          message: '验证码错误!'
        })
      }
    },
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 切换验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      console.log(this.identifyCode)
    },
    toRegistered(){
        this.$router.push('/registered')
        setTimeout(() => {
            location.reload() // 强制刷新
        })
    }
  }
};
</script>

<style>
h1 {
	font-size: 45px;
	color: #fff;
	font-weight: 300;
	text-transform: uppercase;
	letter-spacing: 4px;
	text-align: center;
	padding: 1em 0 0.4em 0;
}
/*-- slide --*/

@keyframes slideleft {
    from {
        background-position: 0%;
    }
    to {
        background-position: 90000%;
    }
}

@-webkit-keyframes slideleft {
    from {
        background-position: 0%;
    }
    to {
        background-position: 90000%;
    }
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
/*-- //slide --*/

/*--header start here--*/
.w3ls-header {
    padding: 0em 0 0;
}
.icon1 {
	margin: 0 0 1em;
	padding: .8em 1em;
	background: rgba(255, 255, 255, 0.94);
}
.icon1 span.fa {
    color: #222;
    width: 22px;
}
.main-icon {
    text-align: center;
}
.main-icon span.fa{
    font-size: 50px;
    color: #fff;
    margin-bottom: 1em;
}
.wthree li {
    display: inline-block;
}
a {
    color: #585858;
    margin: 0em;
}
.bottom {
    margin: 1em 0 0;
}
.header-main {
	max-width: 310px;
	margin: 0 auto;
	position: relative;
	z-index: 999;
	padding: 3em 2em;
	background: rgba(255, 255, 255, 0.04);
	-webkit-box-shadow: -1px 4px 28px 0px rgba(0,0,0,0.75);
	-moz-box-shadow: -1px 4px 28px 0px rgba(0,0,0,0.75);
	box-shadow: -1px 4px 28px 0px rgba(0,0,0,0.75);
}

.sign-up {
    margin: 2em 0;
}
.header-left {
  background: #fff;
  padding: 0px;
}
.sign-up h2 {
    font-size: 22px;
    color: #fff;
    text-align: center;
    background: #fbbc05;
    width: 40px;
    height: 40px;
    line-height: 1.9em;
    border-radius: 50%;
    margin: 0 auto;
}
::-webkit-input-placeholder{
    color: #333!important;
}
.userNameText {
    outline: none;
    font-size: 15px;
    color: #222;
	  border:none;
    width: 90%;
    display: inline-block;
    background: transparent;
    letter-spacing: 1px;
}
.header-left-bottom input[type="password"]{
	outline: none;
	font-size: 15px;
    color: #222;
	border:none;
    width: 90%;
	display: inline-block;
	background: transparent;
    letter-spacing: 1px;
}
.header-left-bottom button.btn {
    margin-top: 20px;
    background: #007cc0;
    color: #fff;
    font-size: 15px;
    text-transform: uppercase;
    padding: .8em 2em;
    letter-spacing: 1px;
    transition: 0.5s all;
    -webkit-transition: 0.5s all;
    -moz-transition: 0.5s all;
    -o-transition: 0.5s all;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: none;
	width: 100%;
}

/*-- agileits --*/
.header-left-bottom p {
    font-size: 17px;
    color: #000;
    display: inline-block;
    width: 50%;
    margin: 20px 0 0;
    letter-spacing: 1px;
    float: left;
}

.header-left-bottom p.right {
    margin-left: 74px;
	text-align: center;
}
.header-left-bottom p a {
	font-size: 13px;
	color: #e2e2e2;
}
.social {
    margin: 2em 0 0;
}
.heading h5 {
    color: #c5c5c5;
    color: #000000;
    margin-top: 8px;
    font-size: 20px;
}
.social span.fa {
	color: #fff;
	font-size: 12px;
	line-height: 35px;
	margin: 0 5px;
	transition: 0.5s all;
}
.social ul li {
    display: inline-block;
    margin: 0 5px;
    font-size: 15px;
    color: #fff;
    letter-spacing: 1px;
    text-transform: capitalize;
}
.social a.facebook{
    background: #3b5998;
}
.social a.twitter{
    background: #1da1f2;
}
.social a.linkedin {
    background: #00a0dc;
}
.social a.google {
    background: #dd4b39;
}
.social ul li a {
	background: rgba(255, 255, 255, 0.22);
	width: 35px;
	height: 35px;
	line-height: 35px;
	display: block;
	text-align: center;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	-ms-border-radius: 50%;
	-o-border-radius: 50%;
}

.login-check {
    position: relative;
}
.checkbox i {
    position: absolute;
    top: 0px;
    left: 36%;
    text-align: center;
    display: block;
    width: 19px;
    height: 17px;
    outline: none;
    background: #fff;
    border-radius: 0px;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    -o-border-radius: 0px;
    cursor: pointer;
}
.checkbox input:checked + i:after {
    opacity: 1;
}
.checkbox input + i:after {
    position: absolute;
    opacity: 0;
    transition: opacity 0.1s;
    -o-transition: opacity 0.1s;
    -ms-transition: opacity 0.1s;
    -moz-transition: opacity 0.1s;
    -webkit-transition: opacity 0.1s;
}
.checkbox input + i:after {
    content: url(../assets/tick.png);
    top: -1px;
    left: 2px;
    width: 15px;
    height: 15px;
}
.checkbox {
    position: relative;
    display: block;
    padding-left: 30px;
    text-transform: capitalize;
    letter-spacing: 1px;
    font-size: 14px;
    color: #fff;
}
input[type="checkbox" i] {
    display: none;
}
/*-- w3layouts --*/
/*-- header end here --*/
h2 {
    font-size: 26em;
    color: #fff;
    line-height: 1.3em;
    letter-spacing: 10px;
}
h3 {
    font-size: 2em;
    color: #fff;
}
h3 a {
    font-size: 17px;
    padding-left: 12px;
    color: #04c9f9;
    text-decoration: underline;
}
/*-- copyright --*/
.copyright {
    padding: 2em 0;
    text-align: center;
}
.copyright p {
    font-size: 15px;
    letter-spacing: 1px;
    color: #ccc;
    line-height: 1.8em;
}
.copyright p a{
    color: #fff; 
	-webkit-transition: 0.5s all;
	-moz-transition: 0.5s all;
	-o-transition: 0.5s all;
	-ms-transition: 0.5s all;
	transition: 0.5s all;
}
/*-- //copyright --*/
/*-- //main --*/

/*-- responsive-design --*/ 

@media(max-width:667px){
	
	h1 {
		font-size: 40px;
		letter-spacing: 3px;
	}
}

@media(max-width:415px){
	
	h1 {
		font-size: 35px;
		letter-spacing: 3px;
	}
	.social {
		margin: 1em 0 0;
	}
	.copyright {
		padding: 2em 1em;
	}
}
@media(max-width:384px){
	.main-icon span.fa {
		margin-bottom: .6em;
	}
	.header-main {
		max-width: 310px;
		margin: 0 1em;
	}
	.header-left-bottom input[type="text"],.header-left-bottom input[type="password"] {
		width: 88%;
	}
	.social ul li {
		margin: 0 2px;
	}
	h1 {
		font-size: 30px;
	}
}
.code {
  float: right;
  margin: 4px 4px 0 0;
}
.icon2 {
  float: left;
  width: 150px;
	margin: 0 0 1em;
	padding: .8em 1em;
	background: rgba(255, 255, 255, 0.94);
}
.icon2 span.fa {
    float: left;
    color: #222;
    margin: 4px 4px 0 6px;
}
.codeText{
    outline: none;
    font-size: 15px;
    color: #222;
	  border:none;
    width: 120px;
    display: inline-block;
    background: transparent;
    letter-spacing: 1px;
}
</style>