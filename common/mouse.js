'use strict';

//https://news.qooxdoo.org/mouse-capturing-f73937210c40#.716agwuz0
export function capture(element, {down=false, move=false, up=false}={}){
	let dragging = null;
	if(down.constructor.name !=='Function') down=()=>{};
	if(move.constructor.name !=='Function') move=()=>{};
	if(up.constructor.name !=='Function') up=()=>{};

	let epy =element.parentNode.offsetTop;
	let epx =element.parentNode.offsetLeft;
	let bC =false;
	element.addEventListener("mousedown", function(e) {
		e = window.event || e;
		if(e.buttons & 1){
			dragging={
				x:e.clientX+element.scrollLeft-epx,
				y:e.clientY+element.scrollTop-epy,
			};
			bC=true;
			down(dragging);
			if(element.setCapture) element.setCapture();
		} else bC=false;
	});
	element.addEventListener("losecapture", function() {
		if(bC){
			up(dragging);
			dragging=null;
			bC = false;
		}
	});
	document.addEventListener("mouseup", function() {
		if(bC){
			up(dragging);
			dragging=null;
			bC = false;
		}
	}, true);
	var dragTarget = element.setCapture ? element : document;
	dragTarget.addEventListener("mousemove", function(e) {
		if (!dragging) return;
		if(bC){
			e=window.event || e;
			dragging.x2=e.clientX+element.scrollLeft-epx;
			dragging.y2=e.clientY+element.scrollTop-epy;
			move(dragging)
		}
	}, true);
};

export const cross =(rect1,  rect2)=>{
	let oax =rect1[0]*2 +rect1[2], oay=rect1[1]*2+rect1[3];
	let obx =rect2[0]*2 +rect2[2], oby=rect2[1]*2+rect2[3];
	return Math.abs(oax -obx)<rect1[2]+rect2[2] && Math.abs(oay -oby)<rect1[3]+rect2[3];
};
export const cross2 =(rect1,  rect2)=>{
	let ax =Math.max(rect1[0], rect2[0]), ay =Math.max(rect1[1], rect2[1]);
	let bx =Math.min(rect1[0]+rect1[2], rect2[0]+rect2[2]), by =Math.min(rect1[1]+rect1[3], rect2[1]+rect2[3]);
	return ax <bx && ay<by;
};