
import widget from '../common/widget';

let tpl =require('./pages.html');

export default widget({
	template:tpl,
	tag:'ui-pages',

	class_btn:'',
	class_active:'current',

	promise:false,//是否为promise模式（如果是必须resolve否则会等待刷新）

	first:'首页',
	last:'尾页',
	prev:'前页',
	next:'后页',

	show:false,

	status:0,
	select:0,
	button:3,
	buttons:[],

	disable_first:true,
	disable_last:true,
	disable_prev:true,
	disable_next:true,

	pages:{page:1,max:0,count:0},
	page:1,
	count:0,
	max:0,

	_first:1,
	_prev:1,
	_next:1,
	_last:1,

	disable:false,

	event:{
		init:function(){
			this.el.querySelectorAll('a').forEach((el)=>this.class_btn.split(' ').forEach((cls)=>el.classList.add(cls)));
			this.render();
		},
		'data:hide':function(e){
			//switch(typeof this.hide){//隐藏按钮
			//	case 'array':
			//		this.hide=this.hide.join('|');
			//		break;
			//	case 'string':
			//		break;
			//	case 'boolean':
			//		this.hide=this.hide ?'first|last|next|prev' :'';
			//		break;
			//	default:
			//		this.hide='first|last';
			//}
		},
		'data:name':function(e, v){
			this.first=('next' in v) ?v['next'] :false;
			this.prev=('prev' in v) ?v['prev'] :false;
			this.first=('first' in v) ?v['first'] :false;
			this.last=('last' in v) ?v['last'] :false;
		},
		'data:pages':function(e, value){
			if(value !==false){
				this.max=parseInt(value.max);
				this.count=parseInt(value.count);
				this.page=parseInt(value.page);
				this.render();
			}
		},
		'data:disable_first':function(e, v){
			this.el.querySelector('[href="#F"]').classList.toggle('disable', v);
		},
		'data:disable_prev':function(e, v){
			this.el.querySelector('[href="#P"]').classList.toggle('disable', v);
		},
		'data:disable_next':function(e, v){
			this.el.querySelector('[href="#N"]').classList.toggle('disable', v);
		},
		'data:disable_last':function(e, v){
			this.el.querySelector('[href="#L"]').classList.toggle('disable', v);
		},
		'click':function(e, page){
			if(e.target.disabled) return ;
			let pb={F:this._first,P:this._prev,N:this._next,L:this._last};
			this.pageit(pb[page] ?pb[page] :page);
		},
		change:function(e){
			this.pageit(e.target.value);
		},
		render:function(){
			this.render()
		},
	},
	render:function(){
		this.show =this.max>0 && this.count>0 && this.count>this.max;
		if(this.show){
			let p=this.page<1 ?1 :this.page;

			this._first=1;
			this._last=Math.ceil(this.count/this.max);
			this._prev=p-1 || 1;
			this._next=p+1;
			this._next=this._next>this._last ?this._last :this._next;

			this.disable_first=this.first && (this._first==p);
			this.disable_last=this.last && (this._last==p);
			this.disable_prev=this.prev && (this._prev==p);
			this.disable_next=this.next && (this._next==p);

			if(this.button >0){
				let _half=parseInt(this.button/2), _prev=1, _next=1;
				_prev=p-_half;
				_prev=_prev<this._first ?this._first :_prev;
				_next=_prev+this.button-1;
				if(_next>this._last){
					_next=this._last;
					_prev=this._last-this.button+1;
					if(_prev<this._first) _prev=this._first;
				}
				let buttons=[];
				for(let i=_prev; i<=_next; i++) buttons.push({page:i, current:i==p, class:(i==p) ?this.class_btn+' '+this.class_active :this.class_btn});
				this.buttons=buttons;
			}
			if(this.show_select){
				let options=[];
				for(let i=this._first; i<=this._last; i++) options.push({page:i, current:i==p});
				this.options =options;
			}
		}
	},
	pageit:function(page){
		if(!this.promise){
			this.fire('page', page);
			this.page =parseInt(page);
			this.render();
			return ;
		}
		if(this.disable) return;
		this.disable =true;
		let D =new Promise((resolve, reject)=>{
			this.fire('page', page, {resolve, reject});
			setTimeout(()=>resolve(), 3000);
		});
		D.then(()=>{
			this.page =parseInt(page);
			this.render();
			this.disable =false;
		}).catch(()=>{
			this.disable =false;
		});
	},
});
