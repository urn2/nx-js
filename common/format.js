'use strict';
/**
 * 格式化模块
 */
/**
 * 左侧按位补零
 * @param value 原字符串
 * @param len 输出字符串长度
 * @param pad 补位字符串
 */
let padStart=(value, len, pad='0000000000')=>(pad+value).substr(0-len);
/**
 * 格式化时间
 * @param date 时间对象 或 时间字符串 或 时间戳（包含php时间戳）
 * @returns {{format: format}} 返回一个格式化输入方法
 */
let date=function(date=new Date()){
	if(typeof date =='string') date =parseInt(date);
	if(typeof date =='number') {
		if(date<100000) date +=Date.now();
		else if(date<9000000000) date *=1000;
		date=new Date(date);
	}
	let o = {
		//日
		'd':padStart(date.getDate(), 2),//月份中的第几天，有前导零的 2 位数字	01 到 31
		'j':date.getDate(),//月份中的第几天，没有前导零	1 到 31
		'N':date.getDay(),//ISO-8601 格式数字表示的星期中的第几天	1（表示星期一）到 7（表示星期天）
		'w':date.getDay()-1,//星期中的第几天，数字表示	0（表示星期天）到 6（表示星期六）
		//月
		'm':padStart(date.getMonth()+1, 2),//	数字表示的月份，有前导零	01 到 12
		'n':date.getMonth(),//数字表示的月份，没有前导零	1 到 12
		//年
		'Y':date.getFullYear(),//4 位数字完整表示的年份	例如：1999 或 2003
		'y':(''+date.getFullYear()).substr(2),//2 位数字表示的年份	例如：99 或 03
		//时间
		'G': date.getHours(), //小时，24 小时格式，有前导零	00 到 23
		'H': padStart(date.getHours(), 2), //小时，24 小时格式，有前导零	00 到 23

		"i" : padStart(date.getMinutes(), 2), //有前导零的分钟数	00 到 59>
		"s" : padStart(date.getSeconds(), 2), //秒数，有前导零	00 到 59>
		//"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"u" : date.getMilliseconds() //millisecond
	};
	return {
		/**
		 * 按照指定格式进行输出
		 * @param fmt 时间格式
		 * @returns {string}
		 */
		format:function(fmt='Y-m-d H:i:s'){
			for(let k in o){
				if(new RegExp("("+ k +")").test(fmt)) fmt = fmt.replace(RegExp.$1, o[k]);
			}
			return fmt;
		}
	};
};

/**
 * 返回文件尺寸的字符串，带单位
 * @param size 文件尺寸
 * @param almost 接近设置 0.85 意味着大于 0.85如900B 显示为 0.9KB
 * @param unit 单位从小到大
 * @param thousand 千位是按照1000或1024计数
 * @param space 单位与数字之间的字符
 * @param addFirstUnit 当多于一位的时候，是否每次附带第一个单位，如 3MB 为 3M 附带 B
 * @param float 浮点位数 0.9KB 浮点为0 的时候显示为 1KB
 */
let size =(size, {almost=0.85, unit='BKMGTP', thousand=1024, space='', addFirstUnit=true, float=0}={})=>{
	let out =(n, idx)=>{
		let m =float?Math.round(n*Math.pow(10, float))/Math.pow(10, float):Math.round(n);
		return `${m}${space}${unit[idx]}${(addFirstUnit && idx)?unit[0]:''}`
	};
	//let genPowArray =function* (n,len){
	//	for(let i=0;i<len;i++){
	//		yield [i, Math.pow(n, i+1)];
	//	}
	//};
	let o =1;
	let i;
	for(i=0;i<unit.length;i++){
		let s=Math.pow(thousand, i+1);
		if(size <s *almost || i ==unit.length-1) break;
		o =s;
	}
	//for(var [idx,s] of genPowArray(thousand, unit.length)){
	//	if(size <s *almost || idx ==unit.length-1) break;
	//	o =s;
	//}
	return out(size/o, i);
};

export {
	date,
	size,
}