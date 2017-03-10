/**
 * Created by Vea on 2017/03/07 007.
 */

export default function popup(dom, {
	CLASS_MASK="aui-mask",
	CLASS_MASK_IN='aui-mask-in',
	CLASS_MASK_OUT='aui-mask-out',
	CLASS_POPUP_IN='aui-popup-in',
	CLASS_POPUP_OUT='aui-popup-out'
}={}){
	var popupStatus=false;
	dom.addEventListener("touchmove", (event)=>{
		event.preventDefault();
	}, false)
	return {
		click:function(){
			if(dom.classList.contains(CLASS_POPUP_IN)){
				this.hide(dom);
			}else{
				this.show(dom);
			}
		},
		clear:function(){
			dom.style.display="none";
			dom.classList.remove(CLASS_POPUP_OUT);
			dom._mask.style.display="none";
			//popupStatus=false;
		},
		show:function(){
			//if(dom.classList.contains(CLASS_POPUP_IN)) return this.hide();
			//if(popupStatus) return;
			if(!dom._mask){
				dom._mask=document.createElement('div');
				dom._mask.classList.add(CLASS_MASK);
				dom._mask.addEventListener("touchstart", (event)=>{
					event.preventDefault();
					this.hide();
				});
				document.body.insertAdjacentElement('beforeend', dom._mask);
			}
			dom.style.display="block";
			dom._mask.style.display="block";
			setTimeout(function(){
				dom.classList.add(CLASS_POPUP_IN);
				dom._mask.classList.add(CLASS_MASK_IN);
			}, 10);
		},
		hide:function(){
			dom.classList.remove(CLASS_POPUP_IN);
			dom.classList.add(CLASS_POPUP_OUT);
			dom._mask.classList.remove(CLASS_MASK_IN);
			dom._mask.classList.add(CLASS_MASK_OUT);
			setTimeout(function(){
				dom.style.display="none";
				dom._mask.style.display="none";
				dom.classList.remove(CLASS_POPUP_OUT);
				dom._mask.classList.remove(CLASS_MASK_OUT);
			}, 300)
		}
	}
}
