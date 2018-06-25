import Vue from 'vue';
import moment from "moment";
Vue.filter("date", function (input, fullTime) {
    if(input==undefined) {
        return "";
    }
    let formatString = fullTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    return new moment(input).format(formatString);

});
Vue.filter("currency",function(input){
    if(input==undefined||input==null) {
        input = 0;
    }
    return parseInt(input).toFixed(2);
});

window.Vue=Vue;
export default{};