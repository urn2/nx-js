

function userAgent(){
	this.string =navigator.userAgent;
	this.lower =this.string.toLowerCase();
	this._is ={
		weixin:this.lower.indexOf('micromessenger') >-1,
		weibo:this.lower.indexOf('weibo') >-1,
		qq:this.lower.indexOf('qq') >-1,
	};
};
userAgent.prototype.toString=function(){
	return this.string;
};
userAgent.prototype.is=function(name){
	return name in this._is ?this._is[name] :null;
};

export default new userAgent();

