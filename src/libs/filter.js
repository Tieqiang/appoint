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
Vue.filter("dept",function(input,deptDict){
    if(input==undefined||input==null||deptDict==null) {
        return input;
    }
    for(let item of deptDict) {
        if(item.deptCode==input) {
            return item.deptName;
        }
    }
});

window.Vue=Vue;
export default{};