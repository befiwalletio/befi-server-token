const uuid = require('uuid');
const md5 = require('md5');
class StringDate{

    constructor() {
        this.date = new Date();
    }

    calc(str){
        if (str.contains("+")){
            str = str.replace('+',"")
            let result =this._query_params(str);
            if (result){
                this._add(result[0],result[1])
            }
        }else if (str.contains("-")){
            str = str.replace('-',"")
            let result =this._query_params(str);
            if (result){
                this._sub(result[0],result[1])
            }
        }
        return this;
    }

    _query_params(str){
        //day
        //year
        //mouth
        //hour
        //minute
        //second
        let index=0;
        let unit="";

        if (str.indexOf("day")>0){
            unit='day';
        }else if (str.indexOf("year")>0){
            unit='year';
        }else if (str.indexOf("mouth")>0){
            unit='mouth';
        }else if (str.indexOf("hour")>0){
            unit='hour';
        }else if (str.indexOf("minute")>0){
            unit='minute';
        }else if (str.indexOf("second")>0){
            unit='second';
        }
        if (index>0){
            let count=0;
            let temp = str.substr(0,index);
            try {
                count = parseInt(temp);
            } catch (e) {
            }
            if (count>0){
                return [count,unit];
            }
        }
        return null;
    }
    //+
    _add(count,unit){
        if (unit === 'day'){
            this.date.setDate(this.date.getDate()+count);
        }else if (unit === 'year'){
            this.date.setFullYear(this.date.getFullYear()+count);
        }else if (unit === 'mouth'){
            this.date.setMonth(this.date.getMonth()+count);
        }else if (unit === 'hour'){
            this.date.setHours(this.date.getHours()+count);
        }else if (unit === 'minute'){
            this.date.setMinutes(this.date.getMinutes()+count);
        }else if (unit === 'second'){
            this.date.setSeconds(this.date.getSeconds()+count);
        }
    }
    //-
    _sub(count,unit){
        if (unit === 'day'){
            this.date.setDate(this.date.getDate()-count);
        }else if (unit === 'year'){
            this.date.setFullYear(this.date.getFullYear()-count);
        }else if (unit === 'mouth'){
            this.date.setMonth(this.date.getMonth()-count);
        }else if (unit === 'hour'){
            this.date.setHours(this.date.getHours()-count);
        }else if (unit === 'minute'){
            this.date.setMinutes(this.date.getMinutes()-count);
        }else if (unit === 'second'){
            this.date.setSeconds(this.date.getSeconds()-count);
        }
    }

    timestamp(ts){
        this.date.setTime(ts);
        return this;
    }
    format(format){
        return this.date.format(format);
    }
}
if (!Array.hasOwnProperty("same")){
    Array.prototype.searchSame = function(target){
        let temp=[];
        if (target=== null){
            return temp;
        }
        for (let i = 0; i < this.length; i++) {
            let temp1 = this[i];
            for (let j = 0; j < target.length; j++) {
                let temp2 = target[j];
                if (temp1 === temp2){
                    temp.push(temp1);
                }
            }
        }
        return temp;
    };
    Array['same']=function (origin,target) {
        if (origin===null){
            return [];
        }
        return origin.searchSame(target);
    }
}
if (!Array.hasOwnProperty('diff')){
    Array.prototype.searchDiff = function(target){
        let temp=[];
        if (target===null){
            return temp;
        }
        for (let i = 0; i < this.length; i++) {
            let temp1 = this[i];
            let isSame = false;
            for (let j = 0; j < target.length; j++) {
                let temp2 = target[j];
                if (temp1 === temp2){
                    isSame = true;
                }
            }
            if (!isSame){
                temp.push(temp1);
            }
        }
        return temp;
    };
    Array['diff']=function (origin,target) {
        if (origin===null){
            return [];
        }
        return origin.searchDiff(target);
    }
}

if (!Date.hasOwnProperty("format")){
    Date.prototype.format=function (format){
        if (format == null || format === ''){
            format = "yyyy-MM-dd hh:mm:ss";
        }
        let f = format;
        let o = {
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "S": this.getMilliseconds(),
        };
        if (/(y+)/.test(f)) {
            f = f.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(f)) {
                f = f.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k])   : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return f;
    }
    Date['format']=function (ts,format){
        if (ts instanceof Date){
            return ts.format(format);
        }
        return new Date(ts).format(format);
    }
}

if (!String.hasOwnProperty('isEmpty')) {
    String['isEmpty'] = function (value) {
        if (value === undefined
            || value == null
            || value === ''
        ) {
            return true;
        }
        return false;
    };
    String['isNotEmpty'] = function (value) {
        return !String.isEmpty(value);
    };
}
if (!String.hasOwnProperty('random')) {
    String['random'] = function (length) {
        let e = '';
        for (let n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', o = 0;
             o < length; o++) {
            e += n.charAt(Math.floor(Math.random() * n.length));
        }
        return e;
    };
}
if (!String.hasOwnProperty('contains')) {
    String['contains'] = function (str, target) {
        if (String.isEmpty(str) || String.isEmpty(target)) {
            return false;
        }
        return str.indexOf(target) >= 0;
    }
    String.prototype.contains = function (target) {
        if (String.isEmpty(target)) {
            return false;
        }
        return this.indexOf(target) >= 0;
    }
}
if (!String.hasOwnProperty('date')) {
    String['date'] =new StringDate();
}
if (!String.hasOwnProperty('uuid')) {
    String['uuid'] = function (){
        return uuid.v1();
    }
}
if (!String.hasOwnProperty('md5')) {
    String['md5'] = function (obj){
        if (obj){
            return md5(obj);
        }
        return md5(String.uuid());
    }
}
if (!String.hasOwnProperty('map')) {
    String.prototype.map=function (sig1,sig2){
        if (String.isEmpty(sig1) || String.isEmpty(sig2) ){
            return {};
        }
        let items = this.split(sig1);
        let result = {};
        for (let item of items) {
            let split = item.split(sig2);
            if (split.length===2){
                result[split[0]]=split[1];
            }
        }
        return result;
    }
    String['map'] = function (target,sig1,sig2){
        if (target){
            return target.map(sig1,sig2);
        }
        return {};
    }
}

