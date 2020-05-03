import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
 
const store = new Vuex.Store({
 
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    userName: '' || localStorage.getItem('userName'),
    userRole: '' || localStorage.getItem('userRole'),
    clsId: '' || localStorage.getItem('clsId'),
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
    },
    handleClassroomId(state, user){
      state.clsId = user.clsId;
      localStorage.setItem('clsId', user.clsId);
    }
  },

  getters:{
    userName: (state) => state.userName,
    userRole: (state) => state.userRole,
    clsId: (state) => state.clsId
  }
});
 
export default store;