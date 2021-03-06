//设置css样式
function setStyleCss(obj, name, value){
	if(arguments.length==2){
		return obj.style[name];
	}else{
		obj.style[name]=value;
	}
}

/*######取得非行间样式###### Example:getStyle(sommeDom,'width'));*/
function getClassStyle(obj,name){
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj,false)[name];
	}
}

/*######从oParnet中选出含有sClass元素的类，
==>alert(getElementsByClassName(Ull,'li','tjq').length)#############*/
function getElementsByClassName(oParent,tagName,sClass){
	var aResult=[];
	var elementResult=oParent.getElementsByTagName(tagName); 
	for (var i = 0; i < elementResult.length; i++) {
		var aClassName=elementResult[i].className.split(' ');
		for(var j=0;j<aClassName.length;j++){
			if(aClassName[j] == sClass){aResult.push(elementResult[i]);break;
			}
		}
	};
	return aResult;
}
/*######获取元素到页面根部的绝对距离,返回值为dis.left或者dis.top==>alert(getPosition(Ull).top);默认不带px######*/
function getPosition(obj){
	var dis={left:0,top:0};
	while(obj){
		dis.top+=obj.offsetTop;
		dis.left+=obj.offsetLeft;
		obj=obj.offsetParent;
	}
	return dis;
}
//设置元素属性||可操作自定义属性
function changeElementProp(howDo,obj,oldProp,newProp){
	switch (howDo){
		case 'get' :
		return obj.getAttribute('oldProp');
		break;
		case 'set' :
		obj.setAttribute(oldProp,newProp);
		break;
		case 'remove':
		obj.removeAttribute(oldProp);
		break;
	}

}

/*###########获取某个点的绝对距离(包括滚动条在内，返回值默认不带px单位)######getScroll().y;*/
function getScroll(ev){
	var top=document.documentElement.scrollTop||document.body.scrollTop;
	var left=document.documentElement.scrollLeft||document.body.scrollLeft;
	return {x:ev.clientX+left,y:ev.clientY+top};
}

//获得可视区高度
function getViewport(){
	if(document.compatMode=='BackCompat'){
		return {
			width:document.body.clientWidth,
			height:document.body.clientHeight
		};
	}else{
		return {
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}



/*ajax函数封装，第二个参数为成功读取时调用函数，第三个为失败时调用函数*/
function ajax(method, url, data, success) {
	//1.创建Ajax对象
	var xhr = null;
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	if (method == 'get' && data) {
		url += '?' + data;
	}

	//2.连接服务器
	//open(方法, 文件名, 异步传输)
	xhr.open(method,url,true);

	//3.发送请求
	if (method == 'get') {
		xhr.send();
	} else {
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);
	}
	//4.接收返回
	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 ) {
				success && success(xhr.responseText);
			} else {
				console.log('出错了,Err：' + xhr.status);
			}
		}

	}
}
/*冒泡和捕获是相对的,事件绑定bind(oBtn, 'click', function(){},true;捕获改为true,冒泡为false,事件冒泡是默认存在的,IE9以上的标准IE有attachEvent和addEventListener两个方法,IE8不支持,attachEvent函数不支持捕获，所以只有IE8以下的不支持捕获
取消单个事件的冒泡用ev.cancelBubble,只能取消当前事件的冒泡效果，不能取消别的*/
function bind(obj,evname,fn){
	if(obj.addEventListener){
		obj.addEventListener(evname,fn,false);//如果obj.下的addEventListener存在就说明是标准，如果不存在就说明是IE
	}else{
		obj.attachEvent('on'+evname,function(){
			fn.call(obj);
		})
	}
}
//事件捕获改为true.IE只支持事件冒泡，不支持事件捕获，它也不支持addEventListener函数，不会用第三个参数来表示是冒泡还是捕获，它提供了另一个函数attachEvent。
//事件取消函数
function bindcanel(obj,evname,fn){
	if(obj.addEventListener){
		obj.removeEventListener(evname, fn, false);
	}else{
		obj.detachEvent('on'+evname, function(){
			fn.call(obj);
		});
	}
}

//拖拽的封装,任意距离
function dragFree(obj) {
	//阻止默认事件函数，防止拖拽元素无法进行表单输入
	     function preventDefaultEvent(ev){
            var ev=ev||event;
            ev.preventDefault?ev.preventDefault():ev.returnValue=false;
         }
		obj.onmousedown = function(ev) {
			 document.addEventListener?document.addEventListener('mousemove',preventDefaultEvent,false):document.attachEvent('onmousemove',preventDefaultEvent);//防止选中文字时无法拖拽该元素
			var ev = ev || event;
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			//设置全局捕获(和事件捕获不一样，这是把所有后续事件拉到自己身上来，防止有文字被选中时低版本IE拖拽出问题,注意当拖拽元素当中有表单时，设置setCaptrue会导致表单无法输入，所以需要去掉)
			if (this.setCapture ) {
				this.setCapture();
			}
			document.onmousemove = function(ev) {
				var ev = ev || event;
				obj.style.left = ev.clientX - disX + 'px';
				obj.style.top = ev.clientY - disY + 'px';
			}
			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
				//释放全局捕获 releaseCapture();
				if (obj.releaseCapture ) {
					obj.releaseCapture();
				}
			}
		}
	}
//限制父级范围的拖拽
function dragHowLong(dragElement,fatherElement) {
		  function preventDefaultEvent(ev){
            var ev=ev||event;
            ev.preventDefault?ev.preventDefault():ev.returnValue=false;
         }
		
		dragElement.onmousedown = function(ev) {
			 document.addEventListener?document.addEventListener('mousemove',preventDefaultEvent,false):document.attachEvent('onmousemove',preventDefaultEvent);
			var ev = ev || event;
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			
			if ( this.setCapture ) {
				this.setCapture();
			}
			
			document.onmousemove = function(ev) {
				var ev = ev || event;
				
				var L = ev.clientX - disX;
				var T = ev.clientY - disY;
				
				if ( L < 0 ) {
					L = 0;
				} else if ( L > fatherElement.clientWidth - dragElement.offsetWidth ) {
					L = fatherElement - dragElement.offsetWidth;
				}
				
				if ( T < 0 ) {
					T = 0;
				} else if ( T > fatherElement.clientHeight - dragElement.offsetHeight ) {
					T = fatherElement.clientHeight - dragElement.offsetHeight;
				}
				
				dragElement.style.left = L + 'px';
				dragElement.style.top = T + 'px';
				
			}
			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
				if ( dragElement.releaseCapture ) {
					dragElement.releaseCapture();
				}
			}
		}
	}
	//磁性吸附拖拽,更改howLong值
function dragYourLong(dragElement,fatherElement,howLong) {
		  function preventDefaultEvent(ev){
            var ev=ev||event;
            ev.preventDefault?ev.preventDefault():ev.returnValue=false;
         }
		
		dragElement.onmousedown = function(ev) {
			 document.addEventListener?document.addEventListener('mousemove',preventDefaultEvent,false):document.attachEvent('onmousemove',preventDefaultEvent);
			var ev = ev || event;
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			
			if ( this.setCapture ) {
				this.setCapture();
			}
			
			document.onmousemove = function(ev) {
				var ev = ev || event;
				
				var L = ev.clientX - disX;
				var T = ev.clientY - disY;
				
				if ( L < howLong ) {
					L = 0;
				} else if ( L > fatherElement.clientWidth - dragElement.offsetWidth-howLong) {
					L = fatherElement.clientWidth - dragElement.offsetWidth;
				}
				
				if ( T < howLong ) {
					T = 0;
				} else if ( T > fatherElement.clientHeight - dragElement.offsetHeight-howLong ) {
					T = fatherElement.clientHeight - dragElement.offsetHeight;
				}
				
				dragElement.style.left = L + 'px';
				dragElement.style.top = T + 'px';
				
			}
			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
				if ( dragElement.releaseCapture ) {
					dragElement.releaseCapture();
				}
			}
		}
	}
/*碰撞检测原理之一:利用拖拽去把待碰撞的某元素四边(假设待碰撞的元素为矩形)的距离做检测,用九宫格检测法.将待检测的矩形四边扩散无限延长，这时待检测的矩形会处于九宫格中间，所拖拽的元素在九宫格中间的一个格子之外就是非碰撞状态，依此条件作为判断*/
function checkDragCollide(dragElement,waitDragElement) {
		  function preventDefaultEvent(ev){
            var ev=ev||event;
            ev.preventDefault?ev.preventDefault():ev.returnValue=false;
         }
		
		dragElement.onmousedown = function(ev) {
			 document.addEventListener?document.addEventListener('mousemove',preventDefaultEvent,false):document.attachEvent('onmousemove',preventDefaultEvent);
			var ev = ev || event;
			var disX = ev.clientX - this.offsetLeft;
			var disY = ev.clientY - this.offsetTop;
			
			if ( this.setCapture ) {
				this.setCapture();
			}
			
			document.onmousemove = function(ev) {
				var ev = ev || event;
				
				var L = ev.clientX - disX;
				var T = ev.clientY - disY;
				//被拖拽元素
                var dragElementLeft=L;//拖拽元素左边的left值
                var dragElementRight=L+dragElement.offsetWidth;//拖拽元素右边的left值
                var dragElementTop=T;//拖拽元素上边的top值
                var dragElementBottom=T+dragElement.offsetHeight;//拖拽元素下边的top值
               //等待碰撞元素
                var waitDragElementLeft=waitDragElement.offsetLeft; 
                var waitDragElementRight=waitDragElement.offsetLeft+waitDragElement.offsetWidth; 
                var waitDragElementTop=waitDragElement.offsetTop; 
                var waitDragElementBottom=waitDragElement.offsetTop+waitDragElement.offsetHeight; 
                 
                 //碰撞检测

                 if(dragElementRight<waitDragElementLeft || dragElementLeft>waitDragElementRight || dragElementTop>waitDragElementBottom || dragElementBottom<waitDragElementTop){
                 	//没碰上的逻辑
                 	waitDragElement.innerHTML='没碰上';
                 }else{
                 	//碰上的逻辑
                        waitDragElement.innerHTML='卧槽,碰上了';
                 }			
				
				dragElement.style.left = L + 'px';
				dragElement.style.top = T + 'px';
				
			}
			document.onmouseup = function() {
				document.onmousemove = document.onmouseup = null;
				if ( dragElement.releaseCapture ) {
					dragElement.releaseCapture();
				}
			}
		}
	}

/*addClass 添加一个类*/
function addClass(obj,sclass){
	if(obj.className==''){
		obj.className=sclass;
	}else{
		var arrClass=obj.className.split(' ');
		for(var i=0;i<arrClass.length;i++){
			if(sclass !=arrClass[i]){
              obj.className+=' '+sclass;
			}
		}
	}
}
/***********删除一个类******/
function removeClass(obj,sClass){
	if(obj.className != ''){
	   var classArr=obj.className.split(' ');
	   for(var i=0;i<classArr.length;i++){
		  if(classArr[i] == sClass){
			classArr.splice(i,1);
     		obj.className=classArr.join(' ');
     		break;	
 		 }
	        }
	    
		}
	}
//表单placeHolder模拟
function placeHolder(obj,string){
   var defaultText=true;
   obj.onfocus=function(){
	if(defaultText){
		this.value='';
 	}
  }
obj.onblur=function(){
	var re=/\S/;
	if(!re.test(this.value)){
		this.value=string;
		defaultText=true;
	}else{
        defaultText=false;
	}
  }
}
//设置cookie
function setCookie(name,value,time){

    var oDate=new Date();

    oDate.setDate(oDate.getDate()+time);

    document.cookie=name+'='+encodeURI(value)+';expires='+oDate.toGMTString();
}	
//cookie存放的格式总是以xx=xxx分号空格xx=xxx分号空格xxx=xxx分号空格,
function getCookie(cookiename){

	var arr1=document.cookie.split('; ');

	for (var i = 0; i <arr1.length; i++) {

		var arr2=arr1[i].split('=');

			if(arr2[0]==cookiename){

				return decodeURI(arr2[1]);
			}
		};
		return '';//如果什么也没找到
	};


//删除cookie
function removeCookie(name){
   setCookie(name,'',-1);//删除cookie时注意结合setCookie一起使用
}
/*#########自由运动框架########
linear:匀速||easeIn:加速曲线||easeOut:减速曲线||
easeBoth:加速减速曲线||easeInStrong:加加速曲线||
easeOutStrong:减减速曲线||easeBothStrong:加加速减减速曲线||
elasticIn:正弦衰减曲线（弹动渐入）||elasticOut:正弦增强曲线（弹动渐出）||
backIn:回退加速（回退渐入）||bounceIn:弹球减振（弹球渐出）
Example:startMove(D,{left:500},1000,'elasticOut',function(){});函数参数不一定要写
*/

function moveofTime(obj,json,times,fx,fn){
	if( typeof times == 'undefined' ){
		times = 400;
		fx = 'linear';
	}
	if( typeof times == 'string' ){
		if(typeof fx == 'function'){
			fn = fx;
		}
		fx = times;
		times = 400;
	}
	else if(typeof times == 'function'){
		fn = times;
		times = 400;
		fx = 'linear';
	}
	else if(typeof times == 'number'){
		if(typeof fx == 'function'){
			fn = fx;
			fx = 'linear';
		}
		else if(typeof fx == 'undefined'){
			fx = 'linear';
		}
	}
	var iCur = {};
	for(var attr in json){
		iCur[attr] = 0;		
		if( attr == 'opacity' ){
			iCur[attr] = Math.round(getStyle(obj,attr)*100);
		}
		else{
			iCur[attr] = parseInt(getStyle(obj,attr));
		}	
	}
	var startTime = now();
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){	
		var changeTime = now();	
		var t = times - Math.max(0,startTime - changeTime + times);  //0到2000
		for(var attr in json){		
			var value = Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);	
			if(attr == 'opacity'){
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+')';
			}
			else{
				obj.style[attr] = value + 'px';
			}	
		}
		if(t == times){
			clearInterval(obj.timer);
			if(fn){
				fn.call(obj);
			}
		}	
	},13);
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		else{
			return getComputedStyle(obj,false)[attr];
		}
	}
	function now(){
		return (new Date()).getTime();
	}
}
var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}
/*完美运动框架速度版,注意配合css函数一起使用
startMove(oDiv,{'width':200,
'opacity':50
},function(){
alert('啊啊啊啊');
})
*/
function moveofSpeed(obj, json, fn) {
	function css(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}
	clearInterval(obj.iTimer);
	var iCur = 0;
	var iSpeed = 0;
	obj.iTimer = setInterval(function() {
		var iBtn = true;	
		for ( var attr in json ) {		
			var iTarget = json[attr];
			if (attr == 'opacity') {
				iCur = Math.round(css( obj, 'opacity' ) * 100);
			} else {
				iCur = parseInt(css(obj, attr));
			}
			iSpeed = ( iTarget - iCur ) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if (iCur != iTarget) {
				iBtn = false;
				if (attr == 'opacity') {
					obj.style.opacity = (iCur + iSpeed) / 100;
					obj.style.filter = 'alpha(opacity='+ (iCur + iSpeed) +')';
				} else {
					obj.style[attr] = iCur + iSpeed + 'px';
				}
			}	
		}
		if (iBtn) {
			clearInterval(obj.iTimer);
			fn && fn.call(obj);
		}		
	}, 10);
}


//css3版本运动框架
var tween = {
	easeOut: function(t, b, c, d){
		return -c *(t/=d)*(t-2) + b;
	},    
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}
};
function tweenMove(obj,oTarget,iTime,iType,fnEnd,fnDuring)
{
	var fn=tween[iType];
	var t=0;
	var b={};
	var c={};
	var d=iTime/24;
	var sAttr="";
	clearInterval(obj.timer);
	for(sAttr in oTarget)
	{
		b[sAttr]=css(obj,sAttr);
		c[sAttr]=oTarget[sAttr]-b[sAttr];
	}
	if(iTime<30)
	{
		for(sAttr in oTarget)
		{
			css(obj,sAttr,oTarget[sAttr]);
		}
	}
	else
	{
		obj.timer=setInterval(
		function()
		{
			if(t<d)
			{
				t++;
				for(sAttr in oTarget)
				{
					css(obj,sAttr,fn(t,b[sAttr],c[sAttr],d));
				}
			}
			else
			{
				for(sAttr in oTarget)
				{
					css(obj,sAttr,oTarget[sAttr]);
				}
				clearInterval(obj.timer);
				if(fnEnd)
				{
					fnEnd.call(obj);
				}
			}
			if(fnDuring)
			{
				fnDuring.call(obj);
			}
		},24);
	}
}
function css(obj, attr, value){
	if(arguments.length==2){
		if(attr=='scale'|| attr=='rotate'|| attr=='rotateX'||attr=='rotateY'||attr=='scaleX'||attr=='scaleY'||attr=='translateY'||attr=='translateX')
		{
			if(! obj.$Transform)
			{
				obj.$Transform={};
			}
			switch(attr)
			{
				case 'scale':
				case 'scaleX':
				case 'scaleY':
				return typeof(obj.$Transform[attr])=='number'?obj.$Transform[attr]:100;
				break;
				default:
					return obj.$Transform[attr]?obj.$Transform[attr]:0;
			}
		}
		var sCur=obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr];
		if(attr=='opacity'){
			return Math.round((parseFloat(sCur)*100));
		}
		else{
			return parseInt(sCur);
		}
	}
	else if(arguments.length==3)
	{
		switch(attr){
			case 'scale':
			case 'scaleX':
			case 'scaleY':
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
			case 'translateZ':
			case 'translateX':
			case 'translateY':
			setCss3(obj, attr, value);
			break;
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				if(typeof value=="string")
				{
					obj.style[attr]=value;
				}
				else
				{
					obj.style[attr]=value+'px';
				}
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value+")";
				obj.style.opacity=value/100;
				break;
			default:
				obj.style[attr]=value;
		}
	}
	return function (attr_in, value_in){css(obj, attr_in, value_in)};
}
function setCss3(obj, attr, value)
{
	var sTr="";
	var sVal="";
	var arr=["Webkit","Moz","O","ms",""];
	if(! obj["$Transform"])
	{
		obj["$Transform"]={};
	}
	obj["$Transform"][attr]=parseInt(value);
	for( sTr in obj["$Transform"])
	{
		switch(sTr)
		{
			case 'scale':
			case 'scaleX':
			case 'scaleY':
			sVal+=sTr+"("+(obj["$Transform"][sTr]/100)+") ";	
			break;
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
			sVal+=sTr+"("+(obj["$Transform"][sTr])+"deg) ";	
			break;
			case 'translateX':
			case 'translateY':
			case 'translateZ':
			sVal+=sTr+"("+(obj["$Transform"][sTr])+"px) ";	
			break;
		}
	}
	for(var i=0;i<arr.length;i++)
	{
		obj.style[arr[i]+"Transform"]=sVal;
	}	
}	
//css3运动框架结束



 //插件检测  非ie
function hasPlugin(name){
	//name插件名,example:Flash,QuickTime
	//navigator.plugins浏览器插件信息数组
	name=name.toLowerCase();
	for(var i=0;i<navigator.plugins.length;i++){
		if(navigator.plugins[i].name.toLowerCase().indexOf(name)>-1){
			return true;
		}
	}
	return false;
}
//ie,必须知道完整的插件标识符
function hasIEPlugin(name){
	try{
		new ActiveXObject(name);
		return true;
	}catch(ex){
			return false;
	}
}
//这两种检测插件的方法差别太大，所以最好的方式还是针对不同插件写通用方法,比如flash
function hasFlash(){
	var result=hasPlugin("Flash");
	if(!result){
		result=hasIEPlugin('ShockwaveFlash.ShockwaveFlash');
	}
	return result;
}
//客户端能力检测，判断某某对象是否支持某方法
function isHostMethod(object,property){
	var t=typeof object[property];
	return t=='function'||(!!(t=='object'&&object[property]))||t=='unknown';
}
//例子
if(isHostMethod(document,'getElementById')){
	alert('存在');
}else{
	alert('不存在');
};

//css3 transition事件   css3 transform后写的先执行,比如 scale,translateX,是先执行位移,再缩放
function transitionEndEvent(obj,fn) {
	obj.addEventListener('WebkitTransitionEnd', fn, false);
	obj.addEventListener('transitionend',fn, false);
}
//阻止默认事件和冒泡,前者为标准后者为非标准,这里只是提供写法，为封装函数
function defaultEvent(ev){
	ev=ev||event;
	ev.preventDefault?ev.preventDefault():ev.returnValue=false;
    ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
}
//操作系统，浏览器，以及版本检测(摘自高级程序设计)
var client = function(){
    //内核检测
    var engine = {            
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        //内核版本
        ver: null  
    };
    //浏览器
    var browser = {
        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        ver: null
    };
    //操作系统
    var system = {
        win: false,
        mac: false,
        x11: false,
        
        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,
        //game systems
        wii: false,
        ps: false 
    };    

    //detect rendering engines/browsers
    var ua = navigator.userAgent;    
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    
    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;
    

    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;                
                }                            
            } else if (RegExp["$1"] == "9x"){
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }
    
    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;
    
    //windows mobile
    if (system.win == "CE"){
        system.winMobile = system.win;
    } else if (system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    //return it
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };

}();




//面向对象之类式继承
function extendClass(SonClass,FatherClass){
	var F=function(){};//申明一个不占内存的过渡函数
	F.prototype=FatherClass.prototype;
	SonClass.prototype=new F();//解除耦合关系实现继承
	SonClass.prototype.constructor=SonClass;//修复构造函数指向
	SonClass.fatherclassName=FatherClass.prototype;//为子类添加自定义属性解除继承时父类类名耦合
	if(FatherClass.prototype.constructor==Object.prototype.constructor){//确保父类的构造函数被正确设置
		FatherClass.prototype.constructor=FatherClass;
		//子类时调用由FatherClass.call()改成SonClass.fatherclassName.constructor.call();
	}
}





//拷贝继承(浅拷贝,只复制prototype,不复制构造函数内部的属性)
function extendPrototype(SonClass,FatherClass){
	for(var attr in FatherClass.prototype){
		SonClass.prototype[attr]=FatherClass.prototype[attr];
	}
}
//多继承
function moreExtend(){
	var i=1,
	len=arguments.length,
	target=arguments[0],
	arg;
	for(;i<len;i++){
		arg=arguments[i];
		for(var property in arg){
			target[property]=arg[property];
		}
	}
	return target;
}
