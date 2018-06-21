import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};


const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8090' :
    env === 'production' ?
    'http://localhost:8080' :
    'http://debug.url.com';


util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    withCredentials:true,
});
util.ajax.interceptors.response.use((response) => {
    if (response.data && response.data.error) {
        window.vueMain.$Message.error(response.data.error);
        if (response.data.error == "您还未登录系统！") {
            window.vueMain.$router.push({name: 'login'});
        }
    return response;
});

util.kingdeeAjax = axios.create({
    baseURL: "http://ip:port/interface-service-v3/mobileApi?service=",
    timeout: 60000,
});



export default util;