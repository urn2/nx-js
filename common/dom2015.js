
import event from './event';

const _dom_ =Symbol('dom');
let isDOM =(value)=>(_dom_ in value) ?true :false;

function dom(selector={}, parent=document){
	let nd ={};
	nd[_dom_] =true;
	switch(selector.constructor.name){
		case "String":
			nd._ds_ =[].slice.call(parent.querySelectorAll(selector));
			break;
		case "Array":
		case "Set":
			nd._ds_ =[].slice.call(selector);
			break;
		default:
			if(selector.constructor.name.substr(0,4)==='HTML') nd._ds_ =[selector];
			else nd._ds_ =[];
	}
	
	nd.find=function(selector='*'){
		return this._ds_.length >0 ?dom([].slice.call(this._ds_[0].querySelectorAll(selector))):dom();
	};
	nd.attr=function(name,value){
		if(arguments.length==0){
			return (this._ds_.length>0) ?this._ds_[0].getAttribute(name):null;
		}
	};
	nd.val =function(value){
		if(arguments.length ==0){
			return (this._ds_.length>0) ?this._ds_[0].value:null;
		} else{
			this._ds_.forEach((el)=>el.value =value);
			return this;
		}
	};
	nd.addClass=function(className){
		this._ds_.forEach((el)=>el.classList.add(className));
		return this;
	};
	nd.removeClass =function(className){
		this._ds_.forEach((el)=>el.classList.remove(className));
		return this;
	};
	nd.toggleClass=function(className, b){
		if(arguments.length >0){
			if(arguments.length >1){
				this._ds_.forEach((el)=>el.classList.toggle(className, b));
			} else this._ds_.forEach((el)=>el.classList.toggle(className));
		}
		return this;
	};
	nd.hasClass=function(className){
		if(this._ds_.length <1) return false;
		return this._ds_[0].classList.contains(className);
	};
	nd._stylevalue=function(type, value){
		if(arguments.length >1){
			if(this._ds_.length >0) this._ds_[0].style[type] =value+'px';
			return this;
		}
		if(this._ds_.length <1) return 0;
		return this._ds_[0].style[type];
	};
	nd.top=function(val){
		return this._stylevalue('top', val);
	};
	nd.left=function(val){
		return this._stylevalue('left', val);
	};
	nd.height=function(val){
		return this._stylevalue('height', val);
	};
	nd.width=function(val){
		return this._stylevalue('width', val);
	};
	nd.outerHeight=function(withMargin =false){
		if(this._ds_.length <1) return 0;
		if(!withMargin) return this._ds_[0].offsetHeight;
		else{
			let height = this._ds_[0].offsetHeight;
			let style = getComputedStyle(this._ds_[0]);

			return height + parseInt(style.marginTop) + parseInt(style.marginBottom);
		}
	};
	nd.outerWidth=function(withMargin =false){
		if(this._ds_.length <1) return 0;
		if(!withMargin) return this._ds_[0].offsetWidth;
		else{
			let width = this._ds_[0].offsetWidth;
			let style = getComputedStyle(this._ds_[0]);
			return width + parseInt(style.marginLeft) + parseInt(style.marginRight);
		}
	};
	nd.position=function(){
		if(this._ds_.length <1) return {left:0, top:0};
		return {left: this._ds_[0].offsetLeft, top: this._ds_[0].offsetTop}
	};
	nd.data=function(name, value){
		if(arguments.length==0){
			return (this._ds_.length <1) ?{} :this._ds_[0].dataset;
		} else {
			if(arguments.length >1){
				this._ds_.forEach((el)=>el.dataset[name] =value);
				return this;
			} else return this._ds_.length<1 ?null :this._ds_[0].dataset[name];
		}
	};
	nd.append=function(htmlString){
		let is_str =typeof htmlString =='string';
		this._ds_.forEach((el)=>{
			if(is_str){
				el.innerHTML =el.innerHTML+htmlString;
			} else {
				if(isDOM(htmlString)) el.appendChild(htmlString[0]);
				else el.appendChild(htmlString);
			}
		});
		return this;
	};
	nd.appendTo=()=>{};
	nd.html=function(htmlString){
		if(arguments.length ==0){
			return (this._ds_.length>0) ?this._ds_[0].innerHTML:null;
		} else{
			this._ds_.forEach((el)=>el.innerHTML =htmlString);
			return this;
		}
	};
	nd.text=function(htmlString){
		if(arguments.length ==0){
			return (this._ds_.length>0) ?this._ds_[0].innerText:null;
		} else{
			this._ds_.forEach((el)=>el.innerText =htmlString);
			return this;
		}
	};
	nd.after=function(htmlString){
		this._ds_.forEach((el)=>el.insertAdjacentHTML('afterend', htmlString));
		return this;
	};
	nd.before=function(htmlString){
		this._ds_.forEach((el)=>el.insertAdjacentHTML('beforebegin', htmlString));
		return this;
	};
	nd.children=function(){
		return dom(this._ds_[0] ?this._ds_[0].children:[]);
	};
	nd.insertAfter=function(){

	};
	nd.insertBefore=function(){

	};
	nd.remove=function(){
		this._ds_.forEach((el)=>el.parentNode.removeChild(el));
	};
	nd.next=function(){
		if(this._ds_.length>0) return dom(this._ds_[0].nextElementSibling);
		return dom();
	};
	nd.prev=function(){
		if(this._ds_.length>0) return dom(this._ds_[0].previousElementSibling);
		return dom();
	};
	nd.parent=function(){
		return (this._ds_.length >0) ?dom(this._ds_[0].parentNode):dom();
	};
	nd.parents=function(){

	};
	nd.siblings=function(){
		return this._ds_.length>0 ? dom(Array.prototype.filter.call(this._ds_[0].parentNode.children, (child)=>child !== this._ds_[0])):dom();
	};
	nd.on=function(type, selector, data, fn){
		this._ds_.forEach((el)=>event(el).on(type, selector, data, fn));
		return this;
	};
	nd.off=function(type, selector, data, fn){
		this._ds_.forEach((el)=>event(el).off(type, selector, data, fn));
		return this;
	};
	nd.trigger=function(type, ...data){
		this._ds_.forEach((el)=>event(el).trigger(type, ...data));
		return this;
	};
	nd.one=function(type, ...data){
		this._ds_.forEach((el)=>event(el).one(type, ...data));
		return this;
	};
	nd.hide=function(){
		this._ds_.forEach((el)=>el.style.display ='none');
		return this;
	};
	nd.show=function(){
		this._ds_.forEach((el)=>el.style.display ='');
		return this;
	};
	nd.toggle=function(bool=null){
		this._ds_.forEach((el)=>el.style.display =bool===null
			?((el.style.display =='none') ?'' :'none')
			:(bool ?'' :'none')
		);
		return this;
	};
	
	return new Proxy(nd, {
		get:function(target, name){
			if((parseInt(name)>-1 && (name in target._ds_)) || name =='length' || name =='forEach') return target._ds_[name];
			return target[name];
		}
	});
}


export default (selector, parent)=>dom(selector, parent);
