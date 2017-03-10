
import widget from './widget';
import Mustache from 'mustache';

const makeRender =function(el, str){
	Mustache.parse(str);
	return function(data){
		el.innerHTML =Mustache.render(str, data);
	}
};

widget.directive('mustache', function(instance, target, attr){
	if(target[':mustache']) return ;
	let [key, tpl_id=false] =attr.value.split(':');
	let html='';
	if(tpl_id){
		let tpl =instance.el.querySelector(tpl_id);
		if(!tpl) throw "错误的模板文件，无法获取模板";
		html =tpl.innerHTML;
	} else html =target.innerHTML;

	let render =makeRender(target, html);
	render(instance[key]);
	instance.event('data:'+key, (e, value)=>{
		render(value);
	});
	target[':mustache'] =true;
});

export default widget;