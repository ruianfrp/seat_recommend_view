import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
 
const store = new Vuex.Store({
 
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    userName: '' || localStorage.getItem('userName'),
    userRole: '' || localStorage.getItem('userRole')
  },
 
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
    },
    handleUserName(state, user){
      state.userName = user.userName;
      localStorage.setItem('userName', user.userName);
    },
    handleUserRole(state, user){
      state.userRole = user.userRole;
      localStorage.setItem('userRole', user.userRole);
    }
  },

  getters:{
    userName: (state) => state.userName,
    userRole: (state) => state.userRole
  }
});
 
export default store;