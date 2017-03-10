'use strict';

/**
 * 浏览器弹窗
 * @param title
 * @param content
 * @param setting
 * @returns {*}
 */
const notify=function(title="", content="", ...setting){
	if(!("Notification" in window)) return;
	//if(!("Notification" in window)) throw new Error('您的浏览器不支持桌面提示，请升级或更换下？');
	if (Notification.permission === "granted") {
		setting.body =content;
		return new Notification(title, setting);
	}
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function(permission) {
			if (!('permission' in Notification)) Notification.permission = permission;
			if (permission === "granted") notify(title, content, ...setting);
		});
	}
};
export default notify;