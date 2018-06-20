import Vue from 'vue';
import moment from "moment";
Vue.filter("date", function (input, fullTime) {
    if(input==undefined) {
        return "";
    }
    let formatString = fullTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    return new moment(input).format(formatString);

});

window.Vue=Vue;
export default{};