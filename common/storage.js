'use strict';
/**
 * 存储模块，支持cookie sessionStorage localStorage 同样的使用方法
 *
 */

const cookieStorageTime =Symbol('cookieStorageTime');
class cookieStorage{
	constructor(){
		this.setItem =this.setItem.bind(this);
		this.removeItem =this.removeItem.bind(this);
		this.clear =this.clear.bind(this);
	}
	getItem(name, def=null){
		for(let pair of document.cookie.split(/; */)){
			let [n,v,...o] =pair.split('=');
			if(n===name) return decodeURI([v, ...o].join('='));
		}
		return def;
	}
	[cookieStorageTime](second=0){
		if(second ==0) return "";
		else if(second <0) return "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		else{
			const d=new Date();
			if(second>1026820062364) d.setTime(second);
			else if(second>1026820062) d.setTime(second*1000);
			else d.setTime(d.getTime()+second*1000);
			return `; expires=${d.toUTCString()}`;
		}
	}
	setItem(name, value='', {second=0, path='/', domain='', secure=false}={}){
		document.cookie=`${name}=${encodeURI(value)}${this[cookieStorageTime](second)}${path?'; path='+path:''}${!!domain ?'; domain='+domain :''}${secure?'; secure':''}`;
		return true;
	}
	removeItem(name, path='/'){
		this.setItem(name, '', {second:-1, path});
		return true;
	}
	hasItem(name){
		for(let pair of document.cookie.split(/; */)){
			let [n,] =pair.split('=');
			if(n===name) return true;
		}
		return false;
	}
	clear(){
		for(let pair of document.cookie.split(/; */)){
			let [n,] =pair.split('=');
			this.removeItem(n);
		}
	}
	toString(){
		return document.cookie;
	}
	get length(){
		return document.cookie.split(/; */).length;
	}
}
let _storage ={cookie:new Proxy(new cookieStorage, {
	"get"(target, key) {
		return target[key] || target.getItem(key) || undefined;
	},
	"set"(target, key, value) {
		if (key in target) { return false; }
		return target.setItem(key, value);
	},
	"deleteProperty"(target, key) {
		if (key in target) { return false; }
		return target.removeItem(key);
	},
}), local:localStorage, session:sessionStorage};
//let _storage ={cookie:new cookieStorage, local:localStorage, session:sessionStorage};

/**
 * 存储模块
 * @param type
 * @returns {cookieStorage|localStorage|sessionStorage|{}}
 */
export default (type='local')=>_storage[type];