/**
 * Created by Vea on 16/12/13 013.
 */

import widget from '../../common/widget';
import tpl from './template.html';

export default widget({
	template:tpl,
	span:'s',
	input:'d',
	a:0,
	b:0,
	event:{
		init:function(){
			'use strict';
			this.span ='123';

			let c=this.el.querySelector('#computed');
			setInterval(()=>{
				c.innerHTML =this.c;
			}, 300);
		},
		getC:function(e){
			e.target.innerHTML =this.c;
		},
	},
	calc:{
		c:function(){
			return parseInt(this.a)+parseInt(this.b);
		}
	}
});