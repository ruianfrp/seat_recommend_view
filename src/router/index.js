import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Registered from '@/components/Registered'
import Classrooms from '@/components/Classrooms'
import Seat from '@/components/Seat'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/registered',
      name: 'Registered',
      component: Registered,
    },
    {
      path: '/classrooms',
      name: 'Classrooms',
      component: Classrooms,
    },
    {
      path: '/seat',
      name: 'Seat',
      component: Seat,
    }
  ],
  mode: 'history',
});


router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
 
    if (token === 'null' || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});
 
export default router;