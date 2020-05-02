import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000'    

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization');
    }
　　return config
    }, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
　　// 对响应数据做点什么
　　return response
}, function (error) {
　　// 对响应错误做点什么
        if (responseError && responseError.response && responseError.response.status === 401) {
           localStorage.removeItem('Authorization');
           this.$router.push('/login');
    　　 }
　　return Promise.reject(error)
});