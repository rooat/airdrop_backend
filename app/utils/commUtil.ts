
let commUtil: any = {};

/**
 * 获取范围内的随机数
 * @param min 最小范围值
 * @param max 最大范围值
 */
commUtil.randomnum = (min: number, max: number): string => {
    var num = Math.floor(min + Math.random() * (max - min));
    return String(num);
}

/**
 * 取两数相差秒数
 * @param time2
 * @param time1
 */
commUtil.timeSecond = (time2 :string, time1:string) => {
    let date1:any = new Date(time1);
    let date2:any = new Date(time2);
    var time = (date2 - date1) / 1000;
    return time;
}

/** 随机生成固定位数或者一定范围内的字符串数字组合
 * @param {Number} min 范围最小值
 * @param {Number} max 范围最大值，当不传递时表示生成指定位数的组合
 * @param {String} charStr指定的字符串中生成组合
 * @returns {String} 返回字符串结果
 * */
commUtil.randomRange = (min, max, charStr) =>{
    var returnStr = "", //返回的字符串
        range; //生成的字符串长度
        
    //随机生成字符
    var autoGetStr = function(){
        var charFun = function(){
            var n= Math.floor(Math.random()*62);
            if(n<10){
                return n; //1-10
            }
            else if(n<36){
                return String.fromCharCode(n+55); //A-Z
            }
            else{
                return String.fromCharCode(n+61); //a-z    
            }
        }
        while(returnStr.length< range){
            returnStr += charFun();
        }
    };
    
    //根据指定的字符串中生成组合
    var accordCharStrGet = function(){
        for(var i=0; i<range; i++){
            var index = Math.round(Math.random() * (charStr.length-1));
            returnStr += charStr.substring(index,index+1);
        }
    };
    if(typeof min == 'undefined'){
        min = 10;
    }
     if(typeof max == 'string'){
         charStr = max;
     }
     range = ((max && typeof max == 'number') ? Math.round(Math.random() * (max-min)) + min : min);
     
     if(charStr){
         accordCharStrGet();
     }else{
         autoGetStr();
     }
    return returnStr;
}

export default commUtil;