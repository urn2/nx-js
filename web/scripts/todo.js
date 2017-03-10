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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = event;

let events = {};

const makeFn = (dom, type, selector, fn) => {
	if (typeof fn === 'undefined' && typeof selector === 'function') {
		fn = selector;
		selector = false;
	}
	if (!events[dom]) events[dom] = {};
	if (!events[dom][type]) events[dom][type] = {};
	if (!events[dom][type][selector]) events[dom][type][selector] = {};
	if (!events[dom][type][selector][fn]) events[dom][type][selector][fn] = {};
	return events[dom][type][selector][fn] = function (e) {
		if (selector) {
			let filter = false;
			dom.querySelectorAll(selector).forEach(d => {
				if (d == e.target) filter = true;
			});
			if (!filter) return false;
		}
		fn(e, ...Array.from(e.detail));
		if (e.__is_one) {
			dom.removeEventListener(type, removeFn(dom, type, selector, fn), false);
		}
	};
};
const removeFn = (dom, type, selector, fn) => {
	if (typeof fn === 'undefined' && typeof selector === 'function') {
		fn = selector;
		selector = false;
	}
	if (events[dom] && events[dom][type] && events[dom][type][selector] && events[dom][type][selector] && events[dom][type][selector][fn]) {
		let ccc = events[dom][type][selector][fn];
		if (ccc) delete events[dom][type][selector][fn];
		return ccc;
	} else return false;
};

function event(dom) {
	return {
		on(type, selector, fn) {
			dom.addEventListener(type, makeFn(dom, type, selector, fn), false);
		},
		off(type, selector, fn) {
			return dom.removeEventListener(type, removeFn(dom, type, selector, fn), false);
		},
		trigger(type, ...detail) {
			dom.dispatchEvent(new CustomEvent(type, { bubbles: true, cancelable: true, detail }));
		},
		one(type, ...detail) {
			let e = new CustomEvent(type, { bubbles: true, cancelable: true, detail });
			e.__is_one = true;
			dom.dispatchEvent(e);
		}
	};
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_event__ = __webpack_require__(0);



let isDOM = value => value.constructor.name === 'dom';

class dom extends Array {
	constructor(selector = {}, parent = document) {
		switch (selector.constructor.name) {
			case "String":
				super(...parent.querySelectorAll(selector));
				break;
			case "Array":
			case "Set":
				super(...selector);
				break;
			default:
				if (selector.constructor.name.substr(0, 4) === 'HTML') super(selector);else super();
		}
		return this;
	}
	find(selector = '*') {
		return this.length > 0 ? new dom([...this[0].querySelectorAll(selector)]) : new dom();
	}
	attr(name, value) {
		if (arguments.length == 0) {
			return this.length > 0 ? this[0].getAttribute(name) : null;
		}
	}
	val(value) {
		if (arguments.length == 0) {
			return this.length > 0 ? this[0].value : null;
		} else {
			this.forEach(el => el.value = value);
			return this;
		}
	}

	addClass(className) {
		this.forEach(el => el.classList.add(className));
		return this;
	}
	removeClass(className) {
		this.forEach(el => el.classList.remove(className));
		return this;
	}
	toggleClass(className) {
		if (arguments.length > 0) {
			this.forEach(el => el.classList.toggle(className));
		}
		return this;
	}
	hasClass(className) {
		if (this.length < 1) return false;
		return this[0].classList.contains(className);
	}
	_stylevalue(type, value) {
		if (arguments.length > 1) {
			if (this.length > 0) this[0].style[type] = value + 'px';
			return this;
		}
		if (this.length < 1) return 0;
		return this[0].style[type];
	}
	top(val) {
		return this._stylevalue('top', val);
	}
	left(val) {
		return this._stylevalue('left', val);
	}
	height(val) {
		return this._stylevalue('height', val);
	}
	width(val) {
		return this._stylevalue('width', val);
	}
	outerHeight(withMargin = false) {
		if (this.length < 1) return 0;
		if (!withMargin) return this[0].offsetHeight;else {
			let height = this[0].offsetHeight;
			let style = getComputedStyle(this[0]);

			return height + parseInt(style.marginTop) + parseInt(style.marginBottom);
		}
	}
	outerWidth(withMargin = false) {
		if (this.length < 1) return 0;
		if (!withMargin) return this[0].offsetWidth;else {
			let width = this[0].offsetWidth;
			let style = getComputedStyle(this[0]);
			return width + parseInt(style.marginLeft) + parseInt(style.marginRight);
		}
	}
	position() {
		if (this.length < 1) return { left: 0, top: 0 };
		return { left: this[0].offsetLeft, top: this[0].offsetTop };
	}
	data(name, value) {
		if (arguments.length == 0) {
			return this.length < 1 ? {} : this[0].dataset;
		} else {
			if (arguments.length > 1) {
				this.forEach(el => el.dataset[name] = value);
				return this;
			} else return this.length < 1 ? null : this[0].dataset[name];
		}
	}

	append(htmlString) {
		let is_str = typeof htmlString == 'string';
		this.forEach(el => {
			if (is_str) {
				el.innerHTML = el.innerHTML + htmlString;
			} else {
				if (isDOM(htmlString)) el.appendChild(htmlString[0]);else el.appendChild(htmlString);
			}
		});
		return this;
	}
	appendTo() {}
	html(htmlString) {
		if (arguments.length == 0) {
			return this.length > 0 ? this[0].innerHTML : null;
		} else {
			this.forEach(el => el.innerHTML = htmlString);
			return this;
		}
	}
	text(htmlString) {
		if (arguments.length == 0) {
			return this.length > 0 ? this[0].innerText : null;
		} else {
			this.forEach(el => el.innerText = htmlString);
			return this;
		}
	}
	after(htmlString) {
		this.forEach(el => el.insertAdjacentHTML('afterend', htmlString));
		return this;
	}
	before(htmlString) {
		this.forEach(el => el.insertAdjacentHTML('beforebegin', htmlString));
		return this;
	}
	children() {
		return new dom(this[0] ? this[0].children : []);
	}
	insertAfter() {}
	insertBefore() {}
	remove() {
		this.forEach(el => el.parentNode.removeChild(el));
	}
	next() {
		if (this.length > 0) return new dom(el.nextElementSibling);
		return new dom();
	}
	prev() {
		if (this.length > 0) return new dom(this[0].previousElementSibling);
		return new dom();
	}
	parent() {
		return this.length > 0 ? new dom(this[0].parentNode) : new dom();
	}
	parents() {}
	siblings() {
		return this.length > 0 ? new dom(Array.prototype.filter.call(this[0].parentNode.children, child => child !== this[0])) : new dom();
	}
	on(type, selector, data, fn) {
		this.forEach(el => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event__["a" /* default */])(el).on(type, selector, data, fn));
		return this;
	}
	off(type, selector, data, fn) {
		this.forEach(el => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event__["a" /* default */])(el).off(type, selector, data, fn));
		return this;
	}
	trigger(type, ...data) {
		this.forEach(el => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event__["a" /* default */])(el).trigger(type, ...data));
		return this;
	}
	one(type, ...data) {
		this.forEach(el => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event__["a" /* default */])(el).one(type, ...data));
		return this;
	}
	hide() {
		this.forEach(el => el.style.display = 'none');
		return this;
	}
	show() {
		this.forEach(el => el.style.display = '');
		return this;
	}
	toggle(bool = null) {
		this.forEach(el => el.style.display = bool === null ? el.style.display == 'none' ? '' : 'none' : bool ? '' : 'none');
		return this;
	}
}

/* harmony default export */ exports["a"] = (selector, parent) => new dom(selector, parent);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export reset */
'use strict';
/**
 * 等待文档加载完毕
 * @param fn
 */

/* harmony default export */ exports["a"] = (fn, map = {}) => {
	if (typeof fn !== 'function') {
		map = fn;
		fn = () => {};
	}
	let match = () => {
		let hash = location.hash.substr(1);
		if (hash === '' && map['default']) map['default']();else {
			let match = false;
			for (let i in map) {
				let m = location.hash.substr(1).match(i);
				if (m && m.length > 0) {
					m.shift();
					map[i](...m);
					match = true;
				}
			}
			if (match == false && map[404]) map[404]();
		}
	};
	let done = () => {
		fn();
		match();
	};
	if (Object.keys(map).length > 0) window.addEventListener("hashchange", match, false);
	if (document.readyState != 'loading') done();else document.addEventListener('DOMContentLoaded', done);
};

var reset = () => {
	let e = new CustomEvent('hashchange', { bubbles: true, cancelable: true });
	window.dispatchEvent(e);
};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_widget_mustache__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__todo__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__template_html__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__template_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__template_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_less__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__style_less__);
/**
 * Created by Vea on 16/12/13 013.
 */






/* harmony default export */ exports["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_widget_mustache__["a" /* default */])({
	template: __WEBPACK_IMPORTED_MODULE_2__template_html___default.a,
	style: __WEBPACK_IMPORTED_MODULE_3__style_less___default.a,
	new: '',
	list: {},
	event: {
		init: function () {
			console.log('init ok');
			this.list = __WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].list();
		},
		add: function (e) {
			let id = __WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].add(this.new);
			this.list = __WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].list();
			this.new = '';
		},
		delete: function (e, id) {
			__WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].del(id);
			this.list = __WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].list();
		},
		toggle: function (e, id) {
			__WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].toggle(id);
			this.list = __WEBPACK_IMPORTED_MODULE_1__todo__["a" /* default */].list();
		}
	}

});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_event__ = __webpack_require__(0);
/**
 * Created by Vea on 16/12/9 009.
 *
 */




const _id_ = Symbol('id');
const _proxy_ = Symbol('proxy');
const _directive_ = Symbol('directive');
const _tags_ = Symbol('tags');
const _event_ = Symbol('event');

const nsid = {};
const getNSID = () => {
	let id = new Date().getTime() + ':' + Math.round(Math.random() * 10000);
	return nsid[id] ? getNSID() : id;
};

const proxy_widget = {
	get: function (target, property /*, receiver*/) {
		return target[property];
	},
	set: function (target, property, value /*, receiver*/) {
		target.fire('data:' + property, value, target[property]);
		target.fire('data', property, value, target[property]);
		target[property] = value;
		return true;
	}
};
const clear = true;
const widget = function (prototype) {
	let create = function (setup) {
		let pt = Object.assign({}, prototype, setup);
		let _id = getNSID(),
		    instance = clear ? { [_id_]: _id } : Object.assign({ [_id_]: _id }, pt);
		nsid[_id] = instance;
		instance.eventName = event => _id + ':' + event;
		instance[_proxy_] = new Proxy(instance, proxy_widget);

		let $ = widget.$ || __WEBPACK_IMPORTED_MODULE_0_dom__["a" /* default */];
		if (pt.el) {
			instance.$el = $(pt.el);
			if (instance.$el.length == 0) throw new Error('没有找到根元素，请确认');
			instance.el = instance.$el[0];
			instance.el.widget = instance[_proxy_];
			instance.$ = sel => $(sel, instance.el);
			delete pt.el;
		} else throw new Error('需要设定一个根元素，必须指定el');

		instance[_event_] = {};
		instance.fire = (name, ...data) => {
			if (name.constructor.name !== 'String' && name[_event_]) {
				//事件已经发生，仅仅做转义处理
				if (instance[_event_][name[_event_]]) instance[_event_][name[_event_]](name.e, ...data);
			} else __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_event__["a" /* default */])(instance.el).trigger(instance.eventName(name), ...data); //不存在此事件，需要产生一个新的事件用来冒泡
		};
		instance.event = (name, fun) => {
			let [, selector = false] = name.split('|');
			instance[_event_][name] = fun.bind(instance[_proxy_]);
			__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_event__["a" /* default */])(instance.el).on(instance.eventName(name), selector, instance[_event_][name]);
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
		let update = (el, andChild = true) => {
			if (el && el.attributes) {
				for (let de in widget[_directive_]) {
					if (el.attributes[':' + de]) widget[_directive_][de](instance[_proxy_], el, el.attributes[':' + de]);
				}
			}
			if (el.children) {
				for (let i = 0; i < el.children.length; i++) {
					update(el.children[i]);
				}
			}
		};
		//绑定x-tag事件和数据
		instance.el.addEventListener('DOMNodeInserted', e => {
			if (e.target.nodeName === '#text') return;
			e.stopPropagation();
			//console.log('di:', e.target, e.target.attributes, instance.el);
			if (e.target && e.target.tagName && !e.target.widget) {
				let name = e.target.tagName.toLowerCase();
				if (widget[_tags_][name]) {
					new widget[_tags_][name](Object.assign({ el: e.target }, getAttr(e.target.attributes)));
					update(e.target, false);
					return;
				}
			}
			update(e.target);
		});
		if (pt.template) {
			let html = pt.template;
			if (typeof pt.template === 'function') html = pt.template(instance);
			instance.$el.html(html);
		}
		if (pt.style) {
			let style = document.createElement('style');
			style.innerHTML = pt.style;
			style.setAttribute('scoped', true);
			instance.$el.append(style);
		}

		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_event__["a" /* default */])(instance.el).one(instance.eventName('init'));
		instance.fire('render');

		return instance[_proxy_];
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
let getAttr = attrs => {
	let m = {};
	for (let { nodeName, nodeValue } of attrs) {
		m[nodeName] = nodeValue;
	}
	return m;
};
document.addEventListener('DOMNodeInserted', function (e) {
	e.stopPropagation();
	if (e.target && e.target.tagName && !e.target.widget) {
		let name = e.target.tagName.toLowerCase();
		widget[_tags_][name] && new widget[_tags_][name](Object.assign({ el: e.target }, getAttr(e.target.attributes)));
	}
});
/**
 * 渲染标签，需主动调用
 */
widget.tagRender = function () {
	for (let tag in widget[_tags_]) {
		let $dom = $(tag);
		if ($dom.length == 0) continue;
		$dom.forEach(function () {
			new widget[_tags_][name](Object.assign({ el: this }, getAttr(this.attributes)));
		});
	}
};

//------------------------------------------------------------------------------------------------------------ directive

widget[_directive_] = {};
widget.directive = function (name, callback) {
	widget[_directive_][name] = callback;
};

let empty = e => {
	if (e.length) return e.length == 0;
	for (let i in e) {
		return false;
	}
	return true;
};

/**
 * 绑定事件 绑定 click 事件，c 捕获 o 一次 p 不调用pD，eventName 为转义事件名，后面的都是参数
 *  :on="click/cop:eventname:args:args2...|mousedown:eventName2"
 */
widget.directive('on', function (instance, target, attr) {
	if (target[':on']) return;
	attr.value.split('|').forEach(es => {
		let [type, event, ...data] = es.split(':');
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
		target.addEventListener(type, (e, ...data2) => {
			//todo 拦截 or 冒泡
			if (pD) e.preventDefault();
			if (sP) e.stopPropagation();
			if (event) {
				let ne = { e };
				ne[_event_] = event;
				instance.fire(ne, ...data.concat(data2));
			}
		}, options);
	});
	target[':on'] = true;
});

widget.directive('bind', function (instance, target, attr) {
	if (target[':bind']) return;
	let d = false;
	let [prop, key = false] = attr.value.split(':');
	if (!key) {
		key = prop;
		prop = 'innerHTML';
	}
	let n = 0;

	if (target.widget) {
		//绑定的是一个组件根 todo:双向绑定fix 1->2 now: 1->2,2->1
		instance.event('data:' + key, (e, value, oldValue) => {
			if (!d) {
				d = true; //防止循环触发
				target.widget[key] = value;
				d = false;
			}
		});
		target.widget.event('data:' + key, (e, value, oldValue) => {
			if (!d) {
				d = true; //防止循环触发
				instance[key] = value;
				d = false;
			}
		});
	} else {
		switch (prop) {//fix
			case 'html':
				prop = 'innerHTML';
				break;
			case 'val':
				prop = 'value';
				break;
		}
		instance[key] = target[prop];
		instance.event('data:' + key, (e, value, oldValue) => {
			if (!d && value !== oldValue) {
				d = true;
				target[prop] = value;
				d = false;
			}
		});
		switch (target.nodeName) {
			case 'INPUT':
			case 'TEXTAREA':
				target.addEventListener("change", () => {
					if (!d) {
						d = true;
						instance[key] = target[prop];
						d = false;
					}
				});
				break;
			default:
				target.addEventListener("DOMCharacterDataModified", de => {
					if (!d && de.newValue !== de.prevValue) {
						d = true;
						instance[key] = de.newValue;
						d = false;
					}
				});
		}
	}
	target[':bind'] = true;
});

widget.directive('if', function (instance, target, attr) {
	if (target[':if']) return;
	let key = attr.value;
	let show = instance[key];
	let $ = widget.$ || __WEBPACK_IMPORTED_MODULE_0_dom__["a" /* default */];
	let $target = $(target);

	$target.toggle(show);

	instance.event('data:' + key, (e, value) => $target.toggle(value));
	target[':if'] = true;
});

widget.directive('for', function (instance, target, attr) {
	if (target[':for']) return;
	let [key, tpl_id = false] = attr.value.split(':');
	let $ = widget.$ || __WEBPACK_IMPORTED_MODULE_0_dom__["a" /* default */];
	let $target = $(target);
	let html = tpl_id && document.querySelector(tpl_id) ? document.querySelector(tpl_id).innerHTML : target.innerHTML;
	if (html == null || html.constructor.name !== 'String') {
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
	target[':for'] = true;
});

widget.template = function (htmlString) {
	let t = htmlString;
	t = t.replace(/\{\{#([^\}\{]+)\}\}(.*)\{\{\/\1\}\}/g, '${item["$1"] && "$2"}');
	t = t.replace(/\{\{\^([^\}\{]+)\}\}(.*)\{\{\/\1\}\}/g, '${!item["$1"] && "$2"}');
	t = t.replace(/\{\{([^\}\{]+)\}\}/g, '${item["$1"]}');
	return eval.call(null, '(item)=>`' + t + '`');
};

/* harmony default export */ exports["a"] = widget;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_event__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__widget__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mustache__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mustache___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_mustache__);






const makeRender = function ($el, str) {
	__WEBPACK_IMPORTED_MODULE_3_mustache___default.a.parse(str);
	return function (data) {
		$el.html(__WEBPACK_IMPORTED_MODULE_3_mustache___default.a.render(str, data));
	};
};

__WEBPACK_IMPORTED_MODULE_2__widget__["a" /* default */].directive('mustache', function (instance, target, attr) {
	if (target[':mustache']) return;
	let [key, tpl_id = false] = attr.value.split(':');
	let $ = __WEBPACK_IMPORTED_MODULE_2__widget__["a" /* default */].$ || __WEBPACK_IMPORTED_MODULE_0_dom__["a" /* default */];
	let $target = $(target);

	let html = tpl_id ? $(tpl_id).html() : $target.html();
	if (html == null || html.constructor.name !== 'String') {
		throw "错误的模板文件，无法获取模板";
	}
	let render = makeRender($target, html);
	$target.html('');
	instance.event('data:' + key, (e, value) => {
		render(value);
	});
	target[':mustache'] = true;
});

/* harmony default export */ exports["a"] = __WEBPACK_IMPORTED_MODULE_2__widget__["a" /* default */];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Vea on 16/12/14 014.
 */
'use strict';

let todo = function () {
	let list = JSON.parse(localStorage['todo'] ? localStorage['todo'] : '{}');

	function save() {
		localStorage['todo'] = JSON.stringify(list);
		return true;
	}

	return {
		add(text) {
			let id = new Date().getTime();
			list[id] = {
				id: id,
				text: text,
				done: false
			};
			save();
			return id;
		},
		toggle(id) {
			list[id]['done'] = !list[id]['done'];
			save();
		},
		del(id) {
			delete list[id];
			save();
		},
		list() {
			return list;
		}
	};
}();

/* harmony default export */ exports["a"] = todo;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, ".done {\n  text-decoration: line-through;\n}\n", ""]);

// exports


/***/ },
/* 8 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));


/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = "\r\n\r\n<div class=\"list\" :for=\"list\">\r\n\t<div class=\"todo\">\r\n\t\t<a href=\"#\" class=\"delete\" :on=\"click:delete:{{id}}\">删除</a>\r\n\t\t<span class=\"{{#done}}done{{/done}}\" :on=\"click:toggle:{{id}}\">{{text}}</span>\r\n\t</div>\r\n</div>\r\n<div class=\"options\">\r\n\t<input type=\"text\" :bind=\"value:new\">\r\n\t<button :on=\"click:add\">添加</button>\r\n</div>"

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ready__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(3);
'use strict';




__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ready__["a" /* default */])(() => {
	console.log('ready ok');
	new __WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */]({ el: 'body' });
});

/***/ }
/******/ ]);