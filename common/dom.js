
import event from './event';

let isDOM =(value)=>value.constructor.name ==='dom';

class dom extends Array{
	constructor(selector={}, parent=document){
		switch(selector.constructor.name){
			case "String":
				super(...parent.querySelectorAll(selector));
				break;
			case "Array":
			case "Set":
				super(...selector);
				break;
			default:
				if(selector.constructor.name.substr(0,4)==='HTML') super(selector);
				else super();
		}
		return this;
	}
	find(selector='*'){
		return this.length >0 ?new dom([...this[0].querySelectorAll(selector)]):new dom();
	}
	attr(name,value){
		if(arguments.length==0){
			return (this.length>0) ?this[0].getAttribute(name):null;
		}

	}
	val(value){
		if(arguments.length ==0){
			return (this.length>0) ?this[0].value:null;
		} else{
			this.forEach((el)=>el.value =value);
			return this;
		}
	}

	addClass(className){
		this.forEach((el)=>el.classList.add(className));
		return this;
	}
	removeClass(className){
		this.forEach((el)=>el.classList.remove(className));
		return this;
	}
	toggleClass(className, b){
		if(arguments.length >0){
			if(arguments.length >1){
				this.forEach((el)=>el.classList.toggle(className, b));
			} else this.forEach((el)=>el.classList.toggle(className));
		}
		return this;
	}
	hasClass(className){
		if(this.length <1) return false;
		return this[0].classList.contains(className);
	}
	_stylevalue(type, value){
		if(arguments.length >1){
			if(this.length >0) this[0].style[type] =value+'px';
			return this;
		}
		if(this.length <1) return 0;
		return this[0].style[type];
	}
	top(val){
		return this._stylevalue('top', val);
	}
	left(val){
		return this._stylevalue('left', val);
	}
	height(val){
		return this._stylevalue('height', val);
	}
	width(val){
		return this._stylevalue('width', val);
	}
	outerHeight(withMargin =false){
		if(this.length <1) return 0;
		if(!withMargin) return this[0].offsetHeight;
		else{
			let height = this[0].offsetHeight;
			let style = getComputedStyle(this[0]);

			return height + parseInt(style.marginTop) + parseInt(style.marginBottom);
		}
	}
	outerWidth(withMargin =false){
		if(this.length <1) return 0;
		if(!withMargin) return this[0].offsetWidth;
		else{
			let width = this[0].offsetWidth;
			let style = getComputedStyle(this[0]);
			return width + parseInt(style.marginLeft) + parseInt(style.marginRight);
		}
	}
	position(){
		if(this.length <1) return {left:0, top:0};
		return {left: this[0].offsetLeft, top: this[0].offsetTop}
	}
	data(name, value){
		if(arguments.length==0){
			return (this.length <1) ?{} :this[0].dataset;
		} else {
			if(arguments.length >1){
				this.forEach((el)=>el.dataset[name] =value);
				return this;
			} else return this.length<1 ?null :this[0].dataset[name];
		}
	}

	append(htmlString){
		let is_str =typeof htmlString =='string';
		this.forEach((el)=>{
			if(is_str){
				el.innerHTML =el.innerHTML+htmlString;
			} else {
				if(isDOM(htmlString)) el.appendChild(htmlString[0]);
				else el.appendChild(htmlString);
			}
		});
		return this;
	}
	appendTo(){

	}
	html(htmlString){
		if(arguments.length ==0){
			return (this.length>0) ?this[0].innerHTML:null;
		} else{
			this.forEach((el)=>el.innerHTML =htmlString);
			return this;
		}
	}
	text(htmlString){
		if(arguments.length ==0){
			return (this.length>0) ?this[0].innerText:null;
		} else{
			this.forEach((el)=>el.innerText =htmlString);
			return this;
		}
	}
	after(htmlString){
		this.forEach((el)=>el.insertAdjacentHTML('afterend', htmlString));
		return this;
	}
	before(htmlString){
		this.forEach((el)=>el.insertAdjacentHTML('beforebegin', htmlString));
		return this;
	}
	children(){
		return new dom(this[0] ?this[0].children:[]);
	}
	insertAfter(){

	}
	insertBefore(){

	}
	remove(){
		this.forEach((el)=>el.parentNode.removeChild(el));
	}
	next(){
		if(this.length>0) return new dom(this[0].nextElementSibling);
		return new dom();
	}
	prev(){
		if(this.length>0) return new dom(this[0].previousElementSibling);
		return new dom();
	}
	parent(){
		return (this.length >0) ?new dom(this[0].parentNode):new dom();
	}
	parents(){

	}
	siblings(){
		return this.length>0 ? new dom(Array.prototype.filter.call(this[0].parentNode.children, (child)=>child !== this[0])):new dom();
	}
	on(type, selector, data, fn){
		this.forEach((el)=>event(el).on(type, selector, data, fn));
		return this;
	}
	off(type, selector, data, fn){
		this.forEach((el)=>event(el).off(type, selector, data, fn));
		return this;
	}
	trigger(type, ...data){
		this.forEach((el)=>event(el).trigger(type, ...data));
		return this;
	}
	one(type, ...data){
		this.forEach((el)=>event(el).one(type, ...data));
		return this;
	}
	hide(){
		this.forEach((el)=>el.style.display ='none');
		return this;
	}
	show(){
		this.forEach((el)=>el.style.display ='');
		return this;
	}
	toggle(bool=null){
		this.forEach((el)=>el.style.display =bool===null
			?((el.style.display =='none') ?'' :'none')
			:(bool ?'' :'none')
		);
		return this;
	}
}

export default (selector, parent)=>new dom(selector, parent);
