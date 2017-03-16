/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../scripts/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * 兼容设置
 */
if (!window.Symbol) {
	window.Symbol = v => v;
}
if (!Object.assign) {
	Object.assign = function (target, ...from) {
		from.forEach(o => {
			if (typeof o == 'object') {
				for (let i in o) {
					target[i] = o[i];
				}
			}
		});
		return target;
	};
}

const hasProxy = !!window.Proxy;
const isString = v => v.constructor.name ? v.constructor.name === 'String' : typeof v === 'string';

const clear = true;
/**
 * 常量属性设置
 */
const _id_ = Symbol('id');
const _proxy_ = Symbol('proxy');
const _colon_ = Symbol('colon');
const _tags_ = Symbol('tags');
const _event_ = Symbol('event');
const _calc_ = Symbol('calc');
/**
 * 组件命名空间
 */
const nsid = {};
const getNSID = () => {
	let id = new Date().getTime() + ':' + Math.round(Math.random() * 10000);
	return nsid[id] ? getNSID() : id;
};
/**
 * 组件属性读写代理
 * @type {{get: proxy_widget.get, set: proxy_widget.set}}
 */
const proxy_widget = {
	get: function (target, property /*, receiver*/) {
		if (target[_calc_] && target[_calc_][property]) {
			return target[_calc_][property]();
		}
		return target[property];
	},
	set: function (target, property, value /*, receiver*/) {
		return target.set(property, value);
	}
};
/**
 * 组件工厂
 * @param prototype
 * @returns {create}
 */
const widget = function (prototype) {
	/**
  * 生成组件
  * @param setup
  * @returns {{el:dom, set:function, fire:function, event:function}}
  */
	let create = function (setup) {
		let pt = Object.assign({}, prototype, setup);
		let _id = getNSID(),
		    instance = clear ? { [_id_]: _id } : Object.assign({ [_id_]: _id }, pt);
		nsid[_id] = instance;
		instance.eventName = event => _id + ':' + event;
		instance[_proxy_] = hasProxy ? new Proxy(instance, proxy_widget) : instance;

		if (pt.el) {
			if (isString(pt.el)) {
				instance.el = document.querySelector(pt.el);
				if (!instance.el) throw new Error('没有找到根元素，请确认');
			} else instance.el = pt.el;
			delete pt.el;
		} else instance.el = document.createElement('div');

		instance.el.widget = hasProxy ? instance[_proxy_] : instance;
		instance.set = (property, value) => {
			let ov = instance[property];
			instance[property] = value;
			instance.fire('data:' + property, value, ov); //触发属性修改事件
			instance.fire('data', property, value, ov); //触发所有属性修改事件
			return true;
		};

		instance[_event_] = {};
		instance.fire = (name, ...data) => {
			if (!isString(name) && name[_event_]) {
				//事件已经发生，仅仅做转义处理
				if (instance[_event_][name[_event_]]) instance[_event_][name[_event_]](name.e, ...data);
			} else {
				//不存在此事件，需要产生一个新的事件用来冒泡
				instance.el.dispatchEvent(new CustomEvent(instance.eventName(name), {
					bubbles: true,
					cancelable: true,
					detail: data
				}));
			}
		};
		instance.event = (name, fun, options = false) => {
			let [, selector = false] = name.split('|');
			instance[_event_][name] = fun.bind(hasProxy ? instance[_proxy_] : instance);

			if (name == 'init') options = { once: true };
			let make = (dom, selector, fn) => {
				return function (e) {
					if (selector) {
						let filter = false;
						dom.querySelectorAll(selector).forEach(d => {
							if (d == e.target) filter = true;
						});
						if (!filter) return false;
					}
					fn(e, ...Array.from(e.detail));
				};
			};
			instance.el.addEventListener(instance.eventName(name), make(instance.el, selector, instance[_event_][name]), options);
		};
		if (pt.event) {
			//todo event, method, data 格式化写作
			if (typeof pt.event === 'function') pt.event = pt.event();
			if (typeof pt.event !== 'object') throw new Error('事件格式不正确，请确认event为对象或返回为对象');
			for (let e in pt.event) {
				instance.event(e, pt.event[e]);
			}
			delete pt.event;
		}

		if (clear) {
			instance = Object.assign(instance, pt);
			delete instance.template;
			delete instance.style;
			delete instance.tag;
		}

		if (pt.calc) {
			if (typeof pt.calc !== 'object') throw new Error('计算属性设置格式不正确，请确认calc为对象');
			instance[_calc_] = {};
			for (let c in pt.calc) {
				instance[_calc_][c] = pt.calc[c].bind(hasProxy ? instance[_proxy_] : instance);
				instance[c] = instance[_calc_][c]();
			}
		}

		if (widget.$) {
			//兼容
			instance.$el = widget.$(instance.el);
			instance.$ = sel => widget.$(sel, instance.el);
		}

		//绑定x-tag事件和数据
		let checkXTag = el => {
			if (el && el.tagName && !el.widget) {
				let name = el.tagName.toLowerCase();
				widget[_tags_][name] && new widget[_tags_][name](Object.assign({ el: el }, getAttr(el)));
			}
		};
		let update = el => {
			checkXTag(el);
			if (el && el.attributes) {
				for (let de in widget[_colon_]) {
					if (el.attributes[':' + de] && !el[':' + de]) {
						//如果存在 :bind :if 之类的属性名 并且没有设置过
						el[':' + de] = true; //防止再次生成
						widget[_colon_][de](hasProxy ? instance[_proxy_] : instance, el, el.attributes[':' + de], instance);
					}
				}
			}
			if (!el.widget && el.children) {
				for (let i = 0; i < el.children.length; i++) {
					update(el.children[i]);
				}
			}
		};
		instance.el.addEventListener('DOMNodeInserted', function () {
			return e => {
				update(e.target);
				e.stopPropagation();
			};
		}(), false);

		if (pt.template) {
			let html = pt.template;
			if (typeof pt.template === 'function') html = pt.template(instance);
			instance.el.innerHTML = html;
		}

		if (pt.style) {
			let style = document.createElement('style');
			style.innerHTML = pt.style;
			style.setAttribute('scoped', true);
			instance.el.appendChild(style);
		}
		instance.fire('init');
		//E(instance.el).one(instance.eventName('init'));
		instance.fire('render');

		return hasProxy ? instance[_proxy_] : instance;
	};
	if (prototype['tag']) widget[_tags_][prototype['tag']] = create;
	return create;
};

//---------------------------------------------------------------------------------------------------------------- x-tag

widget[_tags_] = {};
widget.tag = function (name, callback) {
	widget[_tags_][name] = callback;
};
/**
 * 整理属性列表
 * @param attrs
 * @returns {{}}
 */
let value = v => {
	if (v) {
		switch (v.toLowerCase()) {
			case 'true':
				return true;
			case 'false':
				return false;
		}
		if (/^[-]?([1-9]{1,}[0-9]+|[0-9])$/.test(v)) return parseInt(v);
	}
	return v;
};
let getAttr = el => {
	if (el.hasAttributes()) {
		let m = {};
		let attrs = el.attributes;
		for (let i = 0; i < attrs.length; i++) {
			let v = attrs[i].value;
			if (v.substr(0, 1) !== ':') m[attrs[i].name] = v ? value(v) : attrs[i].name;
		}
		return m;
	} else return {};
};
document.addEventListener('DOMNodeInserted', function (e) {
	e.stopPropagation();
	if (e.target && e.target.tagName && !e.target.widget) {
		let name = e.target.tagName.toLowerCase();
		widget[_tags_][name] && new widget[_tags_][name](Object.assign({ el: e.target }, getAttr(e.target)));
	}
});
/**
 * 渲染标签，需主动调用
 */
widget.tagRender = function () {
	for (let tag in widget[_tags_]) {
		let dom = document.querySelectorAll(tag);
		if (!dom || dom.length == 0) continue;
		dom.forEach(function () {
			new widget[_tags_][name](Object.assign({ el: this }, getAttr(this)));
		});
	}
};

//------------------------------------------------------------------------------------------------------------ colon

widget[_colon_] = {};
widget.colon = function (name, callback) {
	widget[_colon_][name] = callback;
};

/**
 * 绑定事件 绑定 click 事件，c 捕获 o 一次 p 不调用pD，eventName 为转义事件名，后面的都是参数
 *  :on="click/cop:eventname:args:args2...|mousedown:eventName2"
 */
widget.colon('on', function (instance, target, attr) {
	attr.value.split('|').forEach(es => {
		let [type, event = false, ...data] = es.split(':');
		if (event === false) {
			event = type;
			type = 'click';
		}
		let options = {};
		let sP = false,
		    pD = true;
		if (type.indexOf('/') > -1) {
			let [type_change, sets] = type.split('/');
			type = type_change;
			if (sets.indexOf('c') > -1) options['capture'] = true;
			if (sets.indexOf('o') > -1) options['once'] = true;
			if (sets.indexOf('p') > -1) options['passive'] = true;
			if (sets.indexOf('s') > -1) sP = true;
			if (sets.indexOf('d') > -1) pD = false;
		}
		if (target.widget) {
			target.widget.event(type, (e, ...data2) => {
				if (pD) e.preventDefault();
				if (sP) e.stopPropagation();
				if (event) {
					let ne = { e };
					ne[_event_] = event;
					instance.fire(ne, ...data.concat(data2));
				}
			}, options);
		} else {
			target.addEventListener(type, (e, ...data2) => {
				//todo 拦截 or 冒泡
				if (pD) e.preventDefault();
				if (sP) e.stopPropagation();
				if (event) {
					let ne = { e };
					ne[_event_] = event;
					instance.fire(ne, ...data.concat(data2));
				}
			}, false);
		}
	});
});

widget.colon('bind', function (instance, target, attr) {
	attr.value.split('|').forEach(es => {
		let d = false;
		let [prop, key = false] = es.split(':');

		if (target.widget) {
			//绑定的是一个组件根
			if (!key) key = prop;
			instance.event('data:' + key, (e, value) => {
				if (!d) {
					d = true; //防止循环触发
					target.widget.set(key, value);
					//target.widget[key] =value;
					d = false;
				}
			});
			target.widget.parentWidget = instance;
			target.widget.event('data:' + prop, (e, value) => {
				if (!d) {
					d = true; //防止循环触发
					instance.set(prop, value);
					//instance[prop] =value;
					d = false;
				}
			});
			target.widget.set(prop, key);
		} else {
			if (!key) {
				key = prop;
				prop = 'innerHTML';
			}
			switch (prop) {//fix
				case 'html':
					prop = 'innerHTML';
					break;
				case 'val':
					prop = 'value';
					break;
			}
			target['_' + prop] = instance[key];
			target[prop] = instance[key];
			instance.event('data:' + key, (e, value) => {
				if (target['_' + prop] != value) {
					target['_' + prop] = value;
					target[prop] = value;
				}
			});
			switch (target.nodeName) {
				case 'INPUT':
				case 'TEXTAREA':
					let change = () => {
						if (target['_' + prop] != target[prop]) {
							target['_' + prop] = target[prop];
							instance.set(key, target[prop]);
							//instance[key] =target[prop];
						}
					};
					target.addEventListener("change", change);
					target.addEventListener("input", change);
					target.addEventListener("keyup", change);
					target.addEventListener("mouseup", change);
					break;
				default:
				//取消html编辑双向绑定，有变量类型问题
				//target.addEventListener("DOMCharacterDataModified", (de)=>{//any => string, string !!!
				//	if(target[prop] !=de.prevValue){
				//		target['_'+prop] =de.prevValue;
				//		instance[key] =de.prevValue;
				//	}
				//});
			}
		}
	});
});

let _not_ = value => !value;
let _yes_ = value => !!value;

widget.colon('if', function (instance, target, attr) {
	let _do = attr.value[0] === '!' ? _not_ : _yes_;
	let key = attr.value[0] === '!' ? attr.value.substr(1) : attr.value;
	let _toggle = function (bool = null) {
		target.style.display = bool === null ? target.style.display == 'none' ? '' : 'none' : _do(bool) ? '' : 'none';
	};
	_toggle(instance[key]);
	instance.event('data:' + key, (e, value) => _toggle(value));
});

widget.colon('for', function (instance, target, attr) {
	let [key, tpl_id = false] = attr.value.split(':');
	let html = tpl_id && document.querySelector(tpl_id) ? document.querySelector(tpl_id).innerHTML : target.innerHTML;
	if (html == null || !isString(html)) {
		throw "错误的模板文件，无法获取模板";
	}
	let tpl = widget.template(html);
	let render = function (data) {
		target.innerHTML = '';
		if (['number', 'undefined', 'boolean', 'string'].indexOf(typeof data) == -1) {
			for (let idx in data) {
				target.innerHTML += tpl(data[idx]);
			}
		}
	};
	render(instance[key]);
	instance.event('data:' + key, (e, value) => render(value));
});

widget.colon('class', function (instance, target, attr) {
	attr.value.split('|').forEach(es => {
		let [prop, style = false] = es.split(':');
		let _do = prop[0] === '!' ? _not_ : _yes_;
		let key = prop[0] === '!' ? prop.substr(1) : prop;
		let toggleClass = (bool = null) => {
			let cls = style === false ? instance[key] : style;
			cls.split(' ').forEach(c => {
				if (c.length > 0) target.classList.toggle(c, _do(bool));
			});
		};
		toggleClass(instance[key]);
		instance.event('data:' + key, (e, value) => toggleClass(value));
	});
});

widget.template = function (htmlString) {
	let t = htmlString.trim();
	t = t.replace(/\{\{#([^\}\{]+)\}\}(.*)\{\{\/\1\}\}/g, '${item["$1"]?`$2`:""}');
	t = t.replace(/\{\{\^([^\}\{]+)\}\}(.*)\{\{\/\1\}\}/g, '${item["$1"]?"":`$2`}');
	t = t.replace(/\{\{([^\}\{]+)\}\}/g, '${item["$1"]}');
	return eval.call(null, '(item)=>`' + t + '`');
};

/* harmony default export */ exports["a"] = widget;

/***/ },

/***/ 23:
/***/ function(module, exports) {

module.exports = "\r\n<h3>单向绑定</h3>\r\n<div>\r\n\t<input type=\"text\" :bind=\"value:span\">\r\n\t<span :bind=\"html:span\"></span>\r\n</div>\r\n\r\n<h3>双向绑定</h3>\r\n<div>\r\n\t<input type=\"text\" :bind=\"value:input\">\r\n\t<input type=\"text\" :bind=\"value:input\">\r\n</div>\r\n\r\n<h3>计算属性</h3>\r\n<div>\r\n\t<input type=\"text\" :bind=\"value:a\">\r\n\t<input type=\"text\" :bind=\"value:b\">\r\n\t<span id=\"computed\"></span>\r\n</div>\r\n"

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bind_index__ = __webpack_require__(6);



new __WEBPACK_IMPORTED_MODULE_0__bind_index__["a" /* default */]({ el: 'body' });

/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_widget__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_html__);
/**
 * Created by Vea on 16/12/13 013.
 */




/* harmony default export */ exports["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_widget__["a" /* default */])({
	template: __WEBPACK_IMPORTED_MODULE_1__template_html___default.a,
	span: 's',
	input: 'd',
	a: 0,
	b: 0,
	event: {
		init: function () {
			'use strict';

			this.span = '123';

			let c = this.el.querySelector('#computed');
			setInterval(() => {
				c.innerHTML = this.c;
			}, 300);
		},
		getC: function (e) {
			e.target.innerHTML = this.c;
		}
	},
	calc: {
		c: function () {
			return parseInt(this.a) + parseInt(this.b);
		}
	}
});

/***/ }

/******/ });