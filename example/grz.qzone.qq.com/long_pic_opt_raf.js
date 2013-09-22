QZONE.longPicOPT = {
    imageList:[],
    init:function(){
		/*if(!ua.chrome){
			return;
		}*/
        QZONE.longPicOPT.doit();
		QZONE.qzEvent.addEventListener("QZ_IC_CHANGE_FEEDS",function(evtObj,dataObj){
			 QZONE.longPicOPT.doit();
		});
		QZONE.qzEvent.addEventListener("QZ_SCROLL",function(evtObj,dataObj){
			 QZONE.longPicOPT.doit();
		});
    },
	doit:function(){
		 setTimeout(
            function(){
                QZONE.longPicOPT.fix(document.body);
            },1000
        );
	},
    fix:function(con){
        var p = QZONE.longPicOPT,image,img;

		var btns = con.getElementsByTagName("i");

		for(var i=0,len=btns.length;i<len;i++){
			if((btns[i].className=="ui-ico ico-long-pic")||(btns[i].className=="ico-long-pic")){
				img = btns[i].parentNode.getElementsByTagName("img")[0];
				if(img.getAttribute("hasBindedEvent")){//防止事件被多次绑定
					continue;
				}
				//img.width = 400;
				//img.style.width = "400px";
				(function(_img){
					//_img.style.position = "relative";
					_img.style.cssText +="position:relative;";

					QZFL.event.addEvent(btns[i].parentNode,"mouseover",function(){
						console.log("requestAnimationFrame");
						requestAnimationFrame(moveImg);
					});

					QZFL.event.addEvent(btns[i].parentNode,"mouseout",function(){
						console.log("cancelAnimationFrame");
						cancelAnimationFrame(moveImg);
					});	

					QZFL.event.addEvent(btns[i].parentNode,"mousemove",function(){
						var evt = QZFL.event.getEvent(),st = QZFL.dom.getScrollTop();	
						//console.log(" event.x:"+ evt.clientX+ " event.y:"+ (evt.clientY +st));
						var imgPosition = QZFL.dom.getPosition(_img.parentNode);
						//console.log(" imgPosition.x:"+ imgPosition.left + " imgPosition.y:"+ imgPosition.top);
						var offset = imgPosition.top+300-(evt.clientY +st);
						//console.log(offset);
						/*if(window.abcde){
							return;
						}
						window.abcde = 1;
						*/
						var isFirst = _img.getAttribute("isFirstTouch");
						if(offset<150){
							_img.setAttribute("isFirstTouch",1);
							moveDown();
						}else if(offset>=150){
							if(!isFirst){//第一次触碰到顶部也触发向下滚的逻辑
								moveDown();
							}else{
								moveUp();
							}
						}
					});
					var speed = 120;

					function moveImg(){
						//var imgOffset = 0 - _img.height + 300;

						//_img.style.webkitTransition = "-webkit-transform 10s linear";
						_img.style.webkitTransform = "translate3D(0,0,0)";
					}

					function moveDown(){
						
						if(_img.getAttribute("isDown")==1){

							return;
						}
						console.log("moveDown");
						//QZFL.effect.stop(_img);
						_img.setAttribute("isDown",1);

						var offset = 0-_img.height+300;
						//var _du = Math.round((_img.height/120)*1000);

						//var _mt = Math.abs(Number(_img.style.marginTop.replace("px","")));
						//var _du = Math.round(((_img.height-300-_mt)/speed)*1000);

						//_img.style.webkitTransition = "-webkit-transform 10s linear";
						//_img.style.webkitTransform = "translate3D(0," + offset + "px,0)";
						//console.log("_mt:"+_mt+"   "+ "du:"+_du+"_img:"+_img.outerHTML);

						// -webkit-transform:translate(0);

						// QZFL.effect.run(_img,{
						//     marginTop:offset+"px"
						//   },{
						//   	duration:_du,
						//   	easing:"linear"
						//   });

						
					}
					
					function moveUp(){
						
						//clearInterval(window.moveDownTimer);
						if(_img.getAttribute("isDown")==0){
							return;
						}

						//QZFL.effect.stop(_img);
						
						console.log("moveUp");
						_img.setAttribute("isDown",0);

						//_img.style.marginTop = "0px";
						//var _mt = Math.abs(Number(_img.style.marginTop.replace("px","")));
						//var _du = Math.round((_mt/speed)*1000);

						//_img.style.webkitTransition = "-webkit-transform 10s linear";
						//_img.style.webkitTransform = "translate3D(0,0px,0)";

						//console.log("_mt:"+_mt+"   "+ "du:"+_du+"_img:"+_img.outerHTML);
						
						// QZFL.effect.run(_img,{
						// 	    marginTop:'0px'
						// 	  },{
						//   	duration:_du,
						//   	easing:"linear"
						//   });
					}

					// function stop(){
					// 	_img.setAttribute("isDown",-1);
					// 	cancelAnimationFrame(moveImg);
					// 	//QZFL.effect.stop(_img);
					// }

					/*QZFL.event.addEvent(btns[i].parentNode,"mouseover",function(){	
						//console.log("mouseover:"+_img.height);
					});
					*/
					QZFL.event.addEvent(btns[i].parentNode,"mouseout",function(){
						stop();
						_img.setAttribute("isFirstTouch",1);
					});
					
					_img.setAttribute("hasBindedEvent",1);
				})(img);
				
			}

		}

    }
};

define(function(require, exports){
	exports.init = function(){
	    QZONE.longPicOPT.init();
	};
});