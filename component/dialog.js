
import widget from 'widget';
import tpl from './dialog.html';

export default widget({
	tpl:tpl,
	init:()=>false,
	ok:()=>false,
	cancel:()=>false,
	value:'',
	title:'',
	content:'',
	event:{
		init:function(){

		},
		cancel:function(e){
			if(e.target.classList.contains('ui-dialog-over') || e.target.classList.contains('cancel')){
				let r =this.cancel();
				if(!r) this.close();
			}
		},
		ok:function(){
			let r =false;

			if(this.$('.dialog_from_con')){
				var obj = {};
				var formArray = this.$('.dialog_from_con').serializeArray();
				for(let item of formArray){
					obj[item.name] = item.value;
				}
				r = this.ok(obj);
				if(!r) this.close();
			}else{
				if(this.is_prompt) r =this.ok(this.$('input').val());
				else r =this.ok();
				if(!r) this.close();
			}

		},
		fileS:function (e) {
			var reader = new FileReader();
			var input = e.target;
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = function(e){
				console.log('----fiel s ----',this.result,$(input).parent());
				$(input).parent().find('img').attr('src',this.result);
				$(input).parent().find('.dataItem').val(this.result.split('base64,')[1]);
			}
		}
	},
	close:function(){
		this.$('.ui-dialog-over').addClass('hide');
		setTimeout(()=>{
			this.$el.remove();
		}, 500);
	},
	show:function(){
		document.body.appendChild(this.el);
		this.$el.html(this.tpl);
		this.init();
	},
	alert:function(){
		this.is_alert =true;
		this.show();
	},
	confirm:function(){
		this.is_confirm =true;
		this.show();
	},
	prompt:function(){
		this.is_prompt =true;
		this.show();
	},
});