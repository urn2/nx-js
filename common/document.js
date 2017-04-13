
import ready from './ready';
export {ready};

import storage from './storage';
export {storage};

/**
 * ================================================================================================================= tag
 */
/**
 * 标签方法
 * @param name
 * @param attr
 * @param content
 * @returns {Element}
 */
export const tag =(name, attr={}, content='')=>{
	let t =document.createElement(name);
	for (let p in attr) t[p] =attr[p];
	let type =content.constructor.name.toLowerCase();
	switch(type){
		case 'string':
		case 'number':
			if(content.length >0) t.innerText =content;
			break;
		case 'array':
			content.forEach((e)=>t.appendChild(tag(...e)));
			break;
		default:
			throw new Error(`不支持的类型 ${type}`);
	}
	return t;
};

/**
 * =============================================================================================================== audio
 * @type {{}}
 */
let audios={};
/**
 * 创建audio标签，并播放
 * @param mp3
 * @returns {*}
 */
export const audio=(mp3)=>{
	if(!audios[mp3]){
		var r={src:mp3};
		r.el=document.createElement('audio');
		r.el.src =mp3;
		document.body.appendChild(r.el);
		document.documentElement.appendChild(r.el);
		r.play =function(){
			r.el.currentTime = 0;
			r.el.play();
		};
		r.pause=function(){
			r.el.pause();
		};
		audios[mp3] =r;
	}
	return audios[mp3];
};
