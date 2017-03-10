
let events ={};

const makeFn =(dom, type, selector, fn)=>{
	if(typeof fn ==='undefined' && typeof selector==='function'){
		fn = selector;
		selector =false;
	}
	if(!events[dom]) events[dom]={};
	if(!events[dom][type]) events[dom][type]={};
	if(!events[dom][type][selector]) events[dom][type][selector]={};
	if(!events[dom][type][selector][fn]) events[dom][type][selector][fn]={};
	return events[dom][type][selector][fn] =function(e){
		if(selector){
			let filter =false;
			dom.querySelectorAll(selector).forEach((d)=>{
				if(d==e.target) filter =true;
			});
			if(!filter) return false;
		}
		fn(e, ...Array.from(e.detail));
		if(e.__is_one){
			dom.removeEventListener(type, removeFn(dom, type, selector, fn), false);
		}
	};
};
const removeFn=(dom, type, selector, fn)=>{
	if(typeof fn ==='undefined' && typeof selector==='function'){
		fn = selector;
		selector =false;
	}
	if(events[dom] && events[dom][type] && events[dom][type][selector] && events[dom][type][selector] && events[dom][type][selector][fn]){
		let ccc =events[dom][type][selector][fn];
		if(ccc) delete events[dom][type][selector][fn];
		return ccc;
	} else return false;
};

export default function event(dom){
	return {
		on(type, selector, fn){
			dom.addEventListener(type, makeFn(dom, type, selector, fn), false);
		},
		off(type, selector, fn){
			return dom.removeEventListener(type, removeFn(dom, type, selector, fn), false);
		},
		trigger(type, ...detail){
			dom.dispatchEvent(new CustomEvent(type, {bubbles:true, cancelable:true, detail}));
		},
		one(type, ...detail){
			let e =new CustomEvent(type, {bubbles:true, cancelable:true, detail});
			e.__is_one =true;
			dom.dispatchEvent(e);
		}
	}
}
