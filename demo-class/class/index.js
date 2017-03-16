/**
 * Created by Vea on 16/12/13 013.
 */

import widget from '../../common/widget';
import tpl from './template.html';

export default widget({
	template:tpl,
	class:'',
	bool:false,
	bool2:false,
	event:{
		changeClass:function(e){
			this.class='red';
		},
		changeBool:function(e){
			this.bool =!this.bool;
		},
		changeBool2:function(e){
			this.bool2 =!this.bool2;
		},
	},
});