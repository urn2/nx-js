
import widget from '../common/widget';
import pages from './pages';
import Mustache from 'mustache';
let template =require('./table.html');
let tpl =function(data){
	return Mustache.render(template, data);
};
let status ={};

export default widget({
	tag:'ui-tab',
	event:{
		init:function(){
			let tpl_data ={layout:true};
			if(this.title) tpl_data['title'] =this.title;

			if(this.columns && typeof this.columns =='object'){
				tpl_data['columns'] =[];
				this.col_keys=[];
				for(let i in this.columns){
					this.col_keys.push(i);
					tpl_data['columns'].push(this.columns[i]);
				}
				tpl_data['columns_length'] =tpl_data['columns'].length;
			}
			this.el.innerHTML =tpl(tpl_data);

			this.data =this.data ||'data';

			this.page =this.page || 1;
			this.max =this.max || 10;

			this.pages =false;
			this.body =this.el.querySelector('tbody');
			if(this.initData) this.render();
		},
		page:function(e, page, D){
			this.page =page;
			this.getData(D);
		}
	},
	getData(D){
		if(status.list) return ;
		status.list =true;
		if(this.api) this.api(this.page, this.max).then((data)=>{
			let tpl_data ={data:true};
			if(!data[this.data]) D.reject('uiTable 不存在的数据字段');

			tpl_data['columns'] =[];
			data[this.data].forEach((row)=>{
				let cols =[];
				this.col_keys.forEach((key)=>{
					cols.push(row[key] || '');
				});
				tpl_data['columns'].push({id:row[this.id] || '', column:cols});
			});

			this.body.html(tpl(tpl_data));
			this.pages.render({cur:this.page, max:this.max, count:data.count});
			if(D) D.resolve();
		}).then(()=>status.list =false).catch(()=>status.list =false);
	},
	update(setting={}){
		Object.assign(this, setting);
		this.render();
	},
	render(){
		this.getData();
	}
});
