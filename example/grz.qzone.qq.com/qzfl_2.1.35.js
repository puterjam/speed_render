


/////////////
//headerfix.js
/////////////




(window.constructQZFL = function(){




//})();



/////////////
//qzfl.js
/////////////


/**
 * @fileOverview QZFL 主框架逻辑，<br/>
					Qzone Front-end Library: Liberation<br />
					QZFL 是由空间平台开发组，开发的一套js框架库。<br />
					QZFL 最后的 L 有两个意思，其中一个意思是 Library 功能库，说明这是一个前台的框架库;<br />
					同时 L 也是 Liberation 解放的意思，这是希望通过 QZFL 能把大家在JS开发工作中解放出来。
					QZFL各种合并版本都必须包含本源文件
 * @version 2.0.9.6 ($Rev: 1921 $)
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */

/**
 * QZFL名字空间
 * @namespace QZFL名字空间
 * @name QZFL
 */
window.QZFL = window.QZONE = window.QZFL || window.QZONE || {};

/**
 * 版本号说明字
 * @type string
 */
QZFL.version = "2.1.1.7";

/**
 * 版本号数字
 * @public
 * @type number
 */
QZFL._qzfl = 2.117;

/**
 * 定义一个通用空函数
 * @returns {undefined}
 */
QZFL.emptyFn = function() {};

/**
 * 定义一个通用透传函数
 * @param {number|string|object|function|undefined} [v = undefined]
 * @returns {number|string|object|function|undefined} 就是传入的v直接透传出来
 */
QZFL.returnFn = function(v) {
	return v;
};

/**
 * 浏览器判断引擎，给程序提供浏览器判断的接口
 * @namespace 浏览器判断引擎
 * @name userAgent
 * @memberOf QZFL
 */
(function(){
	var ua = QZFL.userAgent = {}
		, agent = navigator.userAgent
		, nv = navigator.appVersion
		, r
		, m
		, optmz;

	/**
	 * 调整浏览器的默认行为，使之优化
	 * @deprecated 已经不建议显式调用了，由QZFL初始化时调用
	 * @function
	 * @static
	 * @name adjustBehaviors
	 * @memberOf QZFL.userAgent
	 */
	ua.adjustBehaviors = QZFL.emptyFn;
	
	if (window.ActiveXObject || window.msIsStaticHTML) {//ie (document.querySelectorAll) or IE11
		/**
		 * IE版本号，如果不是IE，此值为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name ie
		 * @memberOf QZFL.userAgent
		 */
		ua.ie = 6;

		(window.XMLHttpRequest || (agent.indexOf('MSIE 7.0') > -1)) && (ua.ie = 7); 
		(window.XDomainRequest || (agent.indexOf('Trident/4.0') > -1)) && (ua.ie = 8); 
		(agent.indexOf('Trident/5.0') > -1) && (ua.ie = 9); 
		(agent.indexOf('Trident/6.0') > -1) && (ua.ie = 10); 
		(agent.indexOf('Trident/7.0') > -1) && (ua.ie = 11);	

		/**
		 * 当前的IE浏览器是否为beta版本
		 * @field
		 * @type boolean
		 * @static
		 * @name isBeta
		 * @memberOf QZFL.userAgent
		 */
		ua.isBeta = navigator.appMinorVersion && navigator.appMinorVersion.toLowerCase().indexOf('beta') > -1;

		//一些浏览器行为矫正
		if (ua.ie < 7) {//IE6 背景图强制cache
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch (ign) {}
		}

		//创建一个document引用
		QZFL._doc = document;

		//扩展IE下两个setTime的传参能力
		optmz = function(st){
				return function(fns, tm){
						var aargs;
						if(typeof fns == 'string'){
							return st(fns, tm);
						}else{
							aargs = Array.prototype.slice.call(arguments, 2);
							return st(function(){
									fns.apply(null, aargs);
								}, tm);
						}
					};
			};
		window.setTimeout = QZFL._setTimeout = optmz(window.setTimeout);
		window.setInterval = QZFL._setInterval = optmz(window.setInterval);

	} else if (document.getBoxObjectFor || typeof(window.mozInnerScreenX) != 'undefined') {
		r = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+)/i;

		/**
		 * FireFox浏览器版本号，非FireFox则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name firefox
		 * @memberOf QZFL.userAgent
		 */
		ua.firefox = parseFloat((r.exec(agent) || r.exec('Firefox/3.3'))[1], 10);
	} else if (!navigator.taintEnabled) {//webkit
		m = /AppleWebKit.(\d+\.\d+)/i.exec(agent);

		/**
		 * Webkit内核版本号，非Webkit则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name webkit
		 * @memberOf QZFL.userAgent
		 */
		ua.webkit = m ? parseFloat(m[1], 10) : (document.evaluate ? (document.querySelector ? 525 : 420) : 419);
		
		if ((m = /Chrome.(\d+\.\d+)/i.exec(agent)) || window.chrome) {

			/**
			 * Chrome浏览器版本号，非Chrome浏览器则为 NaN
			 * @field
			 * @type number
			 * @static
			 * @name chrome
			 * @memberOf QZFL.userAgent
			 */
			ua.chrome = m ? parseFloat(m[1], 10) : '2.0';
		} else if ((m = /Version.(\d+\.\d+)/i.exec(agent)) || window.safariHandler) {

			/**
			 * Safari浏览器版本号，非Safari浏览器则为 NaN
			 * @field
			 * @type number
			 * @static
			 * @name safari
			 * @memberOf QZFL.userAgent
			 */
			ua.safari = m ? parseFloat(m[1], 10) : '3.3';
		}

		/**
		 * 当前页面是否为air client
		 * @field
		 * @type boolean
		 * @static
		 * @name air
		 * @memberOf QZFL.userAgent
		 */
		ua.air = agent.indexOf('AdobeAIR') > -1 ? 1 : 0;

		/**
		 * 是否为iPod客户端页面
		 * @field
		 * @type boolean
		 * @static
		 * @name isiPod
		 * @memberOf QZFL.userAgent
		 */
		ua.isiPod = agent.indexOf('iPod') > -1;

		/**
		 * 是否为iPad客户端页面
		 * @field
		 * @type boolean
		 * @static
		 * @name isiPad
		 * @memberOf QZFL.userAgent
		 */
		ua.isiPad = agent.indexOf('iPad') > -1;

		/**
		 * 是否为iPhone客户端页面
		 * @field
		 * @type boolean
		 * @static
		 * @name isiPhone
		 * @memberOf QZFL.userAgent
		 */
		ua.isiPhone = agent.indexOf('iPhone') > -1;
	} else if (window.opera) {//opera

		/**
		 * Opera浏览器版本号，非Opera则为 NaN
		 * @field
		 * @type number
		 * @static
		 * @name opera
		 * @memberOf QZFL.userAgent
		 */
		ua.opera = parseFloat(window.opera.version(), 10);
	} else {//默认IE6吧
		ua.ie = 6;
	}	

	/**
	 * 是否为MacOS
	 * @field
	 * @type boolean
	 * @static
	 * @name macs
	 * @memberOf QZFL.userAgent
	 */
	if (!(ua.macs = agent.indexOf('Mac OS X') > -1)) {

		/**
		 * Windows操作系统版本号，不是的话为NaN
		 * @field
		 * @type number
		 * @static
		 * @name windows
		 * @memberOf QZFL.userAgent
		 */
		ua.windows = ((m = /Windows.+?(\d+\.\d+)/i.exec(agent)), m && parseFloat(m[1], 10));

		/**
		 * 是否Linux操作系统，不是的话为false
		 * @field
		 * @type boolean
		 * @static
		 * @name linux
		 * @memberOf QZFL.userAgent
		 */
		ua.linux = agent.indexOf('Linux') > -1;

		/**
		 * 是否Android操作系统，不是的话为false
		 * @field
		 * @type boolean
		 * @static
		 * @name android
		 * @memberOf QZFL.userAgent
		 */
		ua.android = agent.indexOf('Android') > -1;
	}


	/**
	 * 是否iOS操作系统，不是的话为false
	 * @field
	 * @type boolean
	 * @static
	 * @name iOS
	 * @memberOf QZFL.userAgent
	 */
	ua.iOS = agent.indexOf('iPhone OS') > -1;
	!ua.iOS && (m = /OS (\d+(?:_\d+)*) like Mac OS X/i.exec(agent), ua.iOS = m && m[1] ? true : false);


})();

/**
 * QZFL对Javascript Object的接口封装，提供一些原生能力
 * @namespace 对象基础处理
 */
QZFL.object = {

	/**
	 * 把命名空间的方法映射到全局
	 * @param {object} object 对象
	 * @param {object} [scope=window] 目标空间
	 * @deprecated 不推荐常使用，避免变量名冲突

	 * @example
	 * QZFL.object.map(QZFL.lang)
	 */
	map : function(object, scope) {
		return QZFL.object.extend(scope || window, object);
	},

	/**
	 * 命名空间功能扩展
	 * @param {object} namespace 需要被扩展的命名空间
	 * @param {object} extendModule 需要扩展的功能包
	 * @returns {object} 返回被扩展的命名空间，即扩展后的namespace

	 * @example
	 * QZFL.object.extend(QZFL.dialog, { fn1: function(){} } );
	 */
	extend : function() {
		var args = arguments,
			len = arguments.length,
			deep = false,
			i = 1,
			target = args[0],
			opts,
			src,
			clone,
			copy;

		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}

		if ( typeof target !== "object" && typeof target !== "function" ) {
			target = {};
		}

		if ( len === i ) {
			target = QZFL;
			--i;
		}

		for ( ; i < len; i++ ) {
			if ( (opts = arguments[ i ]) != null ) {
				for (var name in opts ) {
					src = target[ name ];
					copy = opts[ name ];

					if ( target === copy ) {
						continue;
					}

					if ( deep && copy && typeof copy === "object" && !copy.nodeType ) {

						if ( src ) {
							clone = src;
						} else if ( QZFL.lang.isArray(copy) ) {
							clone = [];
						} else if ( QZFL.object.getType(copy) === 'object' ) {
							clone = {};
						} else {
							clone = copy;
						}

						target[ name ] = QZFL.object.extend( deep, clone, copy );

					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		return target;
	},
	
	/**
	 * 对对象成员批量执行一个操作
	 *
	 * @param {object} obj 被操作对象对象
	 * @param {function} callback 所执行的操作
	 * @returns {object} 传入的obj对象

	 * @example
	 * QZFL.object.each([1,2,3], function(){ alert(this) } );
	 */
	each : function(obj, callback) {
		var value,
			i = 0,
			length = obj.length,
			isObj = (length === undefined) || (typeof(obj)=="function");
		if (isObj) {
			for (var name in obj) {
				if (callback.call(obj[name], obj[name], name, obj) === false) {
					break;
				}
			}
		} else {
			for (value = obj[0]; i < length && false !== callback.call(value, value, i, obj); value = obj[++i]) { }
		}
		return obj;
	},

	/**
	 * 获取对象类型
	 *
	 * @param {object} obj 任意一个数据
	 * @return {string} 返回对象类型字符串

	 * @example
	 * QZFL.object.getType([1,2,3]);
	 */
	getType : function(obj) {
		return obj === null ? 'null' : (obj === undefined ? 'undefined' : Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());
	},
	
	/**
	 * route用到的正则对象
	 * @field
	 * @static
	 * @private
	 * @type RegExp
	 * @default /([\d\w_]+)/g
	 */
	routeRE : /([\d\w_]+)/g,
	
	/**
	 * 用对象路径取一个JSON对象中的子对象引用
	 * @static
	 * @param {object} obj 源对象
	 * @param {string} path 对象获取路径
	 * @returns {object|string|number|function}

	 * @example
	 * QZFL.object.route(
	           { "a" : 
			       { "b" :
				       { "c" : "Hello World"
					   }
			       }
			   },
			   "a.b.c"
	       ); //返回值："Hello World"
	 */
	route: function(obj, path){
		obj = obj || {};
		path = String(path);

		var r = QZFL.object.routeRE,
			m;
	
		r.lastIndex = 0;

		while ((m = r.exec(path)) !== null) {
			obj = obj[m[0]];
			if (obj === undefined || obj === null) {
				break;
			}
		}

		return obj;
	},
	
	/**
	 * 将方法绑定在对象上，能够保护this指针不会“漂移”
	 * @param {object} obj 母体对象
	 * @param {object} fn 目标方法

	 * @example var e = QZFL.event.bind(objA, funB);
	 */
	bind : function(obj, fn) {
		var slice = Array.prototype.slice,
			args = slice.call(arguments, 2);

		return function(){
			obj = obj || this;
			fn = typeof fn == 'string' ? obj[fn] : fn;
			fn = typeof fn == 'function' ? fn : QZFL.emptyFn;
			return fn.apply(obj, args.concat(slice.call(arguments, 0)));
		};
	},

	/**
	 * 把指定命名空间下的方法 以短名的方式 映射到另一个命名空间
	 * @param {object} src 源对象
	 * @param {object} tar 目标对象
	 * @param {function} [rule=function(name){ return '$' + name; }] 映射名字的处理器
	 * @returns {undefined}
	 */
	ease : function(src, tar, rule){
		if (tar) {
			if (typeof(rule) != 'function') {
				rule = QZFL.object._eachFn;
			}
			QZFL.object.each(src, function(v, k){
				if (typeof(v) == 'function') {
					tar[rule(k)] = v;
				}
			});
		}
	},
	
	/**
	 * QZFL.object.ease 的命名映射默认方案
	 * @param {string} name 源名
	 * @returns {string} 转换后的名字
	 * @private
	 */
	_easeFn : function(name){
		return '$' + name;
	}
};



/**
 * QZFL对Javascript Object的接口封装，提供一些原生能力 <strong style="color:red;">Deprecated</strong>
 * @namespace 对象基础处理
 * @deprecated 建议不要用这个了，用QZFL.object中的相关方法
 * @see QZFL.object
 */
QZFL.namespace = QZFL.object;

/**
 * QZFL 调试引擎接口，为调试提供接入的可能
 * @namespace QZFL调试引擎接口
 */
QZFL.runTime = {

	/**
	 * 是否处于debug模式
	 * @field
	 * @static
	 * @type boolean
	 * @default false
	 */
	isDebugMode : false,

	/**
	 * 错误报告接口
	 * @function
	 * @static
	 * @type function
	 * @default QZFL.emptyFn
	 */
	error : QZFL.emptyFn,

	/**
	 * 警告信息报告接口
	 * @function
	 * @static
	 * @type function
	 * @default QZFL.emptyFn
	 */
	warn : QZFL.emptyFn
};

//---------------------------------------------

/**
 * qzfl 控制台，用于显示调试信息以及进行一些简单的脚本调试等操作
 * @namespace QZFL控制台接口，用来显示程序输出的log信息。
 */
QZFL.console = window.console || {};//function(expr){};

/**
 * 在console里显示信息
 * @returns {undefined}
 */
QZFL.console.log = QZFL.console.log || function() {};

/**
 * 在console里显示信息
 * @deprecated
 * @returns {undefined}
 */
QZFL.console.print = QZFL.console.log;

//----------------------------------------------

/**
 * 各种功能各异的组件代码
 * @namespace QZFL小组件包
 *
 */
QZFL.widget = {};

//----------------------------------------------

//把QZFL.object下的方式直接映射到QZFL命名空间下
QZFL.object.map(QZFL.object, QZFL);



/////////////
//qzone_config.js
/////////////





/**
 * @author scorr
 */



(function(w){
	QZFL.config = QZFL.config || {};

	var preFix, cw = w;
	do{
		try{
			cw.siDomain && (QZFL.config.resourceDomain = cw.siDomain.replace("http://","").split("/")[0]); // siDomain 是Qzone业务逻辑的全局变量
			cw.imgcacheDomain && (QZFL.config.domain = cw.imgcacheDomain.replace("http://","").split("/")[0]); // siDomain 是Qzone业务逻辑的全局变量
		}catch(err){ //页面跨域就算了
			break;
		}
	}while((cw !== cw.parent) && (cw = cw.parent));
	
	QZFL.config.defaultMediaRate = 2;
})(window);



/////////////
//config.js
/////////////


/**
 * @fileoverview QZFL全局配置文件
 * @version $Rev: 1921 $
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */



/**
 * QZFL配置，用来存储QZFL一些组件需要的参数
 * @namespace QZFL配置
 */
QZFL.config = QZFL.config || {};

/**
 * 调试等级
 * @type number
 * @default 0
 */
(typeof QZFL.config.debugLevel == 'undefined') && (QZFL.config.debugLevel = 0);

/**
 * 默认与后台交互的编码
 *
 * @type string
 * @default "GB2312"
 */
(typeof QZFL.config.defaultDataCharacterSet == 'undefined') && (QZFL.config.defaultDataCharacterSet = "GB2312");

/**
 * dataCenter中cookie存储的默认域名
 *
 * @type string
 * @default "qzone.qq.com"
 */
(typeof QZFL.config.DCCookieDomain == 'undefined') && (QZFL.config.DCCookieDomain = "qzone.qq.com");

/**
 * 系统默认一级域名
 *
 * @type string
 * @default "qq.com"
 */
(typeof QZFL.config.domainPrefix == 'undefined') && (QZFL.config.domainPrefix = "qq.com");

/**
 * 默认主域名
 *
 */
(typeof QZFL.config.domain == 'undefined') && (QZFL.config.domain = "qzs.qq.com");

/**
 * 默认cookie free主域名
 *
 */
(typeof QZFL.config.resourceDomain == 'undefined') && (QZFL.config.resourceDomain = "qzonestyle.gtimg.cn");




/**
 * XHR proxy的gbencoder dictionary路径(需要复写)
 *
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/"
 */
QZFL.config.gbEncoderPath = "http://" + QZFL.config.domain + "/qzone/v5/toolpages/";

/**
 * FormSender的helper page(需要复写)
 *
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/fp_gbk.html"
 */
QZFL.config.FSHelperPage = "http://" + QZFL.config.domain + "/qzone/v5/toolpages/fp_gbk.html";

/**
 * 默认flash ShareObject地址
 * @type string
 * @default "http://qzs.qq.com/qzone/v5/toolpages/getset.swf"
 */
QZFL.config.defaultShareObject = "http://" + QZFL.config.resourceDomain + "/qzone/v5/toolpages/getset.swf";

/**
 * 默认静态页的server地址
 * @type string
 * @default "http://qzs.qq.com/ac/qzone/qzfl/lc/"
 */
QZFL.config.staticServer = "http://" + QZFL.config.resourceDomain + "/ac/qzone/qzfl/lc/";




/////////////
//css.js
/////////////


/**
 * @fileoverview QZFL样式处理,提供多浏览器兼容的样式表处理
 * @version $Rev: 1921 $
 * @author QzoneWebGroup ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */



/**
 * QZFL css 工具包，给浏览器提供基本的样式处理接口
 *
 * @namespace QZFL css 工具包
 */
QZFL.css = {
	/**
	 * 用以匹配样式类名的正则池
	 * @private
	 * @ignore
	 * @type object
	 */
	classFileNameCache: {},

	/**
	 * 获取用以匹配样式类名的正则
	 *
	 * @param {string} className 样式名称
	 * @returns {RegExp} 用以匹配的正则表达式规则
	 * @private
	 * @deprecated 没啥大用
	 *
	getClassRegEx: function(className){
		var o = QZFL.css.classNameCache;
		return o[className] || (o[className] = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'));
	},*/

	/**
	 * 把16进制的颜色转换成10进制颜色的工具
	 * @param {string} color 十六进制颜色文本
	 * @returns {number[]} 返回数组形式的10进制颜色

	 * @example QZFL.css.convertHexColor("#ff00ff") //[255, 0, 255];
	 */
	convertHexColor: function(color){
		color = String(color || '');
		color.charAt(0) == '#' && (color = color.substring(1));
		color.length == 3 && (color = color.replace(/([0-9a-f])/ig, '$1$1'));
		return color.length == 6 ? [parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16)] : [0, 0, 0];
	},

	/**
	 * 从RGB色彩模型到HSL色彩模型的转换算法
	 * @param {number} r 红色值，10进制整数，[0, 255]
	 * @param {number} g 绿色值，10进制整数，[0, 255]
	 * @param {number} b 蓝色值，10进制整数，[0, 255]
	 * @return {object} result.h 是色相值 [0, 360) 度；result.s 是饱和度值[0, 1]；result.l 是亮度值[0, 1]
	 */
	rgb2hsl: function(r, g, b){
		var t
			, red = Math.max(r / 255, 0)
			, green = Math.max(g / 255, 0)
			, blue = Math.max(b / 255, 0)
			, max = Math.max(red, green, blue)
			, min = Math.min(red, green, blue)
			, result = {
					h : 0
					, s : 0
					, l : Math.max((max + min) / 2, 0)
				};
		
		if(max != min){
			if(max == red){
				result.h = (t = 60 * ((green - blue) / (max - min))) < 0 ? (t + 360) : t;
			}else if(max == green){
				result.h = (60 * ((blue - red) / (max - min)) + 120);
			}else if(max == blue){
				result.h = (60 * ((red - green) / (max - min)) + 240);
			}

			if(result.l <= 0.5){
				result.s = (max - min) / (2 * result.l);
			}else if(0.5 < result.l){
				result.s = (max - min) / (2 - 2 * result.l);
			}

			result.h = Math.round(result.h);
			result.s = Math.round(result.s * 100) / 100;
			result.l = Math.round(result.l * 100) / 100;
		}

		return result;
	},


	/**
	 * 缓存当前页面的样式表对象引用的池
	 *
	 * @private
	 * @type object
	 * @deprecated 不要再用了
	 *
	styleSheets: {},*/
	
	/**
	 * 通过id号获取样式表
	 * @param {string|number} id 样式表的编号
	 * @returns {object} 返回样式表对象，没有匹配则为null

	 * @example QZFL.css.getStyleSheetById("div_id");
	 */
	getStyleSheetById: function(id){
		var s;
		return (s = QZFL.dom.get(id)) && s.sheet || (s = document.styleSheets) && s[id];
	},
	
	/**
	 * 获取stylesheet的样式规则
	 * @param {string|number} id 样式表的编号
	 * @example QZFL.css.getRulesBySheet("css_id");
	 * @returns {object} 返回样式表规则集合对象，若未发生匹配则为空对象
	 */
	getRulesBySheet: function(sheetId){
		var ss = typeof(sheetId) == "object" ? sheetId : QZFL.css.getStyleSheetById(sheetId),
			rs = {},
			head,
			base;

		if (ss && !(rs = ss.cssRules || ss.rules)) {
			if (head = document.getElementsByTagName('head')[0]) {
				if (base = head.getElementsByTagName('base')[0]) {
					QZFL.dom.removeElement(base);
					rs = ss.cssRules;
					head.appendChild(base);
				}
			}
		}
		return rs;
	},
	
	/**
	 * 根据选择器获得样式规则
	 * @param {string} sheetId id 样式表的编号
	 * @param {string} selector 选择器名称
	 * @returns {object} 返回匹配到的样式规则对象，未匹配则为null

	 * @example QZFL.css.getRuleBySelector("css_id","#");
	 */
	getRuleBySelector: function(sheetId, selector){
		selector = (String(selector)).toLowerCase();

		var _ss = QZFL.css.getStyleSheetById(sheetId),
			_rs = QZFL.css.getRulesBySheet(_ss);
		
		for (var i = 0, len = _rs.length; i < len; ++i) {
			if (selector == _rs[i].selectorText.toLowerCase()) {
				return _rs[i];
			}
		}
		return null;
	},
	
	/**
	 * 插入外链样式表
	 * @param {string} url 外部css地址
	 * @param {string|object} [opts] 若类型为string则为link Element的ID，若为object则为可选参数包
	 * @param {string} [opts.linkID=undefined] link Element的ID
	 * @param {string} [opts.doc=document] 被插入link节点的文档树根
	 * @param {string} [opts.media="screen"] 样式节点的media种类属性
	 * @returns {object} 返回样式表对象，插入失败返回的是link Element引用

	 * @example
QZFL.css.insertCSSLink("/css/style.css", "myCSS1");
QZFL.css.insertCSSLink("/css/style.css", {
	linkID : "myCSS2",
	doc : frames["innerFrame"].document});
	 */
	insertCSSLink: function(url, opts){
		var sid
			, doc
			, t
			, cssLink
			, head
			;

		if(QZFL.css.classFileNameCache[url]){ return; }

		if(typeof opts == "string"){
			sid = opts;
		}

		opts = (typeof opts == "object") ? opts : {};
		sid = opts.linkID || sid;
		doc = opts.doc || document;

		head = doc.getElementsByTagName("head")[0];
		cssLink = ((t = doc.getElementById(sid)) && (t.nodeName == "LINK")) ? t : null;

		if (!cssLink) {
			cssLink = doc.createElement("link");
			sid && (cssLink.id = sid);
			cssLink.rel = cssLink.rev = "stylesheet";
			cssLink.type = "text/css";
			cssLink.media = opts.media || "screen";
			head.appendChild(cssLink);
		}
		try{
			url && (cssLink.href = url);
		}catch(ign){}

		QZFL.css.classFileNameCache[url] = true;

		return (QZFL.userAgent.ie < 9 && cssLink.sheet) || cssLink; //IE>=9开始支持 .sheet了，和 .styleSheet 相同
	},
		
	/**
	 * 插入页面inline样式块
	 * @param {string} sheetId 样式表style Element的ID
	 * @param {string} [rules=""] 样式表规则内容
	 * @returns {object} 返回样式表style Element对象

	 * @example QZFL.css.insertStyleSheet("cssid", "body {font-size: 75%;}");
	 */
	insertStyleSheet: function(sheetId, rules){
		var node = document.createElement("style");
		node.type = 'text/css';
		sheetId && (node.id = sheetId);
		document.getElementsByTagName("head")[0].appendChild(node);
		if (rules) {
			if (node.styleSheet) {
				node.styleSheet.cssText = rules;
			} else {
				node.appendChild(document.createTextNode(rules));
			}
		}
		return node.sheet || node;
	},
	
	/**
	 * 删除一份样式表，包含内部style和外部css
	 * @param {string|number} id 样式表的编号
	 * @deprecated 实用性不强，不适合在编程框架

	 * @example QZFL.css.removeStyleSheet("styleid");
	 */
	removeStyleSheet: function(id){
		var _ss = QZFL.css.getStyleSheetById(id);
		_ss && QZFL.dom.removeElement(_ss.owningElement || _ss.ownerNode);
	},
	

	//下面很有用的一个正则，先静态化出来
	_reClassToken: /\s+/,

	/**
	 * 操作元素的className的核心方法，也可以直接调用，remove参数支持*通配符
	 * @param {object} elem 被操作的HTMLElement
	 * @param {string} removeNames 要被取消的className们
	 * @param {string} addNames 要被加入的className们
	 * @returns {string} elem被操作后的className，若elem非法则为空串
	 */
	updateClassName: function(elem, removeNames, addNames){
		if (!elem || elem.nodeType != 1) {
			return "";
		}
		var oriName = elem.className,
			_s = QZFL.css,
			ar,
			b; //受否有变化的flag
		if (removeNames && typeof(removeNames) == 'string' || addNames && typeof(addNames) == 'string') {
			if (removeNames == '*') {
				oriName = '';
			} else {
				ar = oriName.split(_s._reClassToken);

				var i = 0,
					l = ar.length,
					n; //临时变量

				oriName = {};
				for (; i < l; ++i) { //将原始的className群结构化为表
					ar[i] && (oriName[ar[i]] = true);
				}
				if (addNames) { //结构化addNames群，将该加入的加入到oriName群
					ar = addNames.split(_s._reClassToken);
					l = ar.length;
					for (i = 0; i < l; ++i) {
						(n = ar[i]) && !oriName[n] && (b = oriName[n] = true);
					}
				}
				if (removeNames) {
					ar = removeNames.split(_s._reClassToken);
					l = ar.length;
					for (i = 0; i < l; i++) {
						(n = ar[i]) && oriName[n] && (b = true) && delete oriName[n];
					}
				}
			}
			if (b) {
				ar.length = 0;
				for (var k in oriName) { //构造结果数组
					ar.push(k);
				}
				oriName = ar.join(' ');
				elem.className = oriName;
			}
		}
		return oriName;
	},
	
	/**
	 * 某HTMLElement是否含有指定的样式类名称
	 * @param {object} elem 指定的HTML元素
	 * @param {string} name 指定的类名称
	 * @returns {boolean} 是否操作成功

	 * @example QZFL.css.hasClassName(document.getElementById("div_id"), "cname");
	 */
	hasClassName: function(elem, name){
		return (elem && name) ?
			(elem.classList ?
				elem.classList.contains(name)
					:
				(name && ((' ' + elem.className + ' ').indexOf(' ' + name + ' ') > -1))
			)
				:
			false;
	},
	
	/**
	 * 增加一组样式类名
	 * @param {object} elem 指定的HTML元素
	 * @param {string} names 指定的类名称
	 * @returns {string} 返回当前className

	 * @example QZFL.css.addClassName(document.getElementById("ele"), "cname imname");
	 */
	addClassName: function(elem, names){
		var _s = QZFL.css;

		return names && ((elem && elem.classList && !_s._reClassToken.test(names)) ? elem.classList.add(names) : _s.updateClassName(elem, null, names));
	},
	
	/**
	 * 除去一组样式类名
	 * @param {object} elem 指定的HTML元素
	 * @param {string} cname 指定的类名称
	 * @returns {string} 返回当前className

	 * @example QZFL.css.removeClassName($("ele"),"cname");
	 */
	removeClassName: function(elem, names){
		var _s = QZFL.css;

		return names && ((elem && elem.classList && !_s._reClassToken.test(names)) ? elem.classList.remove(names) : _s.updateClassName(elem, names));
	},
	
	/**
	 * 替换两种样式类名
	 * @param {object|object[]} elems 指定的HTML元素或者一个HTML元素集合
	 * @param {string} a 指定的类名称
	 * @param {string} b 指定的类名称

	 * @example QZFL.css.replaceClassName($("ele"), "sourceClass", "targetClass");
	 */
	replaceClassName: function(elems, a, b){
		QZFL.css.swapClassName(elems, a, b, true);
	},
	
	/**
	 * 交换两种样式类名
	 * @param {object|object[]} elems 指定的HTML元素或者一个HTML元素集合
	 * @param {string} a 指定的类名称
	 * @param {string} b 指定的类名称
	 * @param {boolean} _isRep 参数a,b是否反向可替换

	 * @example QZFL.css.swapClassName($("div_id"), "classone", "classtwo", true);
	 */
	swapClassName: function(elems, a, b, _isRep){
		if (elems && typeof(elems) == "object") {
			if (elems.length === undefined) {
				elems = [elems];
			}
			for (var elem, i = 0, l = elems.length; i < l; ++i) {
				if ((elem = elems[i]) && elem.nodeType == 1) {
					if (QZFL.css.hasClassName(elem, a)) {
						QZFL.css.updateClassName(elem, a, b);
					} else if (!_isRep && QZFL.css.hasClassName(elem, b)) {
						QZFL.css.updateClassName(elem, b, a);
					}
				}
			}
		}
	},
	
	/**
	 * 开关样式类名，调一次加上，再调一次干掉，或反之
	 * @param {object} elem 指定的HTML元素
	 * @param {string} name 指定的类名称
	 * @returns {undefined}

	 * @example QZFL.css.toggleClassName($("ele"),"cname");
	 */
	toggleClassName: function(elem, name){
		if (!elem || elem.nodeType != 1) {
			return;
		}
		var _s = QZFL.css;
		if(elem.classList && name && !_s._reClassToken.test(name)){
			return elem.classList.toggle(name);
		}
		if (_s.hasClassName(elem, name)) {
			_s.updateClassName(elem, name);
		} else {
			_s.updateClassName(elem, null, name);
		}
	}	
};




/////////////
//dom.js
/////////////


/**
 * @fileoverview QZFL DOM 工具集，包含对浏览器DOM的一些操作
 * @version $Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */


/**
 * QZFL dom 接口封装对象。对浏览器常用的dom对象接口进行浏览器兼容封装
 *
 * @namespace QZFL dom 接口封装对象
 */
QZFL.dom = {
	/**
	 * 根据id获取dom对象
	 *
	 * @param {string} id 对象ID
	 * @returns {object} 指定id的DOM节点，没有找到为null
	 * @example QZFL.dom.getById("div_id");
	 */
	getById : function(id) {
		return document.getElementById(id);
	},

	/**
	 * 根据name获取dom集合，有些标签例如li、span无法通过getElementsByName拿到，加上tagName指明就可以 <br />
	 &lt;li name="n1">node1&lt;/li>&lt;span name="n1">node2&lt;/span>
	 * ie只能获取到li，非ie下两者都可以
	 *
	 * @param {string} name 所需节点的name
	 * @param {string} [tagName=""] 标签名称tagName
	 * @param {object} [rt=undefined] 查找的根对象
	 * @returns {object[]} 匹配到的节点集合

	 * @example QZFL.dom.getByName("div_name");
	 */
	getByName : function(name, tagName, rt) {
		return QZFL.selector((tagName || "") + '[name="' + name + '"]', rt);
	},

	/**
	 * 获得制定节点
	 *
	 * @param {string|object} e 包括id号，或则Html Element对象
	 * @returns {object} 匹配到的节点
	 * @example QZFL.dom.get("div_id");
	 */
	get : function(e) {
		return (typeof(e) == "string") ? document.getElementById(e) : e;
	},

	/**
	 * 获得对象
	 *
	 * @param {string|object} e 包括id号，或则HTML Node对象
	 * @returns {object}
	 * @deprecated <strong style="color:red;">这个太搞笑了，不要再用了</strong>
	 * @example QZFL.dom.getNode("div_id");
	 */
	getNode : function(e) {
		return (e && (e.nodeType || e.item)) ? e : document.getElementById(e);
	},
	/**
	 * 删除节点
	 *
	 * @param {string|object} el HTML元素的id或者HTML元素
	 * @example
QZFL.dom.removeElement("div_id");
QZFL.dom.removeElement(QZFL.dom.get("div_id2"));
	 */
	removeElement : function(elem) {
		if (elem = QZFL.dom.get(elem)) {
			if(QZFL.userAgent.ie > 8 && elem.tagName == "SCRIPT"){
				elem.src = "";
			}
			elem.removeNode ? elem.removeNode(true) : (elem.parentNode && elem.parentNode.removeChild(elem));
		}
		return elem = null;
	},

	/**
	 * 从以某元素开始,对指定元素属性的值使用传入的handler进行判断，handler返回true时查询停止，返回当前元素<br />
	 否则以当前属性值所指的对象为根，递归重新查找，最终返回null
	 * @param {object} elem HTML元素
	 * @param {string} prop 构成链的元素属性名
	 * @param {function} func 检查函数,返回true的时候当前查找终结, func = function(el){}; //传入当前的节点el
	 * @returns {object} 结果对象，无结果时返回null

	 * @example
function getFirstChild(elem){ //获取第一个为HTMLElement的子节点
	elem = QZFL.dom.get(elem);
	return QZFL.dom.searchChain(elem && elem.firstChild, 'nextSibling', function(el){
		return el.nodeType == 1;
	});
}
	 */
	searchChain : function(elem, prop, func){
		prop = prop || 'parentNode';
		while (elem && elem.nodeType && elem.nodeType == 1) {
			if (!func || func.call(elem, elem)) {
				return elem;
			}
			elem = elem[prop];
		}
		return null;
	},

	/**
	 * 通过当前节点不断往父级向上查找，直到找到含有指定className的dom节点
	 *
	 * @param {string|object} el 对象id或则dom
	 * @param {string} className css类名
	 * @deprecated <strong>不建议使用了，请使用 {@link QZFl.element}</strong>
	 * @returns {object} 第一个结果节点
	 */
	searchElementByClassName : function(elem, className){
		elem = QZFL.dom.get(elem);
		return QZFL.dom.searchChain(elem, 'parentNode', function(el){
			return QZFL.css.hasClassName(el, className);
		});
	},
	/**
	 * 获取指定className的所有子节点
	 *
	 * @param {string} className 指定的class值
	 * @param {string} [tagName] 节点名
	 * @param {string|object} context 可能的根对象
	 * @deprecated <strong>不建议使用了，请使用 {@link QZFl.element}</strong>
	 * @returns {object[]} 结果节点集合
	 */
	getElementsByClassName : function(className, tagName, context) {
		return QZFL.selector((tagName || '') + '.' + className, QZFL.dom.get(context));
	},


	/**
	 * 判断指定的节点是否是第二个节点的祖先
	 *
	 * @param {object} a 对象，父节点
	 * @param {object} b 对象，子孙节点
	 * @returns {boolean} true即b是a的子节点，否则为false
	 * @example  QZFL.dom.isAncestor(QZFL.dom.get("div1"), QZFL.dom.get("div2"))
	 */
	isAncestor : function(a, b) {
		return a && b && a != b && QZFL.dom.contains(a, b);
	},



	/**
	 * 根据函数得到特定的父节点
	 *
	 * @param {object|string} node对象或其id
	 * @param {string} method 创建对象的TagName
	 * @returns {object}
	 * @example var node = QZFL.dom.getAncestorBy($("div_id"), "div");
	 */
	getAncestorBy : function(elem, method){
		elem = QZFL.dom.get(elem);
		return QZFL.dom.searchChain(elem.parentNode, 'parentNode', function(el){
			return el.nodeType == 1 && (!method || method(el));
		});
	},


	/**
	 * 得到第一个HTMLElement子节点
	 *
	 * @param {object|string} HTMLElement对象或其id
	 * @returns {object} 结果对象
	 * @example var element = QZFL.dom.getFirstChild("el_id");
	 */
	getFirstChild : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.firstElementChild || QZFL.dom.searchChain(
			elem && elem.firstChild,
			'nextSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},

	/**
	 * 得到最后一个子HTMLElement节点
	 *
	 * @param {object|string} node对象或其id
	 * @returns {object}
	 * @example var element = QZFL.dom.getFirstChild(QZFL.dom.get("el_id"));
	 */
	getLastChild : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.lastElementChild || QZFL.dom.searchChain(
			elem && elem.lastChild,
			'previousSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},


	/**
	 * 得到下一个兄HTMLElement弟节
	 *
	 * @param {string|object} node对象或其id
	 * @returns ｛object}
	 * @example QZFL.dom.getNextSibling("el_id");
	 */
	getNextSibling : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.nextElementSibling || QZFL.dom.searchChain(
			elem && elem.nextSibling,
			'nextSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},
	/**
	 * 得到上一个兄弟HTMLElement节点
	 *
	 * @param {object|string} node对象或其id
	 * @returns {object}
	 * @example QZFL.dom.getPreviousSibling(QZFL.dom.get("el_id"));
	 */
	getPreviousSibling : function(elem){
		elem = QZFL.dom.get(elem);
		return elem.previousElementSibling || QZFL.dom.searchChain(
			elem && elem.previousSibling,
			'previousSibling',
			function(el){
				return el.nodeType == 1;
			}
		);
	},


	/**
	 * 交换两个节点
	 *
	 * @param {object} node1 node对象
	 * @param {object} node2 node对象

	 * @example QZFL.dom.swapNode(QZFL.dom.get("el_one"),QZFL.dom.get("el_two"))
	 */
	swapNode : function(node1, node2) {
		// for ie
		if (node1.swapNode) {
			node1.swapNode(node2);
		} else {
			var prt = node2.parentNode,
				next = node2.nextSibling;

			if (next == node1) {
				prt.insertBefore(node1, node2);
			} else if (node2 == node1.nextSibling) {
				prt.insertBefore(node2, node1);
			} else {
				node1.parentNode.replaceChild(node2, node1);
				prt.insertBefore(node1, next);
			}
		}
	},


	/**
	 * 定点创建Dom对象，一句话把一个节点创建在另一个节点内，有点懒
	 *
	 * @param {string} [tagName='div'] 创建对象的TagName
	 * @param {string|object} [elem=document.body] 容器对象id或则dom
	 * @param {boolean} [insertFirst=false] 是否从前部插入
	 * @param {object} [attrs=undefined] 对象属性列表，例如 {id:"newDom1",style:"color:#000"}

	 * @example QZFL.dom.createElementIn("div",document.body,false,{id:"newDom1",style:"color:#000"})
	 * @returns {object} 返回创建好的dom引用
	 */
	createElementIn : function(tagName, elem, insertFirst, attrs){
		var _e = (elem = QZFL.dom.get(elem) || document.body).ownerDocument.createElement(tagName || "div"), k;
		
		// 设置Element属性
		if (typeof(attrs) == 'object') {
			for (k in attrs) {
				if (k == "class") {
					_e.className = attrs[k];
				} else if (k == "style") {
					_e.style.cssText = attrs[k];
				} else {
					_e[k] = attrs[k];
				}
			}
		}
		insertFirst ? elem.insertBefore(_e, elem.firstChild) : elem.appendChild(_e);
		return _e;
	},


	/**
	 * 获取对象渲染后的样式规则
	 *
	 * @param {string|object} el 对象id或则dom
	 * @param {string} property 样式规则名，请使用js语法，如z-index对应的是zIndex
	 * @example var width=QZFL.dom.getStyle("div_id","width");//width=163px;
	 * @returns {string} 样式值
	 */
	getStyle : function(el, property) {
		el = QZFL.dom.get(el);

		if (!el || el.nodeType == 9) {
			return null;
		}

		var w3cMode = document.defaultView && document.defaultView.getComputedStyle,
			computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, ''),
			value = "";

		switch (property) {
			case "float" :
				property = w3cMode ? "cssFloat" : "styleFloat";
				break;
			case "opacity" :
				if (!w3cMode) { // IE Mode
					var val = 100;
					try {
						val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
					} catch (e) {
						try {
							val = el.filters('alpha').opacity;
						} catch (e) {}
					}
					return val / 100;
				}else{
					return parseFloat((computed || el.style)[property]);
				}
				break;
			case "backgroundPositionX" : // 只有ie和webkit浏览器支持
				// background-position-x
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[0];
				}
				break;
			case "backgroundPositionY" : // 只有ie和webkit浏览器支持
				// background-position-y
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[1];
				}
				break;
		}

		if (w3cMode) {
			return (computed || el.style)[property];
		} else {
			return (el.currentStyle[property] || el.style[property]);
		}
	},

	/**
	 * 设置样式规则
	 *
	 * @param {string|object} el 对象id或则dom
	 * @param {string|object} properties 样式规则表，如{zIndex:10000, height:"200px"}，或单个字符串样式名
	 * @param {string|number} [value] 若上一个参数是字符串形式的样式名，这里给出样式值
	 * @example <pre>
QZFL.dom.setStyle("div_id", "width", "200px");
QZFL.dom.setStyle("div_id", {"width" : "200px", "height" : "300px"});</pre>

	 * @returns {boolean} 成功返回true
	 */
	setStyle : function(el, properties, value) {
	    var DOM = QZFL.dom;
		if (!(el = DOM.get(el)) || el.nodeType != 1) {
			return false;
		}

		var tmp, bRtn = true, re;
		if (typeof(properties) == 'string') {
			tmp = properties;
			properties = {};
			properties[tmp] = value;
		}
		
		for (var prop in properties) {
			value = properties[prop];
			re = DOM.convertStyle(el, prop, value);
			prop = re.prop; value = re.value;
			if (typeof el.style[prop] != "undefined") {
				el.style[prop] = value;
				bRtn = bRtn && true;
			} else {
				bRtn = bRtn && false;
			}
		}
		return bRtn;
	},
	/**
	 * 转换属性和值
	 */
    convertStyle : function(el, prop, value){
        var DOM = QZFL.dom, tmp, rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i, w3cMode;
        w3cMode = ((tmp = document.defaultView) && tmp.getComputedStyle);
        if (prop == 'float') {
            prop = w3cMode ? "cssFloat" : "styleFloat";
        } else if (prop == 'opacity') {
            if (!w3cMode) { // for ie only
                prop = 'filter';
                value = value >= 1 ? '' : ('alpha(opacity=' + Math.round(value * 100) + ')');
            }
        } else if (prop == 'backgroundPositionX' || prop == 'backgroundPositionY') {
            tmp = prop.slice(-1) == 'X' ? 'Y' : 'X';
            if (w3cMode) {
                var v = QZFL.dom.getStyle(el, "backgroundPosition" + tmp);
                prop = 'backgroundPosition';
                typeof(value) == 'number' && (value = value + 'px');
                value = tmp == 'Y' ? (value + " " + (v || "top")) : ((v || 'left') + " " + value);
            }
        }
        value += (typeof value === "number" && !rexclude.test(prop) ? 'px' : '');
        return {
            'prop' : prop,
            'value' : value
        };
	
    },
    

	/**
	 * 建立有name属性的element
	 * 
	 * @param {string} type node的tagName
	 * @param {string} name name属性值
	 * @param {object} [doc=document] 所在文档树
	 * @returns {object} 结果element
	 * @example QZFL.dom.createNamedElement("div","div_name",QZFL.dom.get("doc"));
	 */
	createNamedElement : function(type, name, doc) {
		var _doc = doc || document,
			element;

		try {
			element = _doc.createElement('<' + type + ' name="' + name + '">');
		} catch (ign) {}

		if (!element) {
			element = _doc.createElement(type);
		}

		if (!element.name) {
			element.name = name;
		}
		return element;
	},

	/**
	 * 获取节点矩形说明符
	 * @param {object} elem
	 * @returns {object} 返回位置说明对象 {"top","left","width","height"}
	 */
	getRect : function(elem){
		if (elem = QZFL.dom.get(elem)) {
			var box = QZFL.object.extend({}, elem.getBoundingClientRect());

			if (typeof box.width == 'undefined') {
				box.width = box.right - box.left;
				box.height = box.bottom - box.top;
			}
			return box;
		}
	},

	/**
	 * 获取对象坐标和尺寸
	 *
	 * @param {object} elem
	 * @returns {object} 返回位置说明对象 {"top","left","width","height"};
	 * @example var position = QZFL.dom.getPosition(QZFL.dom.get("div_id"));
	 */
	getPosition : function(elem){
		var box, s, doc;
		if (box = QZFL.dom.getRect(elem)) {
			if (s = QZFL.dom.getScrollLeft(doc = elem.ownerDocument)) {
				box.left += s, box.right += s;
			}
			if (s = QZFL.dom.getScrollTop(doc)) {
				box.top += s, box.bottom += s;
			}
			return box;
		}
	},

	/**
	 * 设置对象坐标和尺寸
	 *
	 * @param {object} el
	 * @param {object} pos 位置和大小描述对象
	 * @example QZFL.dom.setPosition(QZFL.dom.get("div_id"),{"100px","100px","400px","300px"});
	 */
	setPosition : function(el, pos) {
		QZFL.dom.setXY(el, pos['left'], pos['top']);
		QZFL.dom.setSize(el, pos['width'], pos['height']);
	},

	/**
	 * 获取对象坐标
	 *
	 * @param {object} elem
	 * @returns {object} 数组结构 [top值, left值]
	 * @example var xy=QZFL.dom.getXY(QZFL.dom.get("div_id"));
	 */
	getXY : function(elem){
		var box = QZFL.dom.getPosition(elem) || { left: 0, top: 0 };
		return [box.left, box.top];
	},

	/**
	 * 获取对象尺寸
	 *
	 * @param {object} elem
	 * @returns {object} [width值, height值]
	 * @example var size = QZFL.dom.getSize(QZFL.dom.get("div_id"));
	 */
	getSize : function(elem){
		var box = QZFL.dom.getPosition(elem) || { width: -1, height: -1 };
		return [box.width, box.height];
	},

	/**
	 * 设置dom坐标
	 *
	 * @param {object} elem
	 * @param {string|number} x 横坐标
	 * @param {string|number} y 纵坐标
	 * @example QZFL.dom.setXY(QZFL.dom.get("div_id"),400,200);
	 */
	setXY : function(elem, x, y){
		var _ml = parseInt(QZFL.dom.getStyle(elem, "marginLeft")) || 0,
			_mt = parseInt(QZFL.dom.getStyle(elem, "marginTop")) || 0;

		QZFL.dom.setStyle(elem, {
			left: ((parseInt(x, 10) || 0) - _ml) + "px",
			top: ((parseInt(y, 10) || 0) - _mt) + "px"
		});
	},

	/**
	 * 获取对象scrollLeft的值
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getScrollLeft(document);
	 */
	getScrollLeft : function(doc) {
		var _doc = doc || document;
		return (_doc.defaultView && _doc.defaultView.pageXOffset) || Math.max(_doc.documentElement.scrollLeft, _doc.body.scrollLeft);
	},

	/**
	 * 获取对象的scrollTop的值
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getScrollTop(document);
	 */
	getScrollTop : function(doc) {
		var _doc = doc || document;
		return (_doc.defaultView && _doc.defaultView.pageYOffset) || Math.max(_doc.documentElement.scrollTop, _doc.body.scrollTop);
	},

	/**
	 * 获取对象scrollHeight的值
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getScrollHeight(document);
	 */
	getScrollHeight : function(doc) {
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight);
	},

	/**
	 * 获取对象的scrollWidth的值
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getScrollWidht(document);
	 */
	getScrollWidth : function(doc) {
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollWidth, _doc.body.scrollWidth);
	},

	/**
	 * 设置对象scrollLeft的值
	 *
	 * @param {number} value scroll left的修改值
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @example QZFL.dom.setScrollLeft(200,document);
	 */
	setScrollLeft : function(value, doc) {
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollLeft = value;
	},

	/**
	 * 设置对象的scrollTop的值
	 *
	 * @param {number} value scroll top的修改值
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @example QZFL.dom.setScrollTop(200,document);
	 */
	setScrollTop : function(value, doc) {
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollTop = value;
	},

	/**
	 * 获取对象的可视区域高度
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getClientHeight();
	 */
	getClientHeight : function(doc) {
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight : _doc.body.clientHeight;
	},

	/**
	 * 获取对象的可视区域宽度
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {number}
	 * @example QZFL.dom.getClientWidth();
	 */
	getClientWidth : function(doc) {
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
	},
	

	/**
	 * size数值需要用的模式
	 * @private
	 *
	 */
	_SET_SIZE_RE : /^\d+(?:\.\d*)?(px|%|em|in|cm|mm|pc|pt)?$/,

	/**
	 * 设置dom尺寸
	 *
	 * @param {string|object} el 节点ID或者节点本身引用
	 * @param {string|number} width 宽度
	 * @param {string|number} height 高度
	 * @example QZFL.dom.setSize($("abc"), 100, 200);
	 */
	setSize : function(el, w, h){
		el = QZFL.dom.get(el);
		var _r = QZFL.dom._SET_SIZE_RE,
			m;

		QZFL.dom.setStyle(el, "width", (m=_r.exec(w)) ? (m[1] ? w : (parseInt(w,10)+'px')) : 'auto');
		QZFL.dom.setStyle(el, "height",(m=_r.exec(h)) ? (m[1] ? h : (parseInt(h,10)+'px')) : 'auto');
	},


	/**
	 * 获取document的window对象
	 *
	 * @param {object} [doc=document] 所需检查的页面document引用
	 * @returns {object} 返回结果window对象
	 * @example QZFL.dom.getDocumentWindow();
	 */
	getDocumentWindow : function(doc) {
		var _doc = doc || document;
		return _doc.parentWindow || _doc.defaultView;
	},

	/**
	 * 按Tagname获取指定命名空间的节点
	 *
	 * @param {object} [node=document] 所需遍历的根节点
	 * @param {string} ns 命名空间名
	 * @param {string} tgn 标签名
	 * @returns {object} 结果数组
	 * @example QZFL.dom.getElementsByTagNameNS(document, "qz", "div");
	 */
	getElementsByTagNameNS : function(node, ns, tgn) {
		node = node || document;
		var res = [];

		if (node.getElementsByTagNameNS) {
			return node.getElementsByTagName(ns + ":" + tgn);
		} else if (node.getElementsByTagName) {
			var n = document.namespaces;
			if (n.length > 0) {
				var l = node.getElementsByTagName(tgn);
				for (var i = 0, len = l.length; i < len; ++i) {
					if (l[i].scopeName == ns) {
						res.push(l[i]);
					}
				}
			}
		}

		return res;
	},


	/**
	 * 从一个给出节点向上寻找一个tagName相符的节点
	 *
	 * @param {object} elem 给出的节点
	 * @param {string} tn 需要查找的节点tag name
	 * @returns {object} 结果，没找到是null
	 * @example QZFL.dom.getElementByTagNameBubble(QZFL.dom.get("div_id"),"div");
	 */
	getElementByTagNameBubble : function(elem, tn){
		if(!tn){
			return null;
		}
		var maxLv = 15;
		tn = String(tn).toUpperCase();
		if(tn == 'BODY'){
			return document.body;
		}
		elem = QZFL.dom.searchChain(
			elem = QZFL.dom.get(elem),
			'parentNode',
			function(el){
				return el.tagName == tn || el.tagName == 'BODY' || (--maxLv) < 0;
			}
		);
		return !elem || maxLv < 0 ? null : elem;
	},

	/**
	 * 在元素相邻的位置(具体位置可选)插入 html文本  text纯文本  element节点
	 * @param {object} elem 元素引用
	 * @param {number} where 取值0 1 2 3，分别对应：beforeBegin, afterBegin, beforeEnd, afterEnd
	 * @param {object|string} html html文本 或 text普通文本 或 element节点引用
	 * @param {boolean} [isText=false] 当需要插入text时，用此参数区别于html
	 * @returns {boolean} 操作是否成功
	 * @example
QZFL.dom.insertAdjacent($("test"), 1, "world!", true); //0 1 2 3 分别代表：节点外节点前；节点内头部；节点内尾部；节点外节点后
	 */
	insertAdjacent : function(elem, where, html, isText){
		var range,
			pos = ['beforeBegin', 'afterBegin', 'beforeEnd', 'afterEnd'],
			doc;

		if (QZFL.lang.isElement(elem) && pos[where] && (QZFL.lang.isString(html) || QZFL.lang.isElement(html))) {
			if (elem.insertAdjacentHTML && elem.insertAdjacentElement && elem.insertAdjacentText) {
				elem['insertAdjacent' + (typeof(html) == 'object' ? 'Element' : (isText ? 'Text' : 'HTML'))](pos[where], html);
			} else {
				range = (doc = elem.ownerDocument).createRange();
				range[where == 1 || where == 2 ? 'selectNodeContents' : 'selectNode'](elem);
				range.collapse(where < 2);
				range.insertNode(typeof(html) != 'string' ? html : isText ? doc.createTextNode(html) : range.createContextualFragment(html));
			}
			return true;
		}
		return false;
	}
};





/////////////
//event.js
/////////////


/**
 * @fileoverview QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 事件驱动对象，包含许多事件驱动以及绑定等方法,关键
 *
 * @namespace QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 */
QZFL.event = {
	/**
	 * 按键代码映射
	 *
	 * @namespace QZFL.event.KEYS 里面包含了对按键的映射
	 * @type Object
	 */
	KEYS : {
		/**
		 * 退格键
		 */
		BACKSPACE : 8,
		/**
		 * tab
		 */
		TAB : 9,
		RETURN : 13,
		ESC : 27,
		SPACE : 32,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	},
	//这个东东不需要了吧
	/**
	 * 扩展类型，这类事件在绑定的时候允许传参数，并且用来特殊处理一些特别的事件绑定
	 *
	 * @ignore
	 *
	extendType : /(click|mousedown|mouseover|mouseout|mouseup|mousemove|scroll|contextmenu|resize)/i,*/


	/**
	 * 全局事件树
	 * @ignore
	 */
	_eventListDictionary : {},

	/**
	 * @ignore
	 */
	_fnSeqUID : 0,

	/**
	 * @ignore
	 */
	_objSeqUID : 0,

	/**
	 * 事件绑定
	 *
	 * @param {DocumentElement} obj 需要添加事件的页面对象
	 * @param {String} eventType 需要添加的事件
	 * @param {Function} fn 事件需要绑定到的处理函数
	 * @param {Array} argArray 参数数组
	 * @type Boolean
	 * @version 1.1 memory leak optimise by scorr
	 * @author zishunchen
	 * @return 是否绑定成功(true为成功，false为失败)
	 * @example QZFL.event.addEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	addEvent : function(obj, eventType, fn, argArray) {
		var cfn,
			res = false,
			l,
			handlers,
			efn,
			sTime;

		if (!obj) {
			return res;
		}
		if (!obj.eventsListUID) {
			obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
		}

		if (!(l = QZFL.event._eventListDictionary[obj.eventsListUID])) {
			l = QZFL.event._eventListDictionary[obj.eventsListUID] = {};
		}

		if (!fn.__elUID) {
			fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
		}

		//插入ipad设备上mouseover和mouseout的兼容
		if(QZFL.userAgent.isiPad && ((eventType == 'mouseover') || (eventType == 'mouseout'))){
			cfn = function(evt){
				sTime = new Date().getTime();
			}
			l['_'+eventType] = fn;
			if(l._ipadBind){
				return false;
			}
			eventType = 'touchstart';
			l._ipadBind = 1;
			
			efn = function(evt){
				var t = new Date().getTime() - sTime,fn;
				if(t < 700){//mouseover或者out
					fn = l._mouseover;
					if(l._ismouseover){
						fn = l._mouseout;
						l._ismouseover = 0
					}else{
						l._ismouseover = 1;
					}
					QZFL.event.preventDefault(evt);
					return fn && fn.apply(obj, !argArray ? [QZFL.event.getEvent(evt)] : ([QZFL.event.getEvent(evt)]).concat(argArray));
				}//其他的为click
				return true;
			}
			QZFL.event.addEvent(obj, 'touchend', efn);
		}
		//兼容end

		if (!l[eventType]) {
			l[eventType] = {};
		}
		
		if (!l[eventType].handlers) {
            l[eventType].handlers = {};
        }
        handlers = l[eventType].handlers;

		if(typeof(handlers[fn.__elUID]) == 'function'){
			return false;
		}

		cfn = cfn || function(evt) {
				return fn.apply(obj, !argArray ? [QZFL.event.getEvent(evt)] : ([QZFL.event.getEvent(evt)]).concat(argArray));
			};

		if (obj.addEventListener) {
			obj.addEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.attachEvent) {
			res = obj.attachEvent("on" + eventType, cfn);
		} else {
			res = false;
		}
		if (res) {
			handlers[fn.__elUID] = cfn;
		}
		return res;
	},
	/**
	 * 手动触发回调
	 * @param {HTMLElement} obj 触发的节点
	 * @param {String} eventType 事件类型
	 */
	trigger : function(obj, eventType){
		var l = obj && QZFL.event._eventListDictionary[obj.eventsListUID],
			handlers = l && l[eventType] && l[eventType].handlers, i;
		if(handlers){
			try{
				for(i in handlers){
					handlers[i].call(window, {});
				}
			}catch(evt){QZFL.console.print('QZFL.event.trigger error')}
		}
	},
	/**
	 * 方法取消绑定
	 *
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @param {Function} fn 需要取消绑定的函数
	 * @return 是否成功取消(true为成功，false为失败)
	 * @type Boolean
	 * @version 1.1 memory leak optimise by scorr
	 * @author zishunchen
	 * @example QZFL.event.removeEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	removeEvent : function(obj, eventType, fn) {
		var cfn = fn,
			res = false,
			l = QZFL.event._eventListDictionary,
			r;

		if (!obj) {
			return res;
		}
		if (!fn) {
			return QZFL.event.purgeEvent(obj, eventType);
		}

		if (obj.eventsListUID && l[obj.eventsListUID] && l[obj.eventsListUID][eventType]) {
			l = l[obj.eventsListUID][eventType].handlers;
			if(l && l[fn.__elUID]){
				cfn = l[fn.__elUID];
				r = l;
			}
		}

		if (obj.removeEventListener) {
			obj.removeEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.detachEvent) {
			obj.detachEvent("on" + eventType, cfn);
			res = true;
		} else {
			//rt.error("Error.!.");
			return false;
		}
		if (res && r && r[fn.__elUID]) {
			delete r[fn.__elUID];
		}
		return res;
	},

	/**
	 * 取消全部某类型的方法绑定
	 *
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @example QZFL.event.purgeEvent(QZFL.dom.get('demo'),'click');
	 * @return {Boolean} 是否成功取消(true为成功，false为失败)
	 */
	purgeEvent : function(obj, type) {
		var l, h;
		if (obj.eventsListUID && (l = QZFL.event._eventListDictionary[obj.eventsListUID]) && l[type] && (h = l[type].handlers)) {
			for (var k in h) {
				if (obj.removeEventListener) {
					obj.removeEventListener(type, h[k], false);
				} else if (obj.detachEvent) {
					obj.detachEvent('on' + type, h[k]);
				}
			}
		}
		if (obj['on' + type]) {
			obj['on' + type] = null;
		}
		if (h) {
			l[type].handlers = null;
			delete l[type].handlers;
		}
		return true;
	},

	/**
	 * 根据不同浏览器获取对应的Event对象
	 *
	 * @param {Event} evt
	 * @return 修正过的Event对象, 同时返回一个修正button的自定义属性;
	 * @type Event
	 * @example QZFL.event.getEvent();
	 * @return Event
	 */
	getEvent: function(evt) {
		var evt = window.event || evt || null,
			c, _s = QZFL.event.getEvent, ct = 0;

		if(!evt){
			c = arguments.callee;

			while(c && ct < _s.MAX_LEVEL){
				if(c.arguments && (evt = c.arguments[0]) && (typeof(evt.button) != "undefined" && typeof(evt.ctrlKey) != "undefined")){
					break;
				}
				++ct;
				c = c.caller;
			}
		}
		return evt;
	},

	/**
	 * 获得鼠标按键
	 *
	 * @param {Object} evt
	 * @example QZFL.event.getButton(evt);
	 * @return {number} 鼠标按键 -1=无法获取event 0=左键 1= 中键 2= 右键
	 */
	getButton : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (!e) {
			return -1
		}

		if (QZFL.userAgent.ie) {
			return e.button - Math.ceil(e.button / 2);
		} else {
			return e.button;
		}
	},

	/**
	 * 返回事件触发的对象
	 *
	 * @param {Object} evt
	 * @example QZFL.event.getTarget(evt);
	 * @return {object}
	 */
	getTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
			return e.srcElement || e.target;
		} else {
			return null;
		}
	},

	/**
	 * 返回获得焦点的对象
	 *
	 * @param {Object} evt
	 * @example QZFL.event.getCurrentTarget();
	 * @return {object}
	 */
	getCurrentTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
		/**
		 * @default document.activeElement
		 */
			return  e.currentTarget || document.activeElement;
		} else {
			return null;
		}
	},

	/**
	 * 禁止事件冒泡传播
	 *
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.cancelBubble();
	 */
	cancelBubble : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.stopPropagation) {
			evt.stopPropagation();
		} else {
			if (!evt.cancelBubble) {
				evt.cancelBubble = true;
			}
		}
	},

	/**
	 * 取消浏览器的默认事件
	 *
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.preventDefault();
	 */
	preventDefault : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	},

	/**
	 * 获取事件触发时的鼠标位置x
	 *
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseX : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	},

	/**
	 * 获取事件触发时的鼠标位置y
	 *
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseY : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	},

	/**
	 * 获取事件RelatedTarget
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.getRelatedTarget();
	 */
	getRelatedTarget: function(ev) {
		ev = QZFL.event.getEvent(ev);
		var t = ev.relatedTarget;
		if (!t) {
			if (ev.type == "mouseout") {
				t = ev.toElement;
			} else if (ev.type == "mouseover") {
				t = ev.fromElement;
			} else {

			}
		}
		return t;
	},

	/**
	 * 全局页面加载完成后的事件回调
	 * @param {function} fn 回调接口
	 * @deprecated
	 */
	onDomReady:function(fn){
		var _s = QZFL.event.onDomReady;
		QZFL.event._bindReady();
		_s.pool.push(fn);
	},

	_bindReady:function(){
		var _s = QZFL.event.onDomReady;
		if(typeof _s.pool!='undefined'){//已经绑定了监听函数，不用再次绑定
			return;
		}
		_s.pool = _s.pool || [];

		if(document.readyState === "complete"){
			return setTimeout(QZFL.event._readyFn, 1);
		}

		if(document.addEventListener){//Chrome Safari Firefox
			document.addEventListener("DOMContentLoaded",QZFL.event._domReady, false );
			window.addEventListener("load",QZFL.event._readyFn,false);
		}else if(document.attachEvent){//ie
			document.attachEvent("onreadystatechange",QZFL.event._domReady);
			window.attachEvent("onload",QZFL.event._readyFn);
			var toplevel = false;
			try{
				toplevel = window.frameElement == null;
			}catch(e){}
			if(document.documentElement.doScroll && toplevel){
				QZFL.event._ieScrollCheck();
			}
		}
	},

	_readyFn : function(){
		var _s = QZFL.event.onDomReady;
		_s.isReady = true;
		while(_s.pool.length) {
			var fn = _s.pool.shift();
			QZFL.lang.isFunction(fn) && fn();
		}
		_s.pool.length == 0 && (_s._fn = null);
	},

	_domReady : function(){
		if(document.addEventListener){
			document.removeEventListener("DOMContentLoaded",QZFL.event._domReady,false);
			QZFL.event._readyFn();
		}else if(document.attachEvent){
			if(document.readyState === "complete"){
				document.detachEvent( "onreadystatechange",QZFL.event._domReady);
				QZFL.event._readyFn();
			}
		}
	},

	// The DOM ready check for IE
	_ieScrollCheck : function() {
		if(QZFL.event.onDomReady.isReady){
			return;
		}
		try{
			document.documentElement.doScroll("left");
		}catch(e){
			setTimeout(QZFL.event._ieScrollCheck, 1 );
			return;
		}
		QZFL.event._readyFn();
	},
	/**
     * @description 代理事件函数，第一次使用为异步过程
     * @param {HTMLElement} delegateDom 代理节点
     * @param {String} selector 目标选择器
     * @param {String} eventType 事件类型
     * @param {Function} fn 事件函数
     * @param {Array} [argsArray] 参数数组
     * @example
     * QZFL.event.delegate($('container'), '.namecard', 'mouseenter', function(){}); //代理事件
     */
	delegate : function(delegateDom, selector, eventType, fn, argsArray){
	    var path = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/expand/delegate.js?max_age=864000";
	    
        QZFL.imports(path, function(){
            QZFL.event.delegate(delegateDom, selector, eventType, fn, argsArray);
        });
	},
	/**
     * @description 取消事件代理
     * @param {HTMLElement} delegateDom 取消事件代理的节点
     * @param {String} [selector] 选择器
     * @param {String} [eventType] 事件类型
     * @param {Function} [fn] 回调函数
     * @example
     * QZFL.event.undelegate($('container'));  //取消节点的所有delegate事件
     * QZFL.event.undelegate($('container'), 'click'); //取消节点的click delegate事件
     * QZFL.event.undelegate($('container'), '.namecard', 'click', fn); //取消指定的delegate事件
     */
	undelegate : function(delegateDom, selector, eventType, fn){}
};

/**
 * 方法同 QZFL.event.addEvent
 *
 * @see QZFL.event.addEvent
 */
QZFL.event.on = QZFL.event.addEvent;

/**
 * 方法同 QZFL.object.bind
 *
 * @see QZFL.object.bind
 */
QZFL.event.bind = QZFL.object.bind;


/**
 * getEvent方法的最深递归查询层次
 * @ignore
 */
QZFL.event.getEvent.MAX_LEVEL = 10;




/////////////
//queue.js
/////////////


/**
 * @fileoverview QZFL 函数队列系统，可以把一系列函数作为队列并且按顺序执行。在执行过程中函数出现的错误不会影响到下一个队列进程
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 函数队列引擎
 *
 * @param {string} key 队列名称
 * @param {array} queue 队列函数数组
 * @example QZFL.queue("test",[function(){alert(d)},function(){alert(2)}]);
 * QZFL.queue.run("test");
 *
 * @namespace QZFL 队列引擎，给函数提供批量的队列执行方法
 * @return {Queue} 返回队列系统构造对象
 */
QZFL.queue = (function(){
	var _o = QZFL.object;
	var _queue = {};

	var _Queue = function(key,queue){
		if (this instanceof arguments.callee) {
			this._qz_queuekey = key;
			return this;
		}

		if (_o.getType(queue = queue || []) == "array"){
			_queue[key] = queue;
		}

		return new _Queue(key);
	};

	var _extend = /**@lends QZFL.queue*/{
		/**
		 * 往一个队列里插入一个新的函数
		 *
		 * @param {string|function} key 队列名称 当作为构造函数时则只需要直接传
		 * @param {function} fn 可执行的函数
		 * @example QZFL.queue("test");
		 * QZFL.queue.push("test",function(){alert("ok")});
		 * // 或者
		 * QZFL.queue("test").push(function(){alert("ok")});
		 */
		push : function(key,fn){
			fn = this._qz_queuekey?key:fn;
			_queue[this._qz_queuekey || key].push(fn);
		},

		/**
		 * 从队列里去除第一个函数，并且执行一次
		 *
		 * @param {string} key 队列名称
		 * @example	QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.shift("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).shift();
		 * @return 返回第一个队列函数执行的结果
		 */
		shift : function(key) {
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				return QZFL.queue._exec(_q.shift());
			}
		},

		/**
		 * 返回队列长度
		 * @param {string} key 队列名称
		 *
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.getLen("test");
		 *      // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).getLen();
		 *
		 * @return 返回第一个队列函数执行的结果
		 */
		getLen: function(key){
			return _queue[this._qz_queuekey || key].length;
		},

		/**
		 * 执行队列
		 *
		 * @param {string} key 队列名称
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.run("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).run();
		 */
		run : function(key){
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				_o.each(_q,QZFL.queue._exec);
			}
		},

		/**
		 * 分时执行队列
		 *
		 * @param {string} key 队列名称
		 * @param {object} conf 可选参数 默认值为{'run': 100, 'wait': 50};每次运行100ms,暂停50ms再继续运行队列,直至队列为空
		 * @example QZFL.queue("test",[function(){alert("1")},function(){alert("2")},function(){alert("3")}]);
		 * QZFL.queue.timedChunk("test", {'runTime': 1000, 'waitTime': 40, 'onRunEnd': function(){alert('allRuned');}, 'onWait': function(){alert('wait');}});
		 *
		 */
		timedChunk : function(key, conf){
			var _q = _queue[this._qz_queuekey || key], _conf;
			if (_q) {
				//合并用户传入的参数和默认参数
				_conf = QZFL.lang.propertieCopy(conf, QZFL.queue._tcCof, null, true);
				setTimeout(function(){
					var _start = +new Date();
					do {
						QZFL.queue.shift(key);
					} while (QZFL.queue.getLen(key) > 0 && (+new Date() - _start < _conf.runTime));

					if (QZFL.queue.getLen(key) > 0){
						setTimeout(arguments.callee, _conf.waitTime);
						_conf.onWait();
					} else {
						_conf.onRunEnd();
					}
				}, 0);
			}
		},

		/**
		 * 分时执行队列的默认参数
		 *
		 */
		_tcCof : {
				'runTime': 50, //每次队列运行时间
				'waitTime': 25, //暂停时间
				'onRunEnd': QZFL.emptyFn,//队列全部运行完毕触发的事件（只触发一次）
				'onWait': QZFL.emptyFn//每次暂停时触发的事件（触发多次，有可能为零次）
		},

		/**
		 *
		 */
		_exec : function(value,key,source){
			if (!value || _o.getType(value) != "function"){
				if (_o.getType(key) == "number") {
					source[key] = null;
				}
				return false;
			}

			try {
				return value();
			}catch(e){
				QZFL.console.print("QZFL Queue Got An Error: [" + e.name + "]  " + e.message,1)
			}
		}
	};

	_o.extend(_Queue.prototype,_extend);
	_o.extend(_Queue,_extend);

	return _Queue;
})();



/////////////
//string.js
/////////////


/**
 * @fileoverview QZFL String 组件
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 */

/**
 * @namespace QZFL String 封装接口。
 * @type
 */
QZFL.string = {
	RegExps: {
		trim: /^\s+|\s+$/g,
		ltrim: /^\s+/,
		rtrim: /\s+$/,
		nl2br: /\n/g,
		s2nb: /[\x20]{2}/g,
		URIencode: /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,
		escHTML: {
			re_amp: /&/g,
			re_lt : /</g,
			re_gt : />/g,
			re_apos : /\x27/g,
			re_quot : /\x22/g
		},
		
		escString: {
			bsls: /\\/g,
			sls: /\//g,
			nl: /\n/g,
			rt: /\r/g,
			tab: /\t/g
		},
		
		restXHTML: {
			re_amp: /&amp;/g,
			re_lt: /&lt;/g,
			re_gt: /&gt;/g,
			re_apos: /&(?:apos|#0?39);/g,
			re_quot: /&quot;/g
		},
		
		write: /\{(\d{1,2})(?:\:([xodQqb]))?\}/g,
		isURL : /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i,
		cut: /[\x00-\xFF]/,
		
		getRealLen: {
			r0: /[^\x00-\xFF]/g,
			r1: /[\x00-\xFF]/g
		},
		format: /\{([\d\w\.]+)\}/g
	},
	
	/**
	 * 通用替换
	 *
	 * @ignore
	 * @param {string} s 需要进行替换的字符串
	 * @param {String/RegExp} p 要替换的模式的 RegExp 对象
	 * @param {string} r 一个字符串值。规定了替换文本或生成替换文本的函数。
	 * @example
	 * 			QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
	 * @returns {string} 处理结果
	 */
	commonReplace : function(s, p, r) {
		return s.replace(p, r);
	},
	
	/**
	 * 通用系列替换
	 *
	 * @ignore
	 * @param {string} s 需要进行替换的字符串
	 * @param {Object} l RegExp对象hashMap
	 * @example
	 * 			QZFL.string.listReplace(str,regHashmap);
	 * @returns {string} 处理结果
	 */
	listReplace : function(s, l) {
		if (QZFL.lang.isHashMap(l)) {
			for (var i in l) {
				s = QZFL.string.commonReplace(s, l[i], i);
			}
			return s;
		} else {
			return s+'';
		}
	},
	
	/**
	 * 字符串前后去空格
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.trim(str);
	 * @returns {string} 处理结果
	 */
	trim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
	},
	
	/**
	 * 字符串前去空格
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.ltrim(str);
	 * @returns {string} 处理结果
	 */
	ltrim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.ltrim, '');
	},
	
	/**
	 * 字符串后去空格
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.rtrim(str);
	 * @returns {string} 处理结果
	 */
	rtrim: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.rtrim, '');
	},
	
	/**
	 * 制造html中换行符
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.nl2br(str);
	 * @returns {string} 结果
	 */
	nl2br: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.nl2br, '<br />');
	},
	
	/**
	 * 制造html中空格符，爽替换
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.s2nb(str);
	 * @returns {string} 结果
	 */
	s2nb: function(str){
		return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.s2nb, '&nbsp;&nbsp;');
	},
	
	/**
	 * 对非汉字做URIencode
	 *
	 * @param {string} str 目标字符串
	 * @example
	 * 			QZFL.string.URIencode(str);
	 * @returns {string} 结果
	 */
	URIencode: function(str){
		var cc, ccc;
		return (str + "").replace(QZFL.string.RegExps.URIencode, function(a){
			if (a == "\x20") {
				return "+";
			} else if (a == "\x0D") {
				return "";
			}
			cc = a.charCodeAt(0);
			ccc = cc.toString(16);
			return "%" + ((cc < 16) ? ("0" + ccc) : ccc);
		});
	},
	
	/**
	 * htmlEscape
	 *
	 * @param {string} str 目标串
	 * @example
	 * 			QZFL.string.escHTML(str);
	 * @returns {string} 结果
	 */
	escHTML: function(str){
		var t = QZFL.string.RegExps.escHTML;
		return QZFL.string.listReplace((str + ""), {
		/*
		 * '&' must be
		 * escape first
		 */
			'&amp;' : t.re_amp,
			'&lt;' : t.re_lt,
			'&gt;' : t.re_gt,
			'&#039;' : t.re_apos,
			'&quot;' : t.re_quot
		});
	},
	
	/**
	 * CstringEscape
	 *
	 * @param {string} str 目标串
	 * @returns {string} 结果
	 */
	escString: function(str){
		var t = QZFL.string.RegExps.escString,
			h = QZFL.string.RegExps.escHTML;
		return QZFL.string.listReplace((str + ""), {
			/*
			 * '\' must be
			 * escape first
			 */
			'\\\\' : t.bsls,
			'\\n' : t.nl,
			'' : t.rt,
			'\\t' : t.tab,
			'\\/' : t.sls,
			'\\\'' : h.re_apos,
			'\\"' : h.re_quot
		});
	},
	
	/**
	 * htmlEscape还原
	 *
	 * @param {string} str 目标串
	 * @returns {string} 结果
	 *
	restHTML: function(str){
		if (!QZFL.string.restHTML.__utilDiv) {
			/**
			 * 工具DIV
			 *
			 * @ignore
			 *
			QZFL.string.restHTML.__utilDiv = document.createElement("div");
		}
		var t = QZFL.string.restHTML.__utilDiv;
		t.innerHTML = (str + "");
		if (typeof(t.innerText) != 'undefined') {
			return t.innerText;
		} else if (typeof(t.textContent) != 'undefined') {
			return t.textContent;
		} else if (typeof(t.text) != 'undefined') {
			return t.text;
		} else {
			return '';
		}
	},*/
	
	/**
	 * xhtmlEscape还原
	 *
	 * @param {string} str 目标串
	 * @returns {string} 结果
	 */
	restXHTML: function(str){
		var t = QZFL.string.RegExps.restXHTML;
		return QZFL.string.listReplace((str + ""), {
			/*
			 * '&' must be
			 * escape last
			 */
			'<': t.re_lt,
			'>': t.re_gt,
			'\x27': t.re_apos,
			'\x22': t.re_quot,
			'&': t.re_amp
		});
	},
	
	/**
	 * 字符串格式输出工具
	 *
	 * @param {string} 输出模式
	 * @param {Arguments} Arguments... 可变参数，表示模式中占位符处实际要替换的值
	 * @returns {string} 结果字符串
	 */
	write: function(strFormat, someArgs){
		if (arguments.length < 1 || !QZFL.lang.isString(strFormat)) {
			// rt.warn('No patern to write()');
			return '';
		}
		var rArr = QZFL.lang.arg2arr(arguments), result = rArr.shift(), tmp;
		
		return result.replace(QZFL.string.RegExps.write, function(a, b, c){
			b = parseInt(b, 10);
			if (b < 0 || (typeof rArr[b] == 'undefined')) {
				// rt.warn('write() wrong patern:{0:Q}', strFormat);
				return '(n/a)';
			} else {
				if (!c) {
					return rArr[b];
				} else {
					switch (c) {
						case 'x':
							return '0x' + rArr[b].toString(16);
						case 'o':
							return 'o' + rArr[b].toString(8);
						case 'd':
							return rArr[b].toString(10);
						case 'Q':
							return '\x22' + rArr[b].toString(16) + '\x22';
						case 'q':
							return '`' + rArr[b].toString(16) + '\x27';
						case 'b':
							return '<' + !!rArr[b] + '>';
					}
				}
			}
		});
	},
	
	/**
	 * 是否是一个可接受的URL串
	 *
	 * @param {string} s 目标串
	 * @returns {Boolean} 结果
	 */
	isURL: function(s){
		return QZFL.string.RegExps.isURL.test(s);
	},
	
	
	/**
	 * 包装的escape函数 <strong style="color:red;">Deprecated</strong>
	 *
	 * @param {string} s 源字符串
	 * @returns {string} 结果串
	 * @deprecated 最早期为了支持很差浏览器的用法，现在不需要了
	 */
	escapeURI: function(s){
		if (window.encodeURIComponent) {
			return encodeURIComponent(s);
		}
		if (window.escape) {
			return escape(s);
		}
		return '';
	},
	
	/**
	 * 用指定字符补足需要的数字位数
	 *
	 * @param {string} s 源字符串
	 * @param {number} l 长度
	 * @param {string} [ss="0"] 指定字符
	 * @param {boolean} [isBack=false] 补足的方向: true 后方; false 前方;
	 * @returns {string} 返回的结果串
	 */
	fillLength: function(source, l, ch, isRight){
		if ((source = String(source)).length < l) {
			var ar = new Array(l - source.length);
			ar[isRight ? 'unshift' : 'push'](source);
			source = ar.join(ch || '0');
		}
		return source;
	},
	/**
	 * 用制定长度切割给定字符串
	 *
	 * @param {string} s 源字符串
	 * @param {number} bl 期望长度(字节长度)
	 * @param {string} tails 增加在最后的修饰串,比如"..."
	 * @returns {string} 结果串
	 */
	cut: function(str, bitLen, tails){
		str = String(str);
		bitLen -= 0;
		tails = tails || '';
		if (isNaN(bitLen)) {
			return str;
		}
		var len = str.length,
			i = Math.min(Math.floor(bitLen / 2), len),
			cnt = QZFL.string.getRealLen(str.slice(0, i));

		for (; i < len && cnt < bitLen; i++) {
			cnt += 1 + (str.charCodeAt(i) > 255);
		}
		return str.slice(0, cnt > bitLen ? i - 1 : i) + (i < len ? tails : '');
	},
	
	/**
	 * 计算字符串的真实长度
	 *
	 * @param {string} s 源字符串
	 * @param {boolean} [isUTF8=false] 标示是否是utf-8计算
	 * @returns {number} 结果长度
	 */
	getRealLen: function(s, isUTF8){
		if (typeof(s) != 'string') {
			return 0;
		}
		
		if (!isUTF8) {
			return s.replace(QZFL.string.RegExps.getRealLen.r0, "**").length;
		} else {
			var cc = s.replace(QZFL.string.RegExps.getRealLen.r1, "");
			return (s.length - cc.length) + (encodeURI(cc).length / 3);
		}
	},


	format: function(str){
		var args = Array.prototype.slice.call(arguments), v;
		str = String(args.shift());
		if (args.length == 1 && typeof(args[0]) == 'object') {
			args = args[0];
		}
		QZFL.string.RegExps.format.lastIndex = 0;
		return str.replace(QZFL.string.RegExps.format, function(m, n){
			v = QZFL.object.route(args, n);
			return v === undefined ? m : v;
		});
	}
};

/**
 * htmlEscape还原
 * 
 * @deprecated 不要再用了，这里对接的新的实现上
 * @param {string} str 目标串
 * @returns {string} 结果
 */
QZFL.string.restHTML = QZFL.string.restXHTML;





/////////////
//util.js
/////////////


/**
 * @fileoverview QZFL 通用接口核心库
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-05 16:26:13 +0800 (Wed, 05 Aug 2009) $
 */

/**
 * 小工具方法包，一些分类不确定的公共方法
 * @namespace 小工具方法包
 */
QZFL.util = {
	/**
	 * 使用一个uri串制作一个类似location的对象
	 *
	 * @param {string} s 所需字符串
	 * @returns {object} QZFL.util.URI的实例
	 * @see QZFL.util.URI
	 */
	buildUri : function(s) {
		return new QZFL.util.URI(s);
	},

	/**
	 * 使用一个uri串制作一个类似location的对象
	 *
	 * @class URI引擎，可以把一个uri字符串转换成类似location的对象
	 * @constructor
	 * @param {string} s 所需字符串
	 */
	URI : function(s) {		
		if (!(QZFL.object.getType(s) == "string")) {
			return null;
		}
		if (s.indexOf("://") < 1) {
			s = location.protocol + "//" + location.host + (s.indexOf("/") == 0 ? "" : location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)) + s;
		}
		var depart = s.split("://");
		if (QZFL.object.getType(depart) == "array" && depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {

			/**
			 * 协议类型
			 * @field
			 * @type string
			 */
			this.protocol = depart[0].toLowerCase();
			var h = depart[1].split("/");
			if (QZFL.object.getType(h) == "array") {

				/**
				 * 主机描述
				 * @field
				 * @type string
				 */
				this.host = h[0];

				/**
				 * 资源路径
				 * @field
				 * @type string
				 */
				this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, ""); // 修正pathname的返回错误

				/**
				 * 请求URL全描述
				 * @field
				 * @type string
				 */
				this.href = s;
				var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");

				/**
				 * query string
				 * @field
				 * @type string
				 */
				this.search = (se >= 0) ? depart[1].substring(se) : "";

				/**
				 * page fragment anchor
				 * @field
				 * @type string
				 */
				this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
				if (this.search.length > 0 && this.hash.length > 0) {
					if (ha < se) {
						this.search = "";
					} else {
						this.search = depart[1].substring(se, ha);
					}
				}
				return this;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
};



/////////////
//lang.js
/////////////


/**
 * @fileoverview 增强脚本语言处理能力
 * @version 1.$Rev: 1597 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2009-11-30 21:51:19 +0800 (星期一, 30 十一月 2009) $
 */

 /**
 * 环境变量系统
 *
 * @namespace QZFL.lang
 */
QZFL.lang = {
	/**
	 * 是否字符串
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isString(obj);
	 */
	isString : function(o) {
		return QZFL.object.getType(o) == "string";
	},
	/**
	 * 是否数组对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isArray(obj);
	 */
	isArray : function(o) {
		return QZFL.object.getType(o) == "array";
	},
	/**
	 * 是否函数对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isArray(obj);
	 */
	isFunction: function(o) {
		return QZFL.object.getType(o) == "function";
	},
	/**
	 * 是否哈希表结构
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isHashMap(obj);
	 */
	isHashMap : function(o) {
		return QZFL.object.getType(o) == "object";
	},

	/**
	 * 是否Node节点对象
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isNode(obj);
	 */
	isNode : function(o) {
		return o && (typeof(o.nodeName) != 'undefined' || typeof(o.nodeType) != 'undefined');
	},

	/**
	 * 是否Element
	 *
	 * @param {object} o 目标
	 * @returns {boolean} 结果
	 * @example QZFL.lang.isElement(obj);
	 */
	isElement : function(o) {
		 return o && o.nodeType == 1;
	}
};




/////////////
//util_ex.js
/////////////


/**
 * @fileoverview QZFL.util 小工具扩展包
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup ($LastChangedBy: ryanzhao $) - $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */



(function() {
	var evalGlobalCnt = 0,
		runStyleGlobalCnt = 0;
	/**
	 * QZFL.util 工具包扩展
	 * @namespace QZFL.util 命名空间
	 * @name QZFL.util
	 *
	 */
	QZFL.object.extend(QZFL.util, /** @lends QZFL.util */{
		/**
		 * 复制到剪贴板，目前只支持IE 已经将上个版本jolt增加的剪贴板控制去除
		 * @param {string} text 要复制的文本
		 * @returns {boolean} 写入剪贴板是否成功
		 * @deprecated 认为在这里逻辑过多,建议设计统一的widget组件交付各个应用使用
		 * @example QZFL.util.copyToClip(text);
		 */
		copyToClip : function(text) {
			if (QZFL.userAgent.ie) {
				return clipboardData.setData("Text", text);
			} else {
				var o = QZFL.shareObject.getValidSO();
				return o ? o.setClipboard(text) : false;
			}
		},

		/**
		 * 在页面上执行一段js语句文本
		 * 这个是直接在全局部分执行，在js系统的任意部分调用也能保证在全局执行一段脚本
		 * @param {string} js 一段js语句文本
		 * @example QZFL.util.evalGlobal("var t = 1;");
		 */
		evalGlobal : function(js) {
			js = String(js);
			var obj = document.createElement('script'),
				head = document.documentElement || document.getElementsByTagName("head")[0];
			obj.type = 'text/javascript';
			obj.id = "__evalGlobal_" + evalGlobalCnt;
			try {
				obj.innerHTML = js;
			} catch (e) {
				obj.text = js;
			}
			head.insertBefore(obj,head.firstChild);
			evalGlobalCnt++;
			setTimeout(function(){QZFL.dom.removeElement(obj);}, 50);
		},

		/**
		 * 在页面上执行一段css语句文本
		 * @deprecated 专供safari使用
		 * @param {string} st 一段style语句
		 * @example QZFL.util.runStyleGlobal("body { font-size: 12px; }");
		 */
		runStyleGlobal : function(st) {
			if (QZFL.userAgent.safari) {
				var obj = document.createElement('style');
				obj.type = 'text/css';
				obj.id = "__runStyle_" + runStyleGlobalCnt;
				try {
					obj.textContent = st;
				} catch (e) {
					alert(e.message);
				}
				var h = document.getElementsByTagName("head")[0];
				if (h) {
					h.appendChild(obj);
					runStyleGlobalCnt++;
				}
			} else {
			//	rt.warn("plz use runStyleGlobal() in Safari!");
			}
		},

		/**
		 * http参数表对象变为HTTP协议数据串，如：param1=123&amp;param2=456
		 * @param {object} o 用来表示参数列表的hashTable
		 * @returns {string} 结果串
		 * @example QZFL.util.genHttpParamString({"param1":123, "param2":456});
		 */
		genHttpParamString : function(o) {
			return QZFL.util.commonDictionaryJoin(o, null, null, null, window.encodeURIComponent);
		},

		/**
		 * 将一个http参数序列字符串变为表映射对象
		 * @param {string} s 源字符串
		 * @returns {object} 结果
		 * @example QZFL.util.splitHttpParamString("param1=123&param2=456");
		 */
		splitHttpParamString : function(s) {
			return QZFL.util.commonDictionarySplit(s);
		},

		/**
		 * 将一个字典型序列字符串变为映射表对象
		 * @param {string} [s=''] 源字符串
		 * @param {string} [esp='&'] 项分隔符
		 * @param {string} [vq=''] 值封套
		 * @param {string} [eq='='] 等号字符
		 * @returns {object} 结果对象
		 * @example
QZFL.util.commonDictionarySplit(
	'form-data; name="file_upload"; file_name="c:\\data\\data.ini"; ',
	'; ',
	'"',
	'='
);
		 */
		commonDictionarySplit : function(s, esp, vq, eq) {
			var res = {},
				l,
				ks,
				vs,
				t;

			if(!s || typeof(s) != "string"){
				return res;
			}
			if (typeof(esp) != 'string') {
				esp = "&";
			}
			if (typeof(vq) != 'string') {
				vq = "";
			}
			if (typeof(eq) != 'string') {
				eq = "=";
			}

			l = s.split(esp); //a="1=2"tt"&b="2"s=t" -> a="1=2"tt"     b="2"s=t"

			if(l && l.length){
				for(var i = 0, len = l.length; i < len; ++i){
					ks = l[i].split(eq); //a="1=2"tt" -> a    "1    2"tt"
					if(ks.length > 1){
						t = ks.slice(1).join(eq); //"1=2"tt"
						vs = t.split(vq);
						res[ks[0]] = vs.slice(vq.length, vs.length - vq.length).join(vq);
					}else{
						ks[0] && (res[ks[0]] = true); //没有值的时候直接就用true作为值
					}
				}
			}						

			return res;
		},

		/**
		 * 将一个字典型映射表对象变为序列字符串
		 * @param {object} [o={}] 源映射对象
		 * @param {string} [esp='&'] 项分隔符
		 * @param {string} [vq=''] 值封套
		 * @param {string} [eq='='] 等号字符
		 * @param {function} [valueHandler=QZFL.emptyFn] 处理值的方法引用
		 * @returns {string} 结果串
		 * @example
QZFL.util.commonDictionaryJoin(
	{
		'form-data' : true,
		'name' : 'file_upload',
		'file_name' : 'c:\\data\\data.ini'
	}
	'; ',
	'"',
	'='
); //form-data="true"; name="file_upload"; file_name="c:\\data\\data.ini"
		 */
		commonDictionaryJoin : function(o, esp, vq, eq, valueHandler) {
			var res = [],
				t;

			if(!o || typeof(o) != "object"){
				return '';
			}
			if(typeof(o) == "string"){
				return o;
			}
			if (typeof(esp) != 'string') {
				esp = "&";
			}
			if (typeof(vq) != 'string') {
				vq = "";
			}
			if (typeof(eq) != 'string') {
				eq = "=";
			}

			for(var k in o){
				res.push(k + eq + vq + (typeof valueHandler == 'function' ? valueHandler(o[k]) : o[k]) + vq);
			}

			return res.join(esp);
		}

	});

})();




/////////////
//lang_ex.js
/////////////


/**
 * @fileoverview 增强脚本语言处理能力
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 是否是有效的xml数据对象
 *
 * @param {object} o xmldom对象
 * @returns {boolean} 结果
 * @example QZFL.lang.isValidXMLdom(obj);
 */
QZFL.lang.isValidXMLdom = function(o) {
	return !!(o && o.xml && /^<\?xml/.test(o.xml)); //ryan
};

/**
 * 将arguments对象转化为真数组
 *
 * @param {object} refArgs 对一个arguments对象的引用
 * @param {number} [start=0] 起始偏移量
 * @returns {object} 结果数组
 * @example QZFL.lang.arg2arr(obj, 1); //从第二个参数开始转化
 */
QZFL.lang.arg2arr = function(refArgs, start) {
	return Array.prototype.slice.call(refArgs, (start || 0));
};

/**
 * 以window为根,获取指定命名描述的值
 *
 * @param {string} ns 描述, 如: QZFL.foo.bar
 * @param {boolean} [setup=false] 不存在则创建
 * @example QZFL.lang.getObjByNameSpace("QZFL.foo.bar", true);
 * @returns {string|number|function|object|undefined} 获取到得值
 */
QZFL.lang.getObjByNameSpace = function(ns, setup) {
	if (typeof(ns) != 'string') {
		return ns;
	}
	var l = ns.split("."),
		r = window;

	try {
		for (var i = 0, len = l.length; i < len; ++i) {
			if(typeof(r[l[i]]) == 'undefined'){
				if(setup){
					r[l[i]] = {};
				}else{
					return;
				}
			}
			r = r[l[i]];
		}
		return r;
	} catch (ignore) {
		return;
	}
};

/**
 * JSON数据深度复制
 *
 * @param {string|number|function|object|undefined} obj 需要复制的JSON数据根部
 * @param {String} preventName 需要过滤的字段
 * @returns {string|number|function|object|undefined} 复制出的新JSON数据
 * @example QZFL.lang.objectClone(re, "msg");
 */
QZFL.lang.objectClone = function(obj, preventName) {
	if ((typeof obj) == 'object') {
		var res = (QZFL.lang.isArray(obj)) ? [] : {};
		for (var i in obj) {
			if (i != preventName)
				res[i] = QZFL.lang.objectClone(obj[i], preventName);
		}
		return res;
	} else if ((typeof obj) == 'function') {
		return Object;
	}
	return obj;
};


/**
 * JS Object convert to String
 * @param {string|number|function|object|undefined} obj
 * @returns {string} result
 * @example QZFL.lang.obj2str(obj);
 */
QZFL.lang.obj2str = function(obj) {
	var t, sw;

	if (typeof(obj) == 'object') {
		if(obj === null){ return 'null'; }

		if(window.JSON && window.JSON.stringify){
			return JSON.stringify(obj);
		}

		sw = QZFL.lang.isArray(obj);
		t = [];
		for (var i in obj) {
			t.push((sw ? "" : ("\"" + QZFL.string.escString(i) + "\":")) + obj2str(obj[i]));
		}
		t = t.join();
		return sw ? ("["+t+"]") : ("{"+t+"}");
	} else if (typeof(obj) == 'undefined') {
		return 'undefined';
	} else if (typeof(obj) == 'number' || typeof(obj) == 'function') {
		return obj.toString();
	}
	return !obj ? "\"\"" : ("\"" + QZFL.string.escString(obj) + "\"");
};

/**
 * 对象成员复制(浅表复制)
 *
 * @param {object} s 复制的目标对象
 * @param {object} b 复制的源对象
 * @param {object} [propertiSet] 所需要的属性名称集合
 * @param {boolean} [notOverWrite=false] 不复写
 * @returns {object} 目标对象
 * @example QZFL.lang.propertieCopy(objt, objs, parray, false);
 */
QZFL.lang.propertieCopy = function(s, b, propertiSet, notOverWrite) {
	// 如果propertiSet == null 或者 != Object，则使用b。
	var l = (!propertiSet || typeof(propertiSet) != 'object') ? b : propertiSet;

	s = s || {};

	for (var p in l) {
		if (!notOverWrite || !(p in s)) {
			s[p] = l[p];
		}
	}

	return s;
};

/**
 * 顺序执行一系列方法，得到第一个成功执行的结果
 *
 * @param {function} arguments... 可变参数，一系列函数执行
 * @returns {string|number|function|object|undefined} 执行结果
 * @example QZFL.lang.tryThese(functionOne, functionTwo, functionThree);
 */
QZFL.lang.tryThese = function(){
	for (var i = 0, len = arguments.length; i < len; ++i) {
		try {
			return arguments[i]();
		} catch (ign) {}
	}
	return;
};

/**
 * 将两个执行过程连接起来，注意，连接后不可再分开，且执行过程用Boolean型数据标识是否成功执行
 *
 * @param {function} u 要先执行的过程
 * @param {function} v 后执行的过程
 * @returns {function} 连接后的执行过程
 * @example QZFL.lang.chain(functionOne, functionTwo);
 */
QZFL.lang.chain = function(u, v) {
	var calls = QZFL.lang.arg2arr(arguments);
	return function() {
		for (var i = 0, len = calls.length; i < len; ++i) {
			if (calls[i] && calls[i].apply(null, arguments) === false) {
				return false;
			}
		}
		return true;
	};
};

/**
 * 去除数组中重复的元素
 *
 * @param {object} arr 源数组
 * @returns {object} 去除重复元素后的数组
 * @example QZFL.lang.uniqueArray(arr);
 */
QZFL.lang.uniqueArray = function(arr) {
	if(!QZFL.lang.isArray(arr)){ return arr; }
	var flag = {},index = 0;
	while (index < arr.length) {
		if (flag[arr[index]] == typeof(arr[index])) {
			arr.splice(index, 1);
			continue;
		}
		flag[arr[index].toString()] = typeof(arr[index]);
		++index;
	}

	return arr;
};





/////////////
//env.js
/////////////


/**
 * @fileoverview 封闭静态类ENV,管理环境变量
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 环境变量系统
 *
 * @namespace QZFL.enviroment
 */
QZFL.enviroment = (function() {
	var _p = {},
		hookPool = {};

	/**
	 * 获取指定的环境变量
	 *
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {All} 存储在环境变量中的数据
	 * @example
	 * 			QZFL.enviroment.envGet(kname);
	 */
	function envGet(kname) {
		return _p[kname];
	}

	/**
	 * 删除指定的环境变量
	 *
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {Boolean} 是否删除成功
	 * @example
	 * 			QZFL.enviroment.envDel(kname);
	 */
	function envDel(kname) {
		delete _p[kname];
		return true;
	}

	/**
	 * 以指定名称设置环境变量
	 *
	 * @ignore
	 * @param {String} kname 名称
	 * @param {All} value 值
	 * @return {Boolean} 是否成功
	 * @example
	 * 			QZFL.enviroment.envSet(kname,value);
	 */
	function envSet(kname, value) {
		if (typeof value == 'undefined') {
			if (typeof kname == 'undefined') {
				return false;
			} else if (!(_p[kname] === undefined)) {
				return false;
			}
		} else {
			_p[kname] = value;
			return true;
		}
	}

	return {
		/**
		 * 获取指定的环境变量
		 *
		 * @param {String} kname 指定的环境变量名称
		 * @return {All} 存储在环境变量中的数据
		 * @memberOf QZFL.enviroment
		 */
		get : envGet,
		/**
		 * 以指定名称设置环境变量
		 *
		 * @param {String} kname 名称
		 * @param {All} value 值
		 * @return {Boolean} 是否成功
		 * @memberOf QZFL.enviroment
		 */
		set : envSet,
		/**
		 * 删除指定的环境变量
		 *
		 * @param {String} kname 指定的环境变量名称
		 * @return {Boolean} 是否删除成功
		 * @memberOf QZFL.enviroment
		 */
		del : envDel,
		/**
		 * 事件钩子存放根
		 *
		 * @type {Object}
		 * @memberOf QZFL.enviroment
		 */
		hookPool : hookPool
	};
})();

/**
 * 页面级别事件处理
 *
 * @namespace QZFL.pageEvents
 * @example
 * 		QZFL.pageEvents.pageBaseInit();
 *		QZFL.pageEvents.onloadRegister(init);
 */
QZFL.pageEvents = (function() {
	/**
	 * 将queryString解析到环境变量
	 *
	 * @ignore
	 */
	function _ihp() {
		var qs = location.search.substring(1),
			qh = location.hash.substring(1),
			s, h, n;

		ENV.set("_queryString", qs);
		ENV.set("_queryHash", qh);
		ENV.set("queryString", s = QZFL.util.splitHttpParamString(qs));
		ENV.set("queryHash", h = QZFL.util.splitHttpParamString(qh));

		//为QZFL设置调试级别
		if(s && s.DEBUG){
			n = parseInt(s.DEBUG, 10);
			if (!isNaN(n)) {
				QZFL.config.debugLevel = n;
			}
		}

	}

	/**
	 * 页面启动器
	 *
	 * @ignore
	 */
	function _bootStrap() {
		if(QZFL.event.onDomReady.isReady){
			setTimeout(_onloadHook,1);
		}else if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", _onloadHook, true);
		} else {
			var src = (window.location.protocol == 'https:') ? '//:' : 'javascript:void(0)';
			document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.pageEvents._onloadHook();}" defer="defer" src="' + src + '"><\/script\>');
		}

		window.onload = QZFL.lang.chain(window.onload, function() {
			_onloadHook();
			_runHooks('onafterloadhooks');
		});
		/**
		 * 页面的onbeforeunload侦听
		 *
		 * @ignore
		 */
		window.onbeforeunload = function() {
			return _runHooks('onbeforeunloadhooks');
		};
		window.onunload = QZFL.lang.chain(window.onunload, function() {
			_runHooks('onunloadhooks');
		});
	}

	/**
	 * 执行所有page onload方法,并且置标志
	 */
	function _onloadHook() {
		_runHooks('onloadhooks');
		QZFL.enviroment.loaded = true;
		QZFL.event.onDomReady.isReady = true;
	}

	/**
	 * 执行一个挂钩方法
	 *
	 * @param {Function} handler 指定的挂钩方法
	 */
	function _runHook(handler) {
		try {
			handler();
		} catch (ex) {
		}
	}

	/**
	 * 执行所有指定名称的挂钩程序
	 *
	 * @param {Object} hooks 挂钩名称
	 */
	function _runHooks(hooks) {
		if(!window.ENV){
			return;
		}
		var isbeforeunload = (hooks == 'onbeforeunloadhooks'),
			warn = null,
			hc = window.ENV.hookPool;

		do {
			var h = hc[hooks];
			if (!isbeforeunload) {
				hc[hooks] = null;
			}
			if (!h) {
				break;
			}
			for (var ii = 0; ii < h.length; ii++) {
				if (isbeforeunload) {
					warn = warn || h[ii]();
				} else {
					h[ii]();
				}
			}
			if (isbeforeunload) {
				break;
			}
		} while (hc[hooks]);

		if (isbeforeunload) {
			if (warn) {
				return warn;
			} else {
				QZFL.enviroment.loaded = false;
			}
		}
	}

	/**
	 * 增加事件挂钩
	 *
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 */
	function _addHook(hooks, handler) {
		var c = window.ENV.hookPool;
		(c[hooks] ? c[hooks] : (c[hooks] = [])).push(handler);
	}

	/**
	 * 插入事件挂钩
	 *
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 * @param {Number} position 目标位置
	 */
	function _insertHook(hooks, handler, position) {
		var c = window.ENV.hookPool;
		if (typeof(position) == 'number' && position >= 0) {
			if(!c[hooks]){
				c[hooks] = [];
			}
			c[hooks].splice(position, 0, handler);
		} else {
			return false;
		}
	}

	/**
	 * 页面onload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onload方法引用
	 */
	function _lr(handler) {
		QZFL.enviroment.loaded ? _runHook(handler) : _addHook('onloadhooks', handler);
	}

	/**
	 * 页面onbeforeunload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onbeforeunload方法引用
	 */
	function _bulr(handler) {
		_addHook('onbeforeunloadhooks', handler);
	}

	/**
	 * 页面onunload方法注册
	 *
	 * @param {Function} handler 需要注册的页面onunload方法引用
	 */
	function _ulr(handler) {
		_addHook('onunloadhooks', handler);
	}

	/**
	 * 页面初始化过程
	 */
	function pinit() {
		_bootStrap();
		_ihp();

		/**
		 * 错误输出
		 */
		var _dt;
		if (_dt = document.getElementById("__DEBUG_out")) {
			ENV.set("dout", _dt);
		}

		/**
		 * alert方法重定义
		 */
		var __dalert;
		if (!ENV.get("alertConverted")) {
			__dalert = alert;
			eval('var alert=function(msg){if(msg!=undefined){__dalert(msg);return msg;}}');// sds
			// 这里以后可以考虑更复杂的重定向
			ENV.set("alertConverted", true);
		}

		var t = ENV.get("queryHash");
		if(t && t.DEBUG){
			QZFL.config.debugLevel = 2;
		}
	}

	return {
		onloadRegister : _lr,
		onbeforeunloadRegister : _bulr,
		onunloadRegister : _ulr,
		initHttpParams : _ihp,
		bootstrapEventHandlers : _bootStrap,
		_onloadHook : _onloadHook,
		insertHooktoHooksQueue : _insertHook,
		pageBaseInit : pinit
	};
})();




/////////////
//string_ex.js
/////////////


/**
 * @fileOverview QZFL.string扩展包组件
 * @version $Rev: 1921 $
 * @author QzoneWebGroup - ($LastChangedBy: ryanzhao $) - ($Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $)
 */


/**
 * 内涵各种字符串处理类工具接口
 * @namespace QZFL.string名字空间
 * @name QZFL.string
 */
QZFL.string = QZONE.string || {};


/**
 * 尝试解析一段文本为XML DOM节点
 * @memberOf QZFL.string
 * @param {string} text 待解析的文本
 * @returns {object} 返回结果,失败是null,成功是documentElement
 */
QZFL.string.parseXML = function(text) {
	var doc;
	if (window.ActiveXObject) {
		doc = QZFL.lang.tryThese(function(){
			return new ActiveXObject('MSXML2.DOMDocument.6.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.5.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.4.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument.3.0');
		}, function(){
			return new ActiveXObject('MSXML2.DOMDocument');
		}, function(){
			return new ActiveXObject('Microsoft.XMLDOM');
		});

		doc.async = "false";
		doc.loadXML(text);
		if (doc.parseError.reason) {
			// rt.error(doc.parseError.reason);
			return null;
		}
	} else {
		var parser = new DOMParser();
		doc = parser.parseFromString(text, "text/xml");
		if (doc.documentElement.nodeName == 'parsererror') {
			return null;
		}
	}
	return doc.documentElement;
};



/**
 * 格式化输出时间工具
 * @param {number|object} date 毫秒数描述的绝对是间值 / Date对象引用
 * @param {string} [ptn=undefined] <strong style="color:green;">若不给此参数，则进入自动相对时间模式</strong><br /><br />
 格式说明串<br />
 {y}两位年<br />
 {Y}四位年<br />
 {M}月<br />
 {d}日期<br />
 {h}小时<br />
 {m}分钟数<br />
 {s}秒数
 {_Y}相对年差数<br />
 {_M}相对月差数<br />
 {_d}相对日期差数<br />
 {_h}相对小时差数<br />
 {_m}相对分钟差数<br />
 {_s}相对秒差数
 * @param {object} [baseTime=new Date()] 相对时间基准对象
 * @returns {string} 格式输出的文本

 * @example
var d0 = new Date(2011, 1, 26, 23, 4, 50),
	d1 = new Date(2011, 2, 5, 23, 4, 50);

function layout(){
	document.write(Array.prototype.join.apply(arguments, ['&lt;br />']));
}

layout(
	QZFL.string.timeFormatString(d1), //10天前   其实是相对于当前时间的智能偏移提示
	QZFL.string.timeFormatString(d1, void(0), d0), //7天前
	QZFL.string.timeFormatString(d1, "{h}时{m}分{s}秒"), //23时04分50秒 
	QZFL.string.timeFormatString(d1, "{_s}分钟前", d0) //604800分钟前 
);

 */
QZFL.string.timeFormatString = function(date, ptn, baseTime){
	try{
		date = date.getTime ? date : (new Date(date));
	}catch(ign){
		return '';
	}
	
	var me = QZFL.string.timeFormatString,
		map = me._map,
		unt = me._units,
		rel = false,
		t,
		delta,
		v;

	if(!ptn){
		baseTime = baseTime || new Date();

		delta = Math.abs(date - baseTime);
		for(var i = 0, len = unt.length; i < len; ++i){
			t = map[unt[i]];
			if(delta > t[1]){
				return Math.floor(delta / t[1]) + t[2];
			}
		}
		return "刚刚";
	}else{
		return ptn.replace(me._re, function(a, b, c){
				(rel = b.charAt(0) == '_') && (b = b.charAt(1));
				if(!map[b]){
					return a;
				}
				if (!rel) {
					v = date[map[b][0]]();
					b == 'y' && (v %= 100);
					b == 'M' && v++;
					return v < 10 ? QZFL.string.fillLength(v, 2, c) : v.toString();
				} else {
					return Math.floor(Math.abs(date - baseTime) / map[b][1]);
				}
			});
	}
};
QZFL.string.timeFormatString._re = /\{([_yYMdhms]{1,2})(?:\:([\d\w\s]))?\}/g;
QZFL.string.timeFormatString._map = {	//sds 不要更改
	y: ['getYear', 31104000000],
	Y: ['getFullYear', 31104000000, '\u5E74\u524D'],
	M: ['getMonth', 2592000000, '\u4E2A\u6708\u524D'],
	d: ['getDate', 86400000, '\u5929\u524D'],
	h: ['getHours', 3600000, '\u5C0F\u65F6\u524D'],
	m: ['getMinutes', 60000, '\u5206\u949F\u524D'],
	s: ['getSeconds', 1000, '\u79D2\u524D']
};
QZFL.string.timeFormatString._units = [	//sds 不要更改
	'Y', 'M', 'd', 'h', 'm', 's'
];

/**
 * 字符串连加器 deprecated
 *
 * @class 字符串连加器
 * @constructor
 * @deprecated <strong style="color:red;">这个对象和数组连接没什么区别，建议以后不要使用了</strong>
 */
QZFL.string.StringBuilder = function() {
	this._strList = QZFL.lang.arg2arr(arguments);
};

QZFL.string.StringBuilder.prototype = {
	/**
	 * 在尾部增加一段字符串
	 *
	 * @param {string} str 需要加入的字符串
	 */
	append : function(str) {
		this._strList.push(String(str));
	},

	/**
	 * 在最前追加一段字符串
	 *
	 * @param {string} str 需要加入的字符串
	 */
	insertFirst : function(str) {
		this._strList.unshift(String(str));
	},

	/**
	 * 增加一系列字符串
	 *
	 * @param {string[]} arr 需要加入的字符串数组
	 */
	appendArray : function(arr) {
		this._strList = this._strList.concat(arr);
	},

	/**
	 * 系列化方法实现
	 *
	 * @param {string} [spliter=""] 用来分割字符组的符号
	 * @returns {string} 字符串连加器结果
	 */
	toString : function(spliter) {
		return this._strList.join(spliter || '');
	},

	/**
	 * 清空
	 */
	clear : function() {
		this._strList.splice(0, this._strList.length);
	}
};




/////////////
//sizzle_selector_engine_1.5.1.js
/////////////


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/,
	tmpVar,
	rSpeedUp = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)|^(\w+)\.([\w\-]+$)/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector,
		speedUpMatch;

	//sds speed up
	if ( !contextXML ) {
		//rSpeedUp.exec( "" ); //sds: do I need it ?
		speedUpMatch = rSpeedUp.exec( selector );

		if(speedUpMatch){//if(window.dbg){debugger}
			if ( context.nodeType === 1 || context.nodeType === 9 ) {
				// Speed-up: Sizzle("TAG")
				if ( speedUpMatch[1] ) {
					return makeArray( context.getElementsByTagName( selector ), results );
				
				// Speed-up: Sizzle(".CLASS") or Sizzle("TAG.CLASS")
				//} else if ( speedUpMatch[2] && Expr.find.CLASS ) {
				} else if ( speedUpMatch[2] || (speedUpMatch[4] && speedUpMatch[5]) ) {
					if(context.getElementsByClassName && speedUpMatch[2]){
						return makeArray( context.getElementsByClassName( speedUpMatch[2] ), results );
					}else{
						var suElems = context.getElementsByTagName(speedUpMatch[4] || '*'),
							suResBuff = [],
							suIt,
							suCN = ' ' + (speedUpMatch[2] || speedUpMatch[5]) + ' ';
						for(var sui = 0, sulen = suElems.length; sui < sulen; ++sui){
							suIt = suElems[sui];
							((' ' + suIt.className + ' ').indexOf(suCN) > -1) && suResBuff.push(suIt);
						}

						return makeArray( suResBuff, results );
					}
				}
			}

			if ( context.nodeType === 9 ) {
				// Speed-up: Sizzle("body")
				// The body element only exists once, optimize finding it
				if ( (selector === "body" || selector.toLowerCase() === "body") && context.body ) {
					return makeArray( [ context.body ], results );
					
				// Speed-up: Sizzle("#ID")
				} else if ( speedUpMatch[3] ) {
					return (tmpVar = context.getElementById( speedUpMatch[3] )) ? makeArray( [ tmpVar ], results ) : makeArray( [], results );

				//sds: no need, too much!
				/*	var suElem = context.getElementById( speedUpMatch[3] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( suElem && suElem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( suElem.id === speedUpMatch[3] ) {
							return makeArray( [ suElem ], results );
						}
						
					} else {
						return makeArray( [], results );
					} */
				}
			}
		}

	}//sds speed up end

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr
	= Sizzle.selectors
	= {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};


//----------------------------------------just a check-----------------------------------

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

//---------------------------------helper defined-------------------------------------

/**
 * @ignore
 */
var sortOrder,
	siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};


//--------------------------------------just a test-------------------------------------------

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();


//------------------------------------------just a test------------------------------------

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();


//----------------------------------------------querySelectorAll support--------------------------------

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
		//	div = document.createElement("div"),
			id = "__sizzle__";

		//div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.

		//sds appended: 这个明明safari最新版本已经fix了，不要再放这个恶心东东了
		/*if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}*/
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = rSpeedUp.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		//div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();


//sds: remove this closure, too much!
//(function(){
//	var div = document.createElement("div");

//	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	//sds: removed, too much
	/*if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}*/

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	//sds: removed, too much
	/*div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}*/
	
Expr.order.splice(1, 0, "CLASS");
Expr.find.CLASS = function( match, context, isXML ) {
	if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
		return context.getElementsByClassName(match[1]);
	}
};

	// release memory in IE
//	div = null;
//})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}


if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) { //sds hacked
		if(a !== b && a.contains && b.contains){
			return a.contains(b);
		}else if(!b || b.nodeType == 9){
			return false;
		}else if(b === a){
			return true;
		}else{
			return Sizzle.contains(a, b.parentNode);
		}
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
QZFL.selector = window.Sizzle = Sizzle;
QZFL.object.makeArray = QZFL.dom.collection2Array = makeArray;
QZFL.dom.uniqueSort = Sizzle.uniqueSort;
QZFL.dom.contains = Sizzle.contains;


})();




/////////////
//element.js
/////////////


/**
 * @fileoverview QZFL Element对象
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

;
(function() {
	/**
	 * QZFL Element 控制器,通常不要请自传入非string参数
	 *
	 * @param {string|elements} selector selector查询语句,或则一组elements对象
	 * @param {element} context element查询位置
	 * @class QZFL Element 控制器,通常不要请自传入非string参数
	 * @constructor
	 */
	var _handler = QZFL.ElementHandler = function(selector, context){
		/**
		 * 查询到的对象数组
		 *
		 * @type array
		 */
		this.elements = null;
		
		/**
		 * 用来做一个标示区分
		 *
		 * @ignore
		 */
		this._isElementHandler = true;
		
		this._init(selector, context);
		
	};
	/** @lends QZFL.ElementHandler.prototype */
	_handler.prototype = {
		/**
		 * 初始化 elementHandler对象
		 * @private
		 * @param {Object} selector
		 * @param {Object} context
		 */
		_init: function(selector, context){
			if (QZFL.lang.isString(selector)) {
				this.elements = QZFL.selector(selector, context);
			} else if (selector instanceof QZFL.ElementHandler) {
				this.elements = selector.elements.slice();
			} else if (QZFL.lang.isArray(selector)) {
				this.elements = selector;
			} else if (selector && ((selector.nodeType && selector.nodeType !== 3 && selector.nodeType !== 8) || selector.setTimeout)) {
				this.elements = [selector];
			} else {
				this.elements = [];
			}
		},
		/**
		 * 查找 elements 对象
		 *
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").findElements("li");
		 * @return {Array} elements 数组
		 */
		findElements: function(selector){
			var _pushstack = [],_s;
			this.each(function(el){
				_s = QZFL.selector(selector, el);
				if (_s.length > 0) {
					_pushstack = _pushstack.concat(_s);
				}
			});
			return _pushstack;
		},

		/**
		 * 查找 elements ,并且创建QZFL Elements 对象.
		 *
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").find("li");
		 * @return {QZFL.ElementHandler}
		 */
		find: function(selector){
			return _el.get(this.findElements(selector));
		},
		filter: function(expr, elems, not){
			if (not) {
				expr = ":not(" + expr + ")";
			}
			return _el.get(QZFL.selector.matches(expr, elems||this.elements));
		},
		/**
		 * 循环执行elements对象
		 *
		 * @param {function} fn 批量执行的操作
		 *            @example
		 *            $e("div").each(function(n){alert("hello!" + n)});
		 */
		each: function(fn){
			QZFL.object.each(this.elements, fn);
			return this;
		},

		/**
		 * 和其他 Element Handler 或 elements Array 合并
		 *
		 * @param {QZFL.ElementHandler|Array} elements Element Handler对象或则
		 *            Element 数组集合
		 *            @example
		 *            $e("div").concat($e("p"))
		 * @return {QZFL.ElementHandler}
		 */
		concat: function(elements){
			return _el.get(this.elements.concat(!!elements._isElementHandler ? elements.elements : elements));
		},

		/**
		 * 通过 index 获取其中一个 Element Handler
		 *
		 * @param {number} index 索引
		 * @return {QZFL.ElementHandler}
		 */
		get: function(index){
			return _el.get(this.elements[index]);
		},
		/**
		 * 取index元素
		 */
		eq: function(index){
			return this.elements[index || 0];
		},
		/**
		 * 含意同Array.prorotype.slice
		 * @param {number} index 索引
		 * @return {QZFL.ElementHandler}
		 */
		slice: function(){
			return _el.get(Array.prototype.slice.apply(this.elements, arguments));
		}
	};
	/**
	 * QZFL Element对象.
	 *
	 * @namespace QZFL element 对象的前端控制器
	 * @requires QZFL.selector
	 * @type Object
	 */
	var _el = QZFL.element = {
		/**
		 * 获取 element 对象
		 *
		 * @param {string} selector selector查询语句
		 *            @example
		 *            QZFL.element.get("div")
		 * @param {element} context element查询位置
		 * @see QZFL.ElementHandler
		 * @return QZFL.ElementHandler
		 */
		get : function(selector, context) {
			return new _handler(selector, context);
		},

		/**
		 * 扩展 QZFL elements Handler 对象接口
		 *
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extend({show:function(){}})
		 */
		extend : function(object) {
			QZFL.object.extend(_handler, object);
		},

		/**
		 * 扩展 QZFL elements Handler 构造函数接口
		 *
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extendFn({show:function(){}})
		 */
		extendFn : function(object) {
			QZFL.object.extend(_handler.prototype, object);
		},

		/**
		 * 返回 QZFL Elements 对象的版本
		 *
		 * @return {string}
		 */
		getVersion : function() {
			return _handler.version;
		}
	}
})();


// 扩展 QZFL Element 接口
QZFL.element.extend(/** @lends QZFL.ElementHandler */
{
	/**
	 * QZFL Element 版本
	 *
	 * @type String

	 */
	version : "1.0"
});

// Extend Events
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * 绑定事件
	 *
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").bind("click",function(){});
	 * @param {object - Array} argArr 传入事件侦听器的参数列表
	 */
	bind : function(evtType, fn, argArr) {
		if(typeof(fn)!='function'){
			return false;
		}
		return this.each(function(el) {
			QZFL.event.addEvent(el, evtType, fn, argArr);
		});
	},

	/**
	 * 取消事件绑定
	 *
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").unBind("click",function(){});
	 */
	unBind : function(evtType, fn) {
		return this.each(function(el) {
			QZFL.event[fn ? 'removeEvent' : 'purgeEvent'](el, evtType, fn);
		});
	},
	/**
	 * @param {} fn
	 */
	onHover : function(fnOver,fnOut) {
		this.onMouseOver( fnOver);
		return this.onMouseOut( fnOut);
	},
	onMouseEnter:function(fn){
		return this.bind('mouseover',function(evt){
			var rel = QZFL.event.getRelatedTarget(evt); // fromElement
			if(QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this,rel)){
				fn.call(this,evt);
			}
		});
	},
	onMouseLeave:function(fn){
		return this.bind('mouseout',function(evt){
			var rel = QZFL.event.getRelatedTarget(evt); // toElement
			if(QZFL.lang.isFunction(fn) && !QZFL.dom.isAncestor(this,rel)){
				fn.call(this,evt);
			}
		});
	},
	delegate:function(selector, eventType, fn, argsArray){
	    if(typeof(fn) != 'function'){
            return false;
        }
	    return this.each(function(el) {
            QZFL.event.delegate(el, selector, eventType, fn, argsArray);
        });
	},
	undelegate:function(selector, eventType, fn){
	    return this.each(function(el){
            QZFL.event.undelegate(el, selector, eventType, fn);
        });
	}
});
QZFL.object.each(['onClick', 'onMouseDown', 'onMouseUp', 'onMouseOver', 'onMouseMove', 'onMouseOut', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyPress', 'onKeyUp'], function(name, index){
	QZFL.ElementHandler.prototype[name] = function(fn){
		return this.bind(name.slice(2).toLowerCase(), fn);
	};
});
// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * 设置 dom 的html代码
	 *
	 * @param {string} value
	 */
	setHtml : function(value) {
		return this.setAttr("innerHTML", value);
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getHtml : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? _e.innerHTML : null;
	},

	/**
	 * @param {string} value
	 */
	setVal : function(value) {
		if (QZFL.object.getType(value) == "array") {
			var _v = "\x00" + value.join("\x00") + "\x00";
			this.each(function(el) {
				if (/radio|checkbox/.test(el.type)) {
					el.checked = el.nodeType && ("\x00" + _v.indexOf(el.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + el.name.toString() + "\x00") > -1);
				} else if (el.tagName == "SELECT") {
					//el.selectedIndex = -1;
					QZFL.object.each(el.options, function(e) {
						e.selected = e.nodeType == 1 && ("\x00" + _v.indexOf(e.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + e.text.toString() + "\x00") > -1);
					});
				} else {
					el.value = value;
				}
			})

		} else {
			this.setAttr("value", value);
		}
		return this;
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getVal : function(/* @default 0 */index) {
		var _e = this.elements[index || 0],_v;

		if (_e) {
			if (_e.tagName == "SELECT"){
				_v = [];
				if (_e.selectedIndex<0) {
					return null;
				}

				//如果是单选框
				if (_e.type == "select-one") {
					_v.push(_e.value);
				}else{
					QZFL.object.each(_e.options,function(e){
						if (e.nodeType == 1 && e.selected) {
							_v.push(e.value);
						}
					});
				}
			}else{
				_v = _e.value;
			}
		} else {
			return null
		}
		return _v;
	},

	/**
	 * @param {} className
	 */
	hasClass : function(className) {
		if(this.elements && this.elements.length){
			return QZFL.css.hasClassName(this.elements[0], className);
		}
		return false;
	},

	/**
	 * @param {} className
	 */
	addClass : function(className) {
		return this.each(function(el) {
			QZFL.css.addClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	removeClass : function(className) {
		return this.each(function(el) {
			QZFL.css.removeClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	toggleClass : function(className) {
		return this.each(function(el) {
			QZFL.css.toggleClassName(el, className);
		})
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getSize : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getSize(_e) : null;
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getXY : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getXY(_e) : null;
	},

	/**
	 * @param {} width
	 * @param {} height
	 */
	setSize : function(width, height) {
		return this.each(function(el) {
			QZFL.dom.setSize(el, width, height);
		})
	},

	/**
	 * @param {} X
	 * @param {} Y
	 */
	setXY : function(X, Y) {
		return this.each(function(el) {
			QZFL.dom.setXY(el, X, Y);
		})
	},

	/**
	 *
	 */
	hide : function() {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, "display", "none");
		})
	},

	/**
	 *
	 */
	show : function(isBlock) {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, "display", isBlock?'block':'');
		})
	},

	/**
	 * @param {} key
	 * @return {}
	 */
	getStyle : function(key, index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getStyle(_e, key) : null;
	},

	/**
	 * @param {} key
	 * @param {} value
	 */
	setStyle : function(key, value) {
		return this.each(function(el) {
			QZFL.dom.setStyle(el, key, value);
		})
	},
	/**
	 * 设置dom的属性
	 *
	 * @param {string} key 属性名称
	 * @param {string} value 属性
	 */
	setAttr : function(key, value) {
		key = (key=="class"?"className":key);

		return this.each(function(el) {
			el[key] = value;
		});
	},

	/**
	 * 获取dom对象的属性
	 */
	getAttr : function(key, index) {
		key = key == "class" ? "className" : key;
		var node = this.elements[index || 0];
		return node ? (node[key] === undefined ? node.getAttribute(key) : node[key]) : null;
	}
});

// Extend Element relation
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * @return {}
	 */
	getPrev : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getPreviousSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getNext : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getNextSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getChildren : function() {
		var _arr = [];
		this.each(function(el) {
			var node = QZFL.dom.getFirstChild(el);
			while (node) {
				if (!!node && node.nodeType == 1) {
					_arr.push(node);
				}
				node = node.nextSibling;
			}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getParent : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = el.parentNode;
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	}
});

// Extend
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * @param {} tagName
	 * @param {} attributes
	 * @return {}
	 */
	create : function(tagName, attributes) {
		var _arr = [];
		this.each(function(el) {
			_arr.push(QZFL.dom.createElementIn(tagName, el, false, attributes));
		});
		return QZFL.element.get(_arr);
	},

	/**
	 * @param {} el
	 */
	appendTo : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el);
		return this.each(function(element) {
			el.appendChild(element)
		});
	},

	/**
	 * @param {} el
	 */
	insertAfter : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _ns = el.nextSibling, _p = el.parentNode;
		return this.each(function(element) {
			_p[!_ns ? "appendChild" : "insertBefore"](element, _ns);
		});

	},

	/**
	 * @param {} el
	 */
	insertBefore : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _p = el.parentNode;
		return this.each(function(element) {
			_p.insertBefore(element, el)
		});
	},

	/**
	 *
	 */
	remove : function() {
		return this.each(function(el) {
			QZFL.dom.removeElement(el);
		})
	}
});




/////////////
//effect.js
/////////////


/**
 * QZFL基础动画类
 * @author joltwang
 * @version 1.0.0.1
 * @date 2013.3.12 
 * @edit by hank
 * @example 更多示例请看src目录里的examples
 */
QZFL.effect = {
	/**
      * 动画基础方法，对传入的多css属性值进行动画变化，对于支持css3的浏览器采用css3 transform，对于不支持css3的其他浏览器采用timer计算关键帧
      * 来改变元素css属性值。
      * @param elem [string or object] 需要动画处理的dom
      * @param prop [object] 传入需要修改的css属性，如{opacity: 0.25,left: '+=50',width: '+=150',height: '+=100'}
      * @param opts [object] 配置信息，如动画执行时间，执行完回调函数{duration:1000, complete:callbackFun}
      * @example 
      * QZFL.effect.run($('demo'), {
    	  opacity: 0,
    	  top:'100',
          width: '+=150',
          height: '+=100'
        }, {
        	duration : 1000,
            complete : function(){},
            change : QZFL.emptyFn,
            start : QZFL.emptyFn
      });
      */
    off : 0,  //是否关闭动画
    mode : [], //模式 css3 or ''
    init : function(){  //初始化事件类型的浏览器支持度
        var classArray = [
            ['webkit', 'WebkitTransition'],
            ['firefox', 'MozTransition'],
            ['opera', 'OTransition'],
            ['ie', 'msTransition']
        ],
        ua = QZFL.userAgent, agent = '', cName = '';
        //内存回收吧,一次性函数
        for(var i = 0, len = classArray.length; i < len; i++){
            if(ua[classArray[i][0]]){
                agent = classArray[i][0];
                cName = classArray[i][1];
                break;
            }
        }
        return QZFL.effect.mode = ((cName in document.documentElement.style) ?
            [agent, 'css3'] : 
            [agent]);
            //仅一个变量就好了isCSSTransition
    },
	run : function(elem, prop, opts){
        var o = QZFL.effect,
            tid = ++o._uniqueID,
            fpropArray,
            fprop, qDom;
            
        if(!elem){
            return;
        }
        if(!o.mode[0]){ //仅初始化一次
            o.init();
        }
		opts = o._opt(opts);
		opts.start();//执行开始时回调
		
		elem = QZFL.dom.get(elem);
		//解析属性
		fpropArray = o._prop(prop,elem);
		fprop = fpropArray[0];
		
		elem._tid = tid;
		
		if(o.off){
		    qDom = QZFL.dom;
		    for(var i in fpropArray[1]){
		        qDom.setStyle(elem, i, fpropArray[1][i]);
		    }
		    window.setTimeout(opts.complete, opts.duration);
		}else{
		    var t = new QZFL.tweenMaker(0, 100, opts.duration, opts.interval, opts);
            //对于纯css3动画，且没有change回调的，是不是不用tweenMaker?
            t.onStart = (o.mode[1]=='css3') ? function(){
                o._tweenArray[tid] = t;
                (new QZFL.cssTransfrom(elem,fprop,opts)).firecss();
            } : function(){
                o._tweenArray[tid] = t;
            };
            t.onChange = (o.mode[1]!='css3') ? function(p){ //不用每次运行时来判断mode
                o.drawStyle(fprop,p,elem);
                opts.change(p);
            } : function(p){
                opts.change(p);
            };
            
            t.onEnd = function(){
                if(o.mode[1]!='css3'){
                    opts.complete();
                }
                delete o._tweenArray[elem._tid];
            };
            //TODO 这个地方改成加到一个队列里面去
            t.start();
		}
 	},
 	/**
 	 * 获取动画进行的百分比
 	 * @param [object] elem 动画关联的元素
 	 */
 	getPercent : function(elem){
 		var elem = QZFL.dom.get(elem), tid = elem._tid,t = QZFL.effect._tweenArray[tid];
 		return t.getPercent();
 	},
 	
 	/**
 	 * 停止动画,直接到最终状态
 	 * @param [object] elem 动画关联的元素
 	 */
 	stop: function(elem){
 		var es = QZFL.effect, webkit = (es.mode[1]=='css3'), o;
 		elem = QZFL.dom.get(elem);
 		if(webkit){
 			(o = elem._transition) && o.stop();   
 		}else{
			var tid = elem._tid,t = es._tweenArray[tid];
			t && t.stop();
 		}
 		return es;
	},
 	
 	drawStyle : function(prop, p, elem){
 	    var DOM = QZFL.dom, tmp, cssText = '', re, S = QZFL.string;
 		p*=0.01;
    	QZFL.object.each(prop,function(f, pname){
    		var s = f.start, e = f.end, u = f.unit;
    		v = e>=s?((e-s)*p+s):(s-(s-e)*p);
    		re = DOM.convertStyle(elem, pname, v+u);
    		cssText += (S.reCamelCase(re.prop) + ':' + re.value + ';');
        });
        //统一帧的处理
        elem.style.cssText += (';' + cssText);
    },
 	
 	_tweenArray : {},
    _uniqueID: 0,
	
	_opt : function(opts){
		var opt = opts,o = QZFL.effect;
		opt.duration = opts.duration || 500;
		opt.easing = opts.easing || 'ease';
		opt.complete = opts.complete || QZFL.emptyFn;
		opt.interval = opts.interval || 16;
		opt.start = opts.start || QZFL.emptyFn;
		opt.change = opts.change || QZFL.emptyFn;
		
		return opt;
	},
	
	_prop : function(prop,elem){
        var fprop = {},es = QZFL.effect,webkit = (es.mode[1]=='css3'),endCSSMap = {};
        //遍历每个属性
        QZFL.object.each(prop, function(val, pname){
        	pname = QZFL.string.camelCase(pname);
        	if(QZFL.object.getType(val) == "object"){
        		var f = es._cssValue(elem,val.value,pname);
        		endCSSMap[pname] = (val.value = f.end + (f.unit?f.unit:0));
        		if(webkit){
        			fprop[pname] = val;
        		}else{
        			fprop[pname] = f;
        		}
        	}else{
        		var d = es._cssValue(elem,val,pname),tmp;
        		endCSSMap[pname] = (tmp = d.end + (d.unit?d.unit:0));
        		if(webkit){
        			d =  tmp; 
        		}
        		fprop[pname] = d;
        	}
        });
        
        return [fprop, endCSSMap];
    },
    
    /**
     * 计算某个动画元素上的起始值及单位
     */
    _cssValue : function(elem, val, name){
		var fnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
			fprop = {},
			parts = fnum.exec(val+''),
			o = QZFL.effect,
			start = o._cur(elem,name);//修正开始时的位置

        if(parts){ //如果是+= or -=
            var end = parseFloat(parts[2]),
            	unit = parts[3]||(o._cssNumber[name] ? "" : "px");
            	
            if(unit !== "px"){//单位不是px的
                QZFL.dom.setStyle(elem, name, (end || 1) + unit);
                start = ((end || 1) / o._cur(elem,name)) * start;
                QZFL.dom.setStyle(elem, name, start + unit);
            }
            if(parts[1]){
                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
            }
            fprop = {start : start,end : end,unit:unit};
        }else{
            fprop = {start : start,end : val,unit:''};
        }
        
        return fprop;
    },
    
    _cssNumber : {"zIndex": true,"fontWeight": true,"opacity": true,"zoom": true,"lineHeight": true},
	
	_cur : function(elem,p) {
		var parsed, r = QZFL.dom.getStyle(elem,p);
		if(elem!=null && elem[p] != null && (!elem.style || elem.style[p] == null)){
			return elem[p];
		}
		return isNaN(parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
	},
	/**
     * 显示函数
     * @param {HTMLElement} elem
     * @param {Object|Number} [opts] 和effect.run的opts保持一致 或者 duration
     * @param {Function} [cb] 回调函数
     * @examples 
     * QZFL.effect.show(elem, 1000, function(){});
     * QZFL.effect.show(elem, {duration:1000, complete:function(){}});
     */
	show : function(elem, opts, cb){
        var d = QZFL.dom, duration, startCb;
        elem = d.get(elem);
        opts = opts || {};
        duration = ((typeof(opts) == 'number') ? opts : opts.duration);
        startCb = opts.start || QZFL.emptyFn;
        QZFL.effect.run(elem, {
          opacity: 1
        }, QZFL.object.extend(opts, {
            duration : duration || 1000,
            start : function(){
                d.setStyle(elem,'opacity',0);
                d.setStyle(elem,'display','');
                startCb();
            },
            complete : cb
        }));
    },
    /**
     * 隐藏函数
     * @param {HTMLElement} elem
     * @param {Object|Number} [opts] 和effect.run的opts保持一致 或者 duration
     * @param {Function} [cb] 回调函数
     * @examples 
     * QZFL.effect.hide(elem, 1000, function(){});
     * QZFL.effect.hide(elem, {duration:1000, complete:function(){}});
     */
    hide : function(elem, opts, cb){
        var d = QZFL.dom, duration;
        elem = d.get(elem);
        opts = opts || {};
        duration = ((typeof(opts) == 'number') ? opts : opts.duration);
        cb = cb || opts.complete || QZFL.emptyFn;
        QZFL.effect.run(elem, {
          opacity: 0
        }, QZFL.object.extend(opts, {
            duration : duration || 1000,
            complete : function(){
                d.setStyle(elem,'display','none');
                d.setStyle(elem,'opacity',1);
                cb();
            }
        }));
    },
    /**
     * 显示和隐藏切换函数
     * @param {HTMLElement} elem
     * @param {Object|Number} [opts] 和effect.run的opts保持一致 或者 duration
     * @param {Function} [cb] 回调函数
     * @examples 
     * QZFL.effect.toggle(elem, 1000, function(){});
     * QZFL.effect.toggle(elem, {duration:1000, complete:function(){}});
     */
    toggle : function(elem, opts, cb){
        var o = QZFL.effect;
        opts = opts || {};
        if(o._isHidden(elem)){
            o.stop(elem).show(elem, opts, cb);
        }else{
            o.stop(elem).hide(elem, opts, cb);
        }
    },
    /**
     * 展开元素
     * @param {HTMLElement} elem 动画元素
     * @param {Object} opts 参数列表，和effect.run的opts保持一致
     */
    slideDown : function(elem, opts){
        var d = QZFL.dom,
            attrs,
            o = QZFL.effect,
            toValue = {},
            _obj = QZFL.object,
            duration, start, complete;
        elem = d.get(elem);
        attrs = o._checkVerticalStyle(elem, {status:'down'});
        opts = opts || {};
        
        if(attrs){
            duration = ((typeof(opts) == 'number') ? opts : opts.duration);
            start = opts.start || QZFL.emptyFn;
            complete = opts.complete || QZFL.emptyFn;
            o.run(elem, attrs, _obj.extend(opts, {
                duration : duration||1000,
                start : function(){
                    if(attrs && !opts.noClear){
                        _obj.each(attrs, function(v, i){
                            d.setStyle(elem, i, '0px');
                        });
                    }
                    d.setStyle(elem,'display','');
                    start();
                },
                complete : function(){
                    complete();
                    //清除状态
                    o._checkVerticalStyle(elem, {clear:1}); 
                }
            }));
        }
    },
    /**
     * 折叠元素
     * @param {HTMLElement} elem 动画元素
     * @param {Object} opts 参数列表，和effect.run的opts保持一致
     */
    slideUp : function(elem, opts){
        var d = QZFL.dom,
            attrs,
            o = QZFL.effect,
            toValue = {},
            _obj = QZFL.object,
            duration,
            complete;
        elem = d.get(elem);
        
        attrs = o._checkVerticalStyle(elem, {status:'up'});
        if(attrs){
            _obj.each(attrs, function(v, i){
                toValue[i] = '0px';
            });
            opts = opts || {};
            duration = ((typeof(opts) == 'number') ? opts : opts.duration);
            complete = opts.complete || QZFL.emptyFn;
            //展示
            d.setStyle(elem,'display','');
            o.run(elem, toValue, _obj.extend(opts, {
                duration : duration||1000,
                complete : function(){
                    d.setStyle(elem,'display','none');
                    //然后还原height padding margin
                    _obj.each(attrs, function(v, i){
                        d.setStyle(elem, i, v); 
                    });
                    //清除toggle状态
                    o._checkVerticalStyle(elem, {clear:1});
                    complete();
                }
            }));
        }
    },
    _slideArray : {},
    /**
     * 切换slide
     * @param {HTMLElement} elem 动画元素
     * @param {Object} opts 参数列表，和effect.run的opts保持一致
     */
    slideToggle : function(elem, opts){
        var o = QZFL.effect, status, opts = opts || {};
        if(o._isHidden(elem)){ //初始状态，决定要展开还是拉起
            o.stop(elem).slideDown(elem, opts);
        }else{
            if(elem._slideid){ //如果在toggle运动中
                status = o._slideArray[elem._slideid].status;
                if(status == 'up'){
                    opts.noClear = 1;
                    o._slideArray[elem._slideid].status = 'down';
                    o.stop(elem).slideDown(elem, opts);
                }else if(status == 'down'){
                    o._slideArray[elem._slideid].status = 'up';
                    o.stop(elem).slideUp(elem, opts);
                }
            }else{
                o.stop(elem).slideUp(elem, opts);
            }
        }
    },
    /**
     * 检查垂直的属性
     */
    _checkVerticalStyle : function(elem, opts){
        var name = ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'height'],
            obj = {},
            D = QZFL.dom, re, o = QZFL.effect;
        if(opts.clear){ //清除数据
            if(o._slideArray[elem._slideid]){
                delete o._slideArray[elem._slideid];
                delete elem._slideid;
            }
            return null;
        }
        if(!elem._slideid){
            elem._slideid = ++o._uniqueID;
        }
        if(!(re = o._slideArray[elem._slideid])){
            //当竖向的属性都不为0是才取
            QZFL.object.each(name, function(v){
                 var val = parseInt(D.getStyle(elem, v), 10);
                 if(val){
                     obj[v] = val;
                     re = 1;
                 }
            });
            o._slideArray[elem._slideid] = {
                pps : obj,
                status : opts.status
            };
        }else{
            obj = re.pps;
        }
        //如果_slideArray中有elem的缓存数据，那么返回缓存或者数据
        return re ? obj : null;
    },
    _isHidden : function(elem){
        return QZFL.dom.getStyle(elem, 'display') == 'none';
    }
};

/**
 * 制造动画的类
 * @param [number] startvalue 开始值
 * @param [number] endvalue 结束值
 * @param [float] duration 持续时间
 * @param [number] interval 每个时间片的时间
 * @param [object] opt 可传入functor来作为算子
 */
QZFL.tweenMaker = function(startvalue,endvalue,duration,interval,opt){
	var o = this, opt = opt || {}, easing;
    o.duration = duration || 500;
    o.interval = interval || 16;
    o.startValue = startvalue;
    o.endValue = endvalue;
//  o.count = Math.ceil(o.duration/o.interval); //无用参数
//  o.elapse = 0; //无用参数
    easing = opt.easing || 'ease';
    o.functor = (typeof(opt.functor) == 'function' ? opt.functor : (o.functors[easing] || o.functors['ease']));

    o.onStart = o.onChange = o.onEnd = QZFL.emptyFn;
    o.playing = false;

    o.changeValue = o.endValue - o.startValue;
	o.currentValue = 0;
	/**动画器
	var proto = QZFL.tweenMaker.prototype;
	if(!proto.animator){
	    proto.animator = new Animator();
	}*/
};

QZFL.tweenMaker.prototype = {
    functors : {
        //time, startValue, changeValue, duration
        //default，因为css3中是不对称的变速，暂时只能用这个模拟
        'ease' : function(t, s, c, d){ //3次方的缓动
            if ((t/=d/2) < 1) return c/2*t*t*t + s;
            return c/2*((t-=2)*t*t + 2) + s;
        },
        'linear' : function(t, s, c, d){
            return c * t / d + s;
        },
        'ease-in' : function(t, s, c, d){
            return c*(t/=d)*t*t + s;
        },
        'ease-out' : function(t, s, c, d){
            return c*((t=t/d-1)*t*t + 1) + s;
        },
        'ease-in-out' : function(t, s, c, d){
            if ((t/=d/2) < 1) return c/2*t*t*t + s;
            return c/2*((t-=2)*t*t + 2) + s;
        }
    },
	//开始动画
    start : function(){
    	var o = this/*, a = this.animator*/;
        o.playing = true;
        o._startTime = new Date().getTime();
        o.onStart.apply(o);
		//o._runTimer();
    },

    _runTimer : function(){
        var o = this;
        if(o.playing){
            o._playTimer();
            setTimeout(function(){
                o._runTimer.apply(o,[]);
            }, o.interval);
        }
    },

    _playTimer: function (time) {
        var _end = false, o = this, time = (new Date().getTime() - o._startTime);
        if (time > o.duration) {
            time = o.duration;
            _end = true;
        }
        o.currentValue = o.functor(time, o.startValue, o.changeValue, o.duration);
        o.onChange.apply(o, [o.getPercent()]);
        // 判断是否播放结束
        if (_end) {
            o.playing = false;
            o.onEnd.apply(this);

            // 播放完成强迫IE回收内存
            if (window.CollectGarbage){
                CollectGarbage();
            }
        }
    },

    stop : function(){
        this.playing = false;
//      this.currentValue = this.endValue;
    },
	
	//获取百分比
    getPercent : function(){
        return (this.currentValue - this.startValue)/this.changeValue * 100;
    }
};
/**
 * css3 transfrom[css3模式]，供QZFL.effect使用，不单独调用
 */
QZFL.cssTransfrom = function(elem, prop, opts){
	var o = this;
	o._elem = elem;
	//这里_uid要保持唯一性，不能用QZFL.now()，两次调用会得到同样的值
	o._uid = 'uid_'+(++QZFL.cssTransfrom._count);
	if(!o._running && prop){
	    o._conf = prop;
	    o._duration = ('duration' in opts) ? opts.duration/1000: 0.5;
	    o._delay = ('delay' in opts) ? opts.delay: 0;
	    o._easing = opts.easing || 'ease';
	    o._count = 0;
	    o._running = false;
	    o._callback = QZFL.lang.isFunction(opts.complete)?opts.complete:QZFL.emptyFn;
	    o._change = opts.change;
	    elem._transition = o;
	}
	return o;
};
QZFL.cssTransfrom._cssText = {};
QZFL.cssTransfrom._attrs = {};
QZFL.cssTransfrom._hasEnd = {};
QZFL.cssTransfrom._count = 10000;
QZFL.cssTransfrom.prototype = {
    init : function(){
        var map = [
            ['webkit', '-webkit-transition', 'WebkitTransition', 'webkitTransitionEnd', 'WebkitTransform'],
            ['firefox', '-moz-transition', 'MozTransition', 'transitionend', 'MozTransform'],
            ['opera', '-o-transition', 'OTransition', 'oTransitionEnd', 'OTransform'],
            ['ie', '-ms-transition', 'msTransition', 'MSTransitionEnd', 'msTransform']
        ],
        tiClassPrefix, //ti: transition  tf: transform
        tiStyleName,
        tiEvtName,
        tfStyleName,
        ua = QZFL.userAgent,
        proto;
        //内存回收吧,一次性函数
        for(var i = 0, len = map.length; i < len; i++){
            if(ua[map[i][0]]){
                tiClassPrefix = map[i][1];
                tiStyleName = map[i][2];
                tiEvtName = map[i][3];
                tfStyleName = map[i][4];
                break;
            }
        }
        proto = QZFL.cssTransfrom.prototype;
        proto.TRANSITION  = {
            'classPrefix' : tiClassPrefix,
            'event' : tiEvtName,
            'styleName' : tiStyleName
        };
        proto.TRANSFORM  = {
            'styleName' : tfStyleName
        };
    },
    firecss : function(){
        var o = this, elem = o._elem,uid = o._uid,
            conf = this._conf,
            getStyle = QZFL.dom.getStyle,
            ct = QZFL.cssTransfrom,
            attrs;
        var cssTextArray = [],
            delayKey,
            delayVal = [],
            pptVal = [],
            durationKey,
            durationVal = [],
            easingKey,
            easingVal = [],
            TRANSFORM,
            cPrefix,
			_cprop='',
			cssText;
        //初始化事件类型
        if(!(this.TRANSITION && this.TRANSITION.classPrefix)){
            this.init();
        }
        this._running = true;
        cPrefix = this.TRANSITION.classPrefix;
        delayKey = cPrefix+'-delay';
        this.pptKey = cPrefix+'-property';
        durationKey = cPrefix+'-duration';
        easingKey = cPrefix+'-timing-function';
        TRANSFORM = this.TRANSFORM.styleName; //transform动画
        
        if (conf.transform && !conf[TRANSFORM]) {
            conf[TRANSFORM] = conf.transform;
            delete conf.transform;
        }
        for(var attr in conf) {
            if(conf.hasOwnProperty(attr)){
                o._addProperty(attr,conf[attr]);
                if(elem.style[attr] === '') {
                	QZFL.dom.setStyle(elem, attr, getStyle(elem, attr));
                }
            }
            _cprop = attr;
        }
        
        pptVal.push(getStyle(elem, this.pptKey));
        if(pptVal[0] && (pptVal[0] !== 'all')){
            durationVal.push(getStyle(elem, durationKey));
            easingVal.push(getStyle(elem, easingKey));
            delayVal.push(getStyle(elem, delayKey));
        }else{
            pptVal.pop();
        }
        attrs = ct._attrs[uid];
        for(var name in attrs){
            hyphy = o._toHyphen(name);
            attr = attrs[name];
            if (attrs.hasOwnProperty(name) && attr.transition === o) {
                if (name in elem.style) {
                    durationVal.push(parseFloat(attr.duration)+'s');
                    delayVal.push(parseFloat(attr.delay)+'s');
                    easingVal.push(attr.easing);
                    pptVal.push(hyphy);
                    cssTextArray.push(hyphy + ': ' + attr.value);
                } else {
                    o._removeProperty(name);
                }
            }
        }
        
        if(!ct._hasEnd[uid]) {//判断是否结束
            elem.addEventListener(this.TRANSITION.event, (elem._transitionCb = function(e){
                o._onTransfromEnd(e,uid);
            }), false);
            //再加一重保险
            o.timer = window.setTimeout(function(){
                o._end();
            }, o._duration * 1000);
            ct._hasEnd[uid] = true;
        }
		cssText = cssTextArray.join(';');
		ct._cssText[uid] = {};
		ct._cssText[uid].property = pptVal;
		ct._cssText[uid].style = elem.style.cssText; //记录原始style

        elem.style.cssText += ['',this.pptKey + ':' + pptVal.join(','),
            durationKey + ':' + durationVal.join(','),
            easingKey + ':' + easingVal.join(','),
            delayKey + ':' + delayVal.join(','),
            cssText, ''].join(';');//开始渲染css3，兼容没有以；结束的情况
			
		console.log(elem.style.cssText);
		//elem.style.cssText +=" -webkit-transform: translateY(-2000px); -webkit-transition-duration:24.45s; -webkit-transition-timing-function:linear; -webkit-transition-delay:0;";

    },

	_toHyphen : function(prop) {
        prop = prop.replace(/([A-Z]?)([a-z]+)([A-Z]?)/g, function(m0, m1, m2, m3) {
            var str = '';
            m1&&(str += '-' + m1.toLowerCase());
            str += m2;
            m3&&(str += '-' + m3.toLowerCase());
            return str;
        });
        return prop;
	},

    _endTransfrom: function(sname) {//结束后，对元素上的style做下清理
        var QF = QZFL,
            elem = this._elem,
            pptKey = this.pptKey,
            value = QF.dom.getStyle(elem, pptKey);
        
        if(!value){ //兼容opera
            pptKey = QF.string.camelCase(pptKey);
            value = elem.style[pptKey];
        }
        
        if(typeof value === 'string'){
            value = value.replace(new RegExp('(?:^|,\\s)' + sname + ',?'), ',');
            value = value.replace(/^,|,$/, '');
            elem.style[this.TRANSITION.styleName] = value || null; //clear transition property
        }
    },

    _onTransfromEnd: function(e,uid){
        var pname = QZFL.string.camelCase(e.propertyName),
            elapsed = e.elapsedTime,
            attrs = QZFL.cssTransfrom._attrs[uid],
            attr = attrs&&attrs[pname],
            tran = (attr) ? attr.transition : null, _cprop='';
        
        if(tran){
            window.clearTimeout(this.timer);
            this.timer = null;
        	for(var attr in this._conf) {
	            _cprop = attr;
	        }
            tran._removeProperty(pname);
            tran._endTransfrom(pname);
            if(tran._count <= 0){
                tran._end(elapsed);
            }
        }
    },

    _addProperty: function(prop, conf){//对动画配置项计算一下，并添加到_attrs里
        var o = this,node = this._elem,
            uid = o._uid,
            attrs = QZFL.cssTransfrom._attrs[uid],
            computed,compareVal,dur,attr,val;
        if(!attrs) {
            attrs = QZFL.cssTransfrom._attrs[uid] = {};
        }
        attr = attrs[prop];
        if(conf && conf.value !== undefined) {
            val = conf.value;
        }else if(conf !== undefined) {
            val = conf;
            conf = {};
        }
        if(attr && attr.transition){
            if(attr.transition !== o){
               attr.transition._count--;
            }
        }
        o._count++;
        dur = ((typeof conf.duration != 'undefined') ? conf.duration : o._duration) || 0.0001;
        attrs[prop] = {
            value: val,
            duration: dur,
            delay: (typeof conf.delay != 'undefined') ? conf.delay : o._delay,
            easing: conf.easing || o._easing,
            transition: o
        };
        computed = QZFL.dom.getStyle(node, prop);
        compareVal = (typeof val === 'string') ? computed : parseFloat(computed);
        //如果预期值和现在值是一样的
        if (compareVal === val) {
            setTimeout(function() {
                o._onTransfromEnd.call(o, {
                    propertyName: prop,
                    elapsedTime: dur
                }, uid);
            }, dur * 1000);
        }
    },

    _removeProperty: function(prop){  //清理参数
        var o = this, attrs = QZFL.cssTransfrom._attrs[o._uid];
        if (attrs && attrs[prop]) {
            delete attrs[prop];
            o._count--;
        }
    },

    _end: function(){  //css3动画结束，执行回调
        var o = this, elem = o._elem, callback = o._callback;
        o._running = false;
        o._callback = null;
        //bug:当动画运行过程中stop，callback依然会执行，事件移除有问题？
        if(elem&&callback&&!this._stoped){
        	setTimeout(function(){callback();},1);
        	//清除现场
        	o.clearStatus(elem);
       	}
    },
    stop : function(){
        var uid = this._uid, elem = this._elem, cText, pps, styleText = [];
        cText = QZFL.cssTransfrom._cssText[uid];
        pps = cText.property;
        for(var i = 0; i < pps.length; i++){
            styleText.push(pps[i] + ':' + QZFL.dom.getStyle(elem, pps[i]));
        }
        //bug:这样会导致动画过程中增加的属性被清掉
//      styleText.length && (elem.style.cssText = cText.style + ';' + styleText.join(';'));  //移除transition属性
        this.clearStatus(elem, styleText.join(';'));
        this._stoped = true;
    },
    /**
     * 清除一下现场
     */
    clearStatus : function(elem, style){
        elem.style.cssText = elem.style.cssText.replace(/[^;]+?transition[^;]+?;/ig,'') + (style ? style : '');
        if(elem._transitionCb){
            elem.removeEventListener(this.TRANSITION.event, elem._transitionCb, false); //移除事件现场
            elem._transitionCb = null;
        }
    }
 };
 
QZFL.now = function(){
    return (new Date()).getTime();
};

QZFL.string = QZFL.string||{};
QZFL.string.camelCase = function(s){
	var r = /-([a-z])/ig;
	return s.replace(r,function(all,letter) {
		return letter.toUpperCase();
	});
};
QZFL.string.reCamelCase = function(s){
    var r = /[A-Z]/g;
    return s.replace(r,function(all,letter) {
        return '-' + all.toLowerCase();
    });
};

/**
 * 用新的QZFL.effect对接之前的Tween方法,老的版本不再合入QZFL版本里，如想使用请单独加载一份tween.js
 * @param {string} elem 需要动画处理的dom
 * @param {string} prop css属性名
 * @param {function} func 动画算子
 * @param {string or number} startValue 初始值
 * @param {string or number} finishValue 结束值
 * @param {number} duration 动画执行时间
 */
QZFL.Tween = function(elem, prop, func, startValue, finishValue, duration){
	var o = this;
	o.elem = QZFL.dom.get(elem);
	o.prop = {};
	o.sv = startValue;
	o.fv = finishValue;
	o.pname = prop;
	o.prop[prop] = parseInt(finishValue);
	o.opts = {duration : duration*1000};
	o.onMotionStart = QZFL.emptyFn;
	o.onMotionChange = null;
	o.onMotionStop = QZFL.emptyFn;
	o.css = true;
};

/**
 * 开始运行动画
 */
QZFL.Tween.prototype.start = function(){
	var o = this,s = parseInt(o.sv),e = parseInt(o.fv);
	var set = QZFL.dom.setStyle(o.elem,o.pname,o.sv);
	if(set){
		o.opts.complete = o.onMotionStop;
		o.opts.change = function(p){
			p*=0.01;
			var v = e>=s?((e-s)*p+s):(s-(s-e)*p);
			o.onMotionChange&&o.onMotionChange.apply(o,[o.elem,o.pname,v]);
		}
		o.onMotionStart.apply(o);
		QZFL.effect.run(o.elem,o.prop,o.opts);
	}else{
		o.css = false;
		var t = new QZFL.tweenMaker(s,e,o.opts.duration,o.opts.interval||15);
		t.onStart = function(){
			o.t = t;
			o.onMotionStart.apply(o);
		};
		t.onChange = function(p){
			p*=0.01;
			var v = e>=s?((e-s)*p+s):(s-(s-e)*p);
			o.onMotionChange&&o.onMotionChange.apply(o,[o.elem,o.pname,v]);
		};
		t.onEnd = function(){
			o.onMotionStop.apply(o);
		};
		t.start();
	}
};

//获取动画进度百分比
QZFL.Tween.prototype.getPercent = function(){
	return this.css ? QZFL.effect.getPercent(this.elem):this.t.getPercent();
};

/**
 * 停止or暂停动画
 */
QZFL.Tween.prototype.stop = function() {
	QZFL.effect.stop(this.elem);
};

/**
 * 兼容老的算子类，老的版本不再合入QZFL版本里，如想使用请单独加载一份tween.js
 */
QZFL.transitions = {};



/////////////
//tween_extend.js
/////////////


/**
 * @fileoverview 把tween类的接口封装到QZFL Elements
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */
;(function() {
	/**
	 * resize和move的算法
	 */
	var _easeAnimate = function(_t, a1, a2, ease) {
		var _s = QZFL.dom["get" + _t](this), _reset = typeof a1 != "number" && typeof a2 != "number";

		if (_t == "Size" && _reset) {
			QZFL.dom["set" + _t](this, a1, a2);
			var _s1 = QZFL.dom["get" + _t](this);
			a1 = _s1[0];
			a2 = _s1[1];
		}

		var _v1 = _s[0] - a1;
		var _v2 = _s[1] - a2;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);

		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2];
			QZFL.dom["set" + _t](this, typeof a1 != "number" ? _s[0] : (_s[0] - _p / 100 * _v1), typeof a2 != "number" ? _s[1] : (_s[1] - _p / 100 * _v2));
		});

		// reset size to auto
		if (_t == "Size" && _reset) {
			n.onMotionStop = QZFL.event.bind(this, function() {

				QZFL.dom["set" + _t](this);

			});
		}

		n.start();
	};

	var _easeShowAnimate = function(_t, ease) {
		var n = new QZFL.Tween(this, "opacity", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, (_t ? 0 : 1), (_t ? 1 : 0), 0.5);
		n[_t ? "onMotionStart" : "onMotionStop"] = QZFL.event.bind(this, function() {
			this.style.display = _t ? "" : "none";
			QZFL.dom.setStyle(this, "opacity", 1);
		});
		n.start();
	};

	var _easeScroll = function(top, left, ease) {
		if (this.nodeType == 9) {
			var _stl = [
						QZFL.dom.getScrollTop(this),
						QZFL.dom.getScrollLeft(this)];
		} else {
			var _stl = [this.scrollTop, this.scrollLeft];
		}

		var _st = _stl[0] - top;
		var _sl = _stl[1] - left;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);
		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2], _t = (_stl[0] - _p / 100 * _st), _l = (_stl[1] - _p / 100 * _sl);

			if (this.nodeType == 9) {
				QZFL.dom.setScrollTop(_t, this);
				QZFL.dom.setScrollLeft(_l, this);
			} else {
				this.scrollTop = _t;
				this.scrollLeft = _l;
			}
		});
		n.start();
	};

	QZFL.element.extendFn({
		tween : function(){
			
		},
		
		/**
		 * 渐变显示
		 * @param {string} effect 转换效果,目前只支持"resize"
		 * @param {string} ease 动画效果
		 * @example $e(document).effectShow();
		 */
		
		effectShow : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [true, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", null, null, ease])
				});
			}
		},
		/**
		 * 渐变隐藏
		 * @param {string} effect 转换效果,目前只支持"resize"
		 * @param {string} ease 动画效果
		 * @example $e(document).effectHide();
		 */
		effectHide : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [false, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", 0, 0, ease])
				});
			}
		},
		/**
		 * 改变尺寸
		 * @param {number} width 宽度
		 * @param {number} height 高度
		 * @param {string} ease 动画效果
		 * @example $e(document).effectResize(200,200);
		 */
		effectResize : function(width, height, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["Size", width, height, ease])
			});
		},
		/**
		 * 改变位置
		 * @param {number} x x坐标
		 * @param {number} y y坐标
		 * @param {string} ease 动画效果
		 * @example $e(document).effectMove(200,200);
		 */
		effectMove : function(x, y, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["XY", x, y, ease])
			});
		},
		/**
		 * 滚动条滑动
		 * @param {number} top 纵向距离
		 * @param {number} left 横向距离
		 * @param {string} ease 动画效果
		 * @example $e(document).effectScroll(200);
		 */
		effectScroll : function(top, left, ease) {
			this.each(function(el) {
				_easeScroll.apply(el, [top, left, ease])
			});
		}
		// ,
		//
		// effectNotify : function(ease) {
		// this.each(function() {
		// var _c = QZFL.dom.getStyle(this,"backgroundColor");
		// var n = new QZFL.Tween(this, "backgroundColor",
		// QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, "#ffffff",
		// "#ffff00", 0.8);
		//
		// n.onMotionStop = QZFL.event.bind(this,function(){
		// var o = this;
		// setTimeout(function(){
		// var n = new QZFL.Tween(o, "backgroundColor", QZFL.transitions[ease]
		// || QZFL.transitions.regularEaseOut, "#ffff00", "#ffffff", 1);
		// n.onMotionStop = function(){
		// o.style.backgroundColor = "transparent";
		// }
		// n.start();
		// },1000)
		// });
		// n.start();
		// });
		// }
	})
})();



/////////////
//deferred.js
/////////////


/**
 * 实现promise模式的deferred对象
 * @param {Function} [func] 异步函数
 * @param {Array} [args] 参数列表
 * @return promise对象
 * @author hankzhu
 * @version 1.0.0.0
 * @example
 * 1.deferred作为参数
 * var test = function(args, deferred){
 *     setTimeout(function(){
 *         deferred.reject(re);
 *         //or
 *         //deferred.resolve(re);
 *     });
 * },
 * p = QZFL.Deferred(test, [args]);
 * p.done(succCb).fail(errCb); //同p.then(succCb, errCb);
 * 
 * 2.deferred作为私有变量
 * var test = function(args){
 *     var deferred = QZFL.Deferred();
 *     setTimeout(function(){
 *         deferred.reject(re);
 *         //or
 *         //deferred.resolve(re);
 *     });
 *     return deferred;
 * },
 * p = test(args);// p.done(fn).fail(fn) or p.then(fn, fn);
 * 
 * reject/resolve方法传参，会透传到done/fail/then注册的相应方法
 * 更多examples见qzfl_proj/trunk/src/widget/examples/deferred的demo
 */
QZFL.Deferred = function(func, args){
    var _slice = Array.prototype.slice
    , Promise = function(){
        this.status = undefined;   //0-''  1-resolve 2-reject
    }
    , Event = {
        _status : {'reject':1, 'resolve':1},
        _init : function(type){ //2种type
            if(!this.eventList){
                this.eventList = {
                    rejectFuncs : [],
                    resolveFuncs : []
                };
            }
        },
        add : function(type, func){
            this._init(type);
            if(typeof(func) == 'function'){ //过滤一下
                if(this.status == type){
                    func.apply(window, this.eventList[type + 'Datas']);
                }else{
                    this.eventList[type + 'Funcs'].push(func);
                }
                this.eventList.added = 1;
            }
            return this;
        },
        trigger : function(type, datas){
            var i, funcs, func;
            if(type in this._status){
                this._init();
                if(this.eventList.added){ //已经有注册done或者fail
                    funcs = this.eventList[type + 'Funcs'];
                    while((func = funcs.shift())){
                        func.apply(window, datas);
                    }
                }else{//在触发的时候，还没有绑定任何事件
                    this.eventList[type + 'Datas'] = datas;
                }
                this.status = type;
            }
        }
    }
    , _promise;
    
    QZFL.object.extend(Promise.prototype, {
        done : function(func){
            return this.add('resolve', func);
        },
        fail : function(func){
            return this.add('reject', func);
        },
        then : function(doneFunc, failFunc){
            return this.add('resolve', doneFunc).add('reject', failFunc);
        },
        resolve : function(){
            this.trigger('resolve', _slice.call(arguments));
        },
        reject : function(){
            this.trigger('reject', _slice.call(arguments));
        },
        state : function(){
            return this.status;
        }
    }, Event);
   
    _promise = new Promise();
    if(!(args instanceof Array)){
        args = [];
    }
    //函数体内部只有两个方法
    if(typeof(func) == 'function'){
        //作为最后一个参数
        args.push(_promise);
        func.apply(window, args);
    }
    //全部返回
    return _promise;
};
/**
 * 多个异步操作的协作
 * @param {Object} promises promise对象列表
 * @example
 * var p1 = QZFL.Deferred(XXX), p2 = QZFL.Deferred(XXX);
 * QZFl.when(p1, p2).done(succCb).fail(failCb); //或者.then(succCb, failCb);
 */
QZFL.object.extend(QZFL, {
    when : function(promise){
        var _slice = Array.prototype.slice,
            promises = _slice.call(arguments),
            length = promises.length, remain, updateFunc, datas = [], d, s;
            
        remain = (length !== 1 || ( promise && promise.state()) ? length : 0);
        promise = (remain === 1 ? promise : QZFL.Deferred());
        
        //每个promise完成的时候都会检查这个
        updateFunc = function(index, data) {
            datas[index] = _slice.call(data);
            if(!(--remain)){
                promise.resolve.apply(promise, datas); //触发done
            }
        };
        if(length > 1){
            for(var i = 0; i < length; i++){
                if(!promises[i].state){ throw new Error('not a promise instance');} //非promise对象
                promises[i].done((function(i){
                    return function(){
                        updateFunc(i, arguments);
                    };
                })(i)).fail(function(){
                    promise.reject(_slice.call(arguments));
                });
            }
        }
        if(!remain) {
            promise.resolve();
        }   
        return promise;   
    }
});



/////////////
//xhr.js
/////////////


/**
 * @fileoverview QZFL XMLHttpRequest组件壳
 * @version 1.1
 * @author ryanzhao, zishunchen, scorpionxu
 */

/**
 * XMLHttpRequest通信器组件，如今已经不太建议使用，推荐使用基于JSONP的数据接口
 * “小跨域”拉取数据时（a.qq.com上的页面拉取b.qq.com上的资源）可以使用，需要借助/resource/html/xhr_proxy_gbk.html
 * @deprecated 不太建议使用基于XHR的前后台通信方式
 *
 * @class XMLHttpRequest通信器组件
 * @constructor
 * @param {String} actionURI 请求地址
 * @param {String} [cname='_xhrInstence_'+QZFL.XHR.counter] 对象实体的索引名，默认是"_xhrInstence_n"，n为序号
 * @param {String} [method='POST'] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data={}] hashTable形式的字典
 * @param {boolean} [isAsync=true] <strong style="color:red;">Deprecated</strong> 不在提供同步模式，永远为异步
 * @param {boolean} [nocache=false] 是否无cache
 */
QZFL.XHR = function(actionURL, cname, method, data, isAsync, nocache) {
	var _s = QZFL.XHR,
		prot,
		n;

	cname = cname || ("_xhrInstence_" + _s.counter);

	if (!(_s.instance[cname] instanceof QZFL.XHR)) {
		_s.instance[cname] = this;
		_s.counter++;
	}

	prot = _s.instance[cname]

	prot._name = cname;
	prot._nc = !!nocache;
	prot._method = ((typeof method == 'string' ? method : '').toUpperCase() != "GET") ? "POST" : "GET";
	if(!(prot._uriObj = new QZFL.util.URI(actionURL))){ //URL都不规范就不要玩了
		throw (new Error("URL not valid!"));
	}
	prot._uri = actionURL;
	prot._data = data;


	// 对外的接口群
	/**
	 * 当成功回调时触发的事件
	 * @param {object} data 回调数据
	 * @param {object} data.text 其实就是XHR的responseText
	 * @param {object} data.xmlDom 其实就是XHR的responseXML
	 * @event
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 当错误时，通常是网络问题，或者后台挂掉
	 * @param {object} msg 错误说名字
	 * @event
	 */
	this.onError = QZFL.emptyFn;

	/**
	 * 使用的编码
	 * @type string
	 */
	this.charset = "gb2312";

	/**
	 * 参数化proxy的路径，也就是在被请求资源域名上的那个跨域代理文件xhr_proxy_gbk.html的位置
	 * @type string
	 */
	this.proxyPath = "";



	return prot;
};

/**
 * @private
 */
QZFL.XHR.instance = {};

/**
 * @private
 */
QZFL.XHR.counter = 0;


/**
 * 本体路径
 *
 */
QZFL.XHR.path = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/expand/xhr_base.js?max_age=864001",



/**
 * 发送请求
 *
 * @returns {boolean} 是否成功发出
 */
QZFL.XHR.prototype.send = function() {
	var _s = QZFL.XHR,
		fn;
	if (this._method == 'POST' && !this._data) { //can't send POST request with no data
		return false;
	}

	if(typeof this._data == "object"){
		this._data = _s.genHttpParamString(this._data, this.charset);
	}

	if(this._method == 'GET' && this._data){
		this._uri += (this._uri.indexOf("?") < 0 ? "?"  : "&") +  this._data;
	}

	//判断是否需要跨域请求数据
	fn = (location.host && (this._uriObj.host != location.host)) ? '_DoXsend' : '_DoSend';
	if(_s[fn]){
		return _s[fn](this);
	}else{
		QZFL.imports(_s.path, (function(th){
				return function(){
					_s[fn](th);
				};
			})(this));
		return true;
	}
};


/**
 * @private
 */
QZFL.XHR.genHttpParamString = function(o, cs){
	cs = (cs || "gb2312").toLowerCase();
	var r = [];

	for (var i in o) {
		r.push(i + "=" + ((cs == "utf-8") ? encodeURIComponent(o[i]) : QZFL.string.URIencode(o[i])));
	}

	return r.join("&");
};





/////////////
//xhr2.js
/////////////


(function () {
var def = {
	// 请求过程中调用的方法
	// 各种状态发生变化事触发
	onload: function () {},
	// 200状态时触发的事件
	onprogress: function() {},
	timeout: 3000,
	onSuccess: function () {},
	onError: function () {},
	onerror: function() {},
	method: 'get',
	processText: null,
	instance: null,
	headers: {
		'X-Real-Url': ''
	}
}, 
	extend = QZFL.object.extend,
	cdm = location.host,
	supportlv2 = (QZFL.userAgent.ie > 9 || window.XMLHttpRequest) && ('withCredentials' in new XMLHttpRequest);

function transdata(data) {
	var ar = [];
	if (typeof data == 'object') {
		for (var i in data) {
			ar.push(i + '=' + encodeURIComponent(data[i]));
		}
	}
	else {
		ar.push(data);
	}
	return ar.join('&');
}

function isSameDomain(url) {
	if (url.charAt(0) == '/') {
		return true;
	}
	return /^https?\:\/\/([\s\S]+?)\//.test(url) && RegExp.$1 == cdm;
}

function createXHR() {
	var xhr;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest;
	}else if(window.ActiveXObject){
		xhr = new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xhr;
}

function setHeader(xhr, kv) {
	for (var i in kv) {
		kv[i] && xhr.setRequestHeader(i, kv[i]);	
	}
}

function processText(str) {
	if (str.indexOf('<script') > -1) {
		var lidx = str.lastIndexOf(')'), rst = str.substring(str.indexOf('.callback(') + 10, lidx == -1 ? str.length : lidx);
		return rst;
	}
	return '""';
}

function ajaxRequest (url, data, opt) {
	var xhr = createXHR();
	if (!xhr) {
		return;
	}
	var instance = {
		url: url,
		startTime: +new Date
	}
	// 同域名尝试使用xhr1
	if (isSameDomain(url)) {
		xhr.open(opt.method, url, true);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					instance.endTime = +new Date;
					var o = eval('(' + (opt.processText || processText) (this.responseText) + ')');
					(opt.instance || instance || {})['resultArgs'] = [o];
					opt.onload.call(this, o);
					QZFL['FormSender']._pluginsRunner('onRequestComplete', opt.instance || instance);
				}
				// 出现404很可能是代理proxy出错
				else if (this.status > 400) {
					var th = opt.instance || {};
					th.endTime = +new Date;
					th.msg = QZFL.FormSender._errCodeMap[999].msg;
					th.statusCode = this.status;
					th._uri = 'http://user.qzone.qq.com/proxy[real_url:' + encodeURIComponent(th._uri || th.uri) + ']'
					QZFL['FormSender']._pluginsRunner('onRequestComplete', th);
				}
			}
		}
	}
	// 非ie以及ie10已全面支持了xmlhttprequest level2
	else if (supportlv2) {
		xhr.open(opt.method, url + (url.indexOf('?') > -1 ? '&' : '?') + 'g_tk=' + QZFL.pluginsDefine.getACSRFToken(), true);
		xhr.withCredentials = true;
		xhr.onload = function () {
			instance.endTime = +new Date;
			opt.onload.call(this, eval('(' + processText(this.responseText) + ')'));
			QZFL['FormSender']._pluginsRunner('onRequestComplete', opt.instance || instance);
		};
	}
	xhr.onerror = opt.onerror;
	xhr.onprogress = opt.onprogress;
	opt.method.toLowerCase() == 'post' && setHeader(xhr, extend({
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	}, opt.headers));
	xhr.send(transdata(data));
	instance.postTime = +new Date;
};

QZFL.ajaxPost = function (url, data, opt) {
	if (typeof data == 'function') {
		opt = data;
		data = null;
	}
	opt = extend(def, typeof opt == 'function' ? {onload: opt} : (opt || {}));
	ajaxRequest(url, data, extend(opt, {method: 'post'}));
}

QZFL.ajaxGet = function (url, data, opt) {
	if (typeof data == 'function') {
		opt = data;
		data = null;
	}
	opt = extend(def, typeof opt == 'function' ? {onload: opt} : (opt || {}));
	ajaxRequest(url, data, extend(opt, {method: 'get'}));
}

}) ();



/////////////
//xdr.js
/////////////


 



/////////////
//cookie.js
/////////////


/**
 * @fileoverview QZFL cookie数据处理
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * cookie类,cookie类可以让开发很轻松得控制cookie，我们可以随意增加修改和删除cookie，也可以轻易设置cookie的path, domain, expire等信息
 *
 * @namespace QZFL.cookie
 */
QZFL.cookie = {
	/**
	 * 设置一个cookie,还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
	 * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} domain 所在域名
	 * @param {String} path 所在路径
	 * @param {Number} hour 存活时间，单位:小时
	 * @return {Boolean} 是否成功
	 * @example
	 *  QZFL.cookie.set('value1',QZFL.dom.get('t1').value,"qzone.qq.com","/v5",24); //设置cookie
	 */
	set : function(name, value, domain, path, hour) {
		if (hour) {
			var expire = new Date();
			expire.setTime(expire.getTime() + 3600000 * hour);
		}
		document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
		return true;
	},

	/**
	 * 获取指定名称的cookie值
	 *
	 * @param {String} name cookie名称
	 * @return {String} 获取到的cookie值
	 * @example
	 * 		QZFL.cookie.get('value1'); //获取cookie
	 */
	get : function(name) {
		//ryan
		//var s = ' ' + document.cookie + ';', pos;
		//return (pos = s.indexOf(' ' + name + '=')) > -1 ? s.slice(pos += name.length + 2, s.indexOf(';', pos)) : '';
		
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"), m = document.cookie.match(r);
		return (!m ? "" : m[1]);
	},

	/**
	 * 删除指定cookie,复写为过期
	 *
	 * @param {String} name cookie名称
	 * @param {String} domain 所在域
	 * @param {String} path 所在路径
	 * @example
	 * 		QZFL.cookie.del('value1'); //删除cookie
	 */
	del : function(name, domain, path) {
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
	}
};




/////////////
//debug.js
/////////////


/**
 * @fileoverview 用于调试空间的错误信息
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 错误调试类
 *
 * @namespace QZFL.debug
 */
QZFL.debug = {
	/**
	 * 错误对象
	 */
	errorLogs : [],

	/**
	 * 启用Qzone调试模式，错误会记录到对象中
	 */
	startDebug : function() {
		/**
		 * 为窗口加入错误处理
		 *
		 * @ignore
		 * @param {Object} e
		 */
		window.onerror = function(msg,url,line) {
			var urls = (url || "").replace(/\\/g,"/").split("/");
			QZFL.console.print(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")",1);
			QZFL.debug.errorLogs.push(msg);
			return false;
		}
	},

	/**
	 * 停止Qzone调试模式
	 */
	stopDebug : function() {
		/**
		 * 为窗口加入错误处理
		 *
		 * @ignore
		 */
		window.onerror = null;
	},

	/**
	 * 清除所有错误信息
	 */
	clearErrorLog : function() {
		this.errorLogs = [];
	},

	showLog : function() {
		var o = ENV.get("debug_out");
		if (!!o) {
			o.innerHTML = QZFL.string.nl2br(QZFL.string.escHTML(this.errorLogs.join("\n")));
		}
	},

	getLogString : function() {
		return (this.errorLogs.join("\n"));
	}
};

/**
 * runtime处理工具静态类
 *
 * @namespace runtime处理工具静态类
 */
QZFL.runTime = (function() {
	/**
	 * 是否debug环境
	 *
	 * @return {Boolean} 是否呢
	 */
	function isDebugMode() {
		return (QZFL.config.debugLevel > 1);
	}

	/**
	 * log记录器
	 *
	 * @ignore
	 * @param {String} msg 信息记录器
	 */
	function log(msg, type) {
		var info;
		if (isDebugMode()) {
			info = msg + '\n=STACK=\n' + stack();
		} else {
			if (type == 'error') {
				info = msg;
			} else if (type == 'warn') {
				// TBD
			}
		}
		QZFL.debug.errorLogs.push(info);
	}

	/**
	 * 警告信息记录
	 *
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function warn(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'warn');
	}

	/**
	 * 错误信息记录
	 *
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function error(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'error');
	}

	/**
	 * 获取当前的运行堆栈信息
	 *
	 * @param {Error} e 可选，当时的异常对象
	 * @param {Arguments} a 可选，当时的参数表
	 * @return {String} 堆栈信息
	 */
	function stack(e, a) {
		function genTrace(ee, aa) {
			if (ee.stack) {
				return ee.stack;
			} else if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
				var cnt = 0;
				return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function() {
					cnt++;
					return (cnt % 2 == 0) ? "\n" : " @ ";
				});
			} else {
				var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
				var eas = entry.arguments;
				var r = [];
				for (var i = 0, len = eas.length; i < len; i++) {
					r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
				}
				var fnp = /function\s+([^\s\(]+)\(/;
				var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
				return (fname + "(" + r.join() + ");").replace(/\n/g, "");
			}
		}

		var res;

		if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
			res = genTrace(e, a);
		} else {
			try {
				({}).sds();
			} catch (err) {
				res = genTrace(err, arguments);
			}
		}

		return res.replace(/\n/g, " <= ");
	}

	return {
		/**
		 * 获取当前的运行堆栈信息
		 *
		 * @param {Error} e 可选，当时的异常对象
		 * @param {Arguments} a 可选，当时的参数表
		 * @return {String} 堆栈信息
		 */
		stack : stack,
		/**
		 * 警告信息记录
		 *
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		warn : warn,
		/**
		 * 错误信息记录
		 *
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		error : error,

		/**
		 * 是否调试模式
		 */
		isDebugMode : isDebugMode
	};

})();



/////////////
//js_loader.js
/////////////


/**
 * @fileoverview QZFL Javascript Loader
 * @version 1.$Rev: 1918 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 17:35:04 +0800 (周二, 11 一月 2011) $
 */

/**
 * Js Loader，js脚本异步加载
 *
 * @constructor
 * @example
 * 		var t=new QZFL.JsLoader();
 *		t.onload = function(){};
 *		t.load("/qzone/v5/tips_diamond.js", null, {"charset":"utf-8"});
 */
QZFL.JsLoader = function() {
	/**
	 * 当js下载完成时
	 *
	 * @event
	 */
	this.onload = QZFL.emptyFn;

	/**
	 * 网络问题下载未完成时
	 *
	 * @event
	 */
	this.onerror = QZFL.emptyFn;
};


/**
 * 动态加载JS
 *
 * @param {string} src javascript文件地址
 * @param {Object} doc document
 * @param {string} [opt] 当为字符串时，指定charset
 * @param {object} [opt] 当为对象表时，指定<script>标签的各种属性
 *
 */
QZFL.JsLoader.prototype.load = function(src, doc, opt){
	var opts = {}, t = typeof(opt), o = this;

	if (t == "string") {
		opts.charset = opt;
	} else if (t == "object") {
		opts = opt;
	}

	opts.charset = opts.charset || "gb2312";

	//TO DO  一个防重加载优化
	QZFL.userAgent.ie ? setTimeout(function(){
		o._load(src, doc || document, opts);
	}, 0) : o._load(src, doc || document, opts);
};

QZFL.JsLoader.count = 0;
QZFL.JsLoader._idleInstancesIDQueue = [];

/**
 * 异步加载js脚本
 *
 * @param {Object} sId
 * @param {Object} src
 * @param {Object} doc
 * @param {Object} opts
 * @ignore
 * @private
 */
QZFL.JsLoader.prototype._load = (function() {
	var _ie = QZFL.userAgent.ie,
		_doc = document,
		idp = QZFL.JsLoader._idleInstancesIDQueue,
		_rm = QZFL.dom.removeElement,
		_ae = QZFL.event.addEvent,
		docMode = _doc.documentMode;
	return function(/*sId, */src, doc, opts){
		var o = this,
			tmp,
			k,
			head = doc.head || doc.getElementsByTagName("head")[0] || doc.body,
			_new = false,
			_js;

		if(!(_js = doc.getElementById(idp.pop())) || (QZFL.userAgent.ie && QZFL.userAgent.ie > 8)){
			_js = doc.createElement("script");
			_js.id = "_qz_jsloader_" + (++QZFL.JsLoader.count);
			_new = true;
		}

		// 处理加载成功的回调
		_ae(_js, (_ie && _ie < 10 ? "readystatechange" : "load"), function(){
			//ie的处理逻辑
			if (!_js || _ie && _ie < 10 && ((typeof docMode == 'undefined' || docMode < 10) ? (_js.readyState != 'loaded') : (_js.readyState != 'complete'))) {
				return;
			}
			_ie && idp.push(_js.id);

			o.onload();
			!_ie && _rm(_js);
			_js = o = null;
		});

		if (!_ie) {
			_ae(_js, 'error', function(){
				_ie && idp.push(_js.id);

				o.onerror();
				!_ie && _rm(_js);
				_js = o = null;
			})
		}

		for (k in opts) {
			if (typeof(tmp = opts[k]) == "string" && k.toLowerCase() != "src") {
				_js.setAttribute(k, tmp);
			}
		}

		_new && head.appendChild(_js);

		_js.src = src;

		opts = null;
	};
}) ();

/**
 * JsLoader的简写,避免被分析出来
 * @deprecated 不建议使用,只做兼容
 * @ignore
 */
QZFL["js"+"Loader"]=QZFL.JsLoader;




/////////////
//imports.js
/////////////


/**
 * @fileoverview QZFL Javascript Imports，支持并行加载、根据namespace加载
 * @version 1.$Rev: 1544 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 */
/**
 * 异步加载一些脚本库 by ryan
 * @param {Object} sources
 * @param {Object} succCallback
 * @param {Object} opts
 */
QZFL.imports = function(sources, succCallback, opts){
	var errCallback, url, len, countId, counter, scb, ecb, i, isFn = QZFL.lang.isFunction;
	opts = QZFL.lang.isString(opts) ? {
		charset: opts
	} : (opts || {});
	opts.charset = opts.charset || 'utf-8';
	var errCallback = isFn(opts.errCallback) ? opts.errCallback : QZFL.emptyFn;
	succCallback = isFn(succCallback) ? succCallback : QZFL.emptyFn;
	
	if (typeof(sources) == "string") {
		url = QZFL.imports.getUrl(sources);
		QZFL.imports.load(url, succCallback, errCallback, opts);
	} else if (QZFL.lang.isArray(sources)) {
		countId = QZFL.imports.getCountId();
		len = QZFL.imports.counters[countId] = sources.length;
		counter = 0;
		scb = function(){
			counter++;
			if (counter == len) {
				if (isFn(succCallback)) succCallback();
			}
			delete QZFL.imports.counters[countId];
		};
		ecb = function(){
			if (isFn(errCallback)) errCallback();
			QZFL.imports.counters[countId];
		};
		
		for (i = 0; i < len; i++) {
			url = QZFL.imports.getUrl(sources[i]);
			QZFL.imports.load(url, scb, ecb, opts);
		}
	}
};

QZFL.imports.getUrl = function(url){
	return QZFL.string.isURL(url) ?
		url
			:
		(QZFL.imports._indirectUrlRE.test(url) ?
			url
				:
			(QZFL.config.staticServer + url + '.js'));
};

QZFL.imports.urlCache = {};
QZFL.imports.counters = {};
QZFL.imports.count = 0;
QZFL.imports._indirectUrlRE = /^(?:\.{1,2})?\//;

QZFL.imports.getCountId = function(){
	return 'imports' + QZFL.imports.count++;
};

QZFL.imports.load = function(url, scb, ecb, opt){
	if (QZFL.imports.urlCache[url] === true) {
		setTimeout(function(){
			if (QZFL.lang.isFunction(scb)) scb()
		}, 0);
		return;
	}
	if (!QZFL.imports.urlCache[url]) {
		QZFL.imports.urlCache[url] = [];
		var loader = new QZFL.JsLoader();
		loader.onload = function(){
			QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 1);
			QZFL.imports.doOn("load",{'url':url});
			QZFL.imports.urlCache[url] = true;
		};
		loader.onerror = function(){
			QZFL.imports.execFnQueue(QZFL.imports.urlCache[url], 0);
			QZFL.imports.doOn("error",{'url':url});
			QZFL.imports.urlCache[url] = null;
			delete QZFL.imports.urlCache[url];
		};
		loader.load(url, null, opt);
	}
	QZFL.imports.urlCache[url].push([ecb, scb]);
};

QZFL.imports.execFnQueue = function(arFn, isSuccess){
	var f;
	while (arFn.length) {
		f = arFn.shift()[isSuccess];
		if (QZFL.lang.isFunction(f)) {
			setTimeout((function(fn){
				return fn
			})(f), 0);
		}
	}
};

QZFL.imports.onQueue = {};

QZFL.imports.on = function(type,fn){
	if (!QZFL.imports.onQueue[type]) {
		QZFL.imports.onQueue[type] = [];
	}
	QZFL.imports.onQueue[type].push(fn);
}

QZFL.imports.doOn = function(type,obj){
	var a = QZFL.imports.onQueue[type];
	if(!a){
		return;
	}
	for(var i=0,len=a.length;i<len;i++){
		if(typeof(a[i])=="function"){
			a[i](obj);
		}
	}
}

/////////////
//form_sender.js
/////////////


/**
 * @fileoverview QZFL Form Submit Class
 * @version 1.$Rev: 1897 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-12-27 20:59:34 +0800 (周一, 27 十二月 2010) $
 */

/**
 * FormSender通信器类,建议写操作使用
 *
 * @param {String} actionURL 请求地址
 * @param {String} [method] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data] hashTable形式的字典
 * @param {String} [charset="gb2312"] 于后台数据交互的字符集
 * @constructor
 * @namespace QZFL.FormSender
 *
 * cgi返回模板: <html><head><meta http-equiv="Content-Type" content="text/html;
 * charset=gb2312" /></head> <body><script type="text/javascript">
 * document.domain="qq.com"; frameElement.callback({JSON:"Data"}); </script></body></html>
 * @example
 * 		var fs = new QZFL.FormSender(APPLY_ENTRY_RIGHT,"post",{"hUin": getParameter("uin"),"vUin":checkLogin(),"msg":$("msg-area").value, "rd": Math.random()}, "utf-8");
 *		fs.onSuccess = function(re) {};
 *		fs.onError = function() {};
 *		fs.send();
 *
 */
QZFL.FormSender = function(actionURL, method, data, charset) {

	/**
	 * form的名称，默认为 _fpInstence_ + 计数
	 *
	 * @type string
	 */
	this.name = "_fpInstence_" + QZFL.FormSender.counter;
	QZFL.FormSender.instance[this.name] = this;
	QZFL.FormSender.counter++;

	var c = String(charset).toLowerCase();

	if(typeof(actionURL) == 'object' && actionURL.nodeType == 1 && actionURL.tagName == 'FORM'){
		this.instanceForm = actionURL;
	}else{ //standard mode

		/**
		 * 数据发送方式
		 *
		 * @type string
		 */
		this.method = method || "POST";

		/**
		 * 数据请求地址
		 *
		 * @type string
		 */
		this.uri = actionURL;

		/**
		 * 数据请求的编码格式
		 *
		 * @type string
		 */
		this.charset = (c == 'utf-8' || c == 'gbk' || c == 'gb2312' || c == 'gb18030') ? c : 'gb2312';

		/**
		 * 数据参数表
		 *
		 * @type object
		 */
		this.data = (typeof(data) == "object" || typeof(data) == 'string') ? data : null;




		this.proxyURL = (this.charset == "utf-8") ?
			QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8")
				:
			QZFL.config.FSHelperPage;

	}


	this._sender = null;


	/**
	 * 服务器正确响应时的处理
	 *
	 * @event
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 服务器无响应或预定的不正常响应处理
	 *
	 * @event
	 */
	this.onError = QZFL.emptyFn;

	// 宿主对象
	this.ownerWindow = window;

	// 准备时间
	this.startTime = 0;

	// 成功回调时间
	this.endTime = 0;

	// 发送请求时间
	this.postTime = 0;
};

QZFL.FormSender.instance = {};
QZFL.FormSender.counter = 0;

QZFL.FormSender._errCodeMap = {
	999 : {
		msg : 'Connection or Server error'
	}
};



QZFL.FormSender.pluginsPool = {
	"formHandler" : []
	, "onErrorHandler" : []
};

QZFL.FormSender._pluginsRunner = function(pType, data){
	var _s = QZFL.FormSender
		, l = _s.pluginsPool[pType]
		, t = data
		, len
		;

	if(l && (len = l.length)){
		for(var i = 0; i < len; ++i){
			if(typeof(l[i]) == "function"){
				t = l[i](t) || data;
			}
		}
	}

	return t;
};


QZFL.FormSender._clear = function(o){
	o._sender
		= o._sender.callback
		= o._sender.errorCallback
		= null
		;

	if (QZFL.userAgent.safari || QZFL.userAgent.opera) {
		setTimeout('QZFL.dom.removeElement(document.getElementById("_fp_frm_' + o.name + '"))', 50);
	} else {
		QZFL.dom.removeElement(document.getElementById("_fp_frm_" + o.name));
	}
	// 完成了一次请求
	o.endTime = +new Date;
	QZFL.FormSender._pluginsRunner('onRequestComplete', o);
	o.instanceForm = null;
};

/**
 * 发送请求
 *
 * @return {Boolean} 是否成功
 */
QZFL.FormSender.prototype.send = (function() {
	var win = window;
	(function (callback) {
		var _cur = window, flag, cnt = 0, _pool = [];
		while (true) {
			flag = false;
			try {
				_cur.document && _cur.document.domain == document.domain && (flag = true);
			} catch (_) {
			}
			if (flag) {
				_pool.push(_cur);
			}
			if (_cur == top) {
				break;
			}
			_cur = _cur.parent;
		}
		while (_pool.length) {
			if (callback(_cur = _pool.pop()) === true) {
				return _cur;
			}
		}
		return null;
	})(function (w) {
		if (w.QZFL && w.QZFL.FormSender && w.QZFL.cookie) {
			win = w;
			return true;
		}
	});
	var host = win.location.host,
		cookieflag = win.QZFL.cookie.get('blabla') == 'dynamic',
		extend = QZFL.object.extend;
	return function() {
		// 记录一个开始时间点
		this.startTime = +new Date;
		var isspeedup = cookieflag && (/(?:user\.(s\d\.)?|\d{5,}\.|rc\.)qzone\.qq\.com/.test(host)),
			realurl = this.uri + (this.uri.indexOf('?') > -1 ? '&' : '?') + 'g_tk=' + QZFL.pluginsDefine.getACSRFToken(),
			ajaxurl = isspeedup ? ('http://' + host + '/proxy') : realurl,
			canUseXHR = win.QZFL.config.canUseXHR2;
		// iframe请求代理到父页面
		// 加一个xhrProxyEnable的配置 以防失败时直接切回原来的模式
		// 利用白名单 对目标url符合白名单才进行xhr请求代理
		// 只针对utf-8编码才进行
		if (this.charset == 'utf-8') {
			if (1
				&& win.QZFL && win.QZFL.FormSender
				// #1.可以使用代理并且允许使用
				// #2.可以使用xhr2
				&& ((isspeedup && win.QZFL.config.xhrProxyEnable && win.QZFL.config.xhrProxyEnable(realurl) == 1) || (canUseXHR && canUseXHR(ajaxurl)))) {
				var data = typeof this.data == 'object' ? extend(this.data, {qzreferrer: location.href}) : [this.data, 'qzreferrer=' + encodeURIComponent(location.href)].join('&');

				return (this.postTime = +new Date, this.type = 'xhr'), win.QZFL.ajaxPost(ajaxurl, data, {
					onload: this.onSuccess,
					instance: this,
					headers: isspeedup ? {
						'X-Real-Url': realurl
					} : {}
				});
			}
		}

		if (this._sender === null || this._sender === void(0)) {
			var timer
				, sender = document.createElement("iframe")
				;

			sender.id = sender.name = "_fp_frm_" + this.name;
			sender.style.cssText = "width:0;height:0;border-width:0;display:none;";

			sender.callback = (function(th) {
				return function(){
					th.resultArgs = arguments;
					th.msg = 'ok';
					th.onSuccess.apply(th, arguments);
					win.QZFL.FormSender._clear(th);
				}
			}) (this);

			var errcallback = (function (th) {
				var f = function () {
					th.resultArgs = arguments;
					th.msg = QZFL.FormSender._errCodeMap[999].msg;
					win.QZFL.FormSender._pluginsRunner('onErrorHandler', th);
					win.QZFL.FormSender._clear(th);
					th.onError();
				};
				return function () {
					// th.resultArgs存在则已触发成功回调了
					// ie下如果src没设上则证明是初始化的
					// 非ie如果进入这里则已经证明其出错了
					if (typeof th.resultArgs == 'object') {
						return;
					}
					if (this.readyState == 'complete' || typeof this.readyState == 'undefined') {
						if ('sended'.indexOf(this.state) > -1) {
							this.onload = this.onreadystatechange = null;
							f();
						}
					}
				}
			}) (this);

			document.body.appendChild(sender);
			sender.errorCallback = errcallback;
			sender.onload = sender.onreadystatechange = errcallback;
			sender.state = 'initing';
			this._sender = sender;
		}

		if(!this.instanceForm){
			var t = this, ie = QZFL.userAgent.ie, ifrurl, ifrHTML, data = t.data;
			ifrHTML = '<!DOCTYPE html><html lang="zh-cn"><head><meta http-equiv="content-type" content="text/html; charset=' + t.charset + '" /><meta charset="' + t.charset + '" />';
			if (ie) {
				ifrurl = 'javascript:document.open();document.domain="' + document.domain + '";var me=parent.QZFL.FormSender.instance["' + t.name + '"];document.write(me.ifrHTML);document.close();';
			}
			ifrHTML = ifrHTML + '<script type="text/javascript">' + (ie && ('document.charset="' + t.charset + '"')||'') + ';document.domain="' + document.domain + '";frameElement.submited=void(0);frameElement.state="sending";<\/script><\/head><body>';
			ifrHTML = ifrHTML + '<form action="'+ t.uri + (t.uri.indexOf('?') > -1 ? '&' : '?') + 'g_tk=' + QZFL.pluginsDefine.getACSRFToken() + '" accept-charset="' + t.charset + '" id="p" enctype="application/x-www-form-urlencoded;charset=' + t.charset + '" method="post">';
			ifrHTML = ifrHTML + '<input type="hidden" name="qzreferrer" id="qzreferrer" />';
			ifrHTML = ifrHTML + '<\/form><script type="text/javascript">var me=parent.QZFL.FormSender.instance["' + t.name + '"],doc=document,f=doc.getElementById("p"),d=me.jsonData,fg=doc.createDocumentFragment();if(typeof d=="string"){var l=d.split("&");for(var i=0;i<l.length;i++){var kv=l[i].split("=");var ipt=doc.createElement("input");ipt.type="hidden";ipt.name=kv[0];var v=kv[1];try{v=decodeURIComponent(v);}catch(e) {}ipt.value=v;fg.appendChild(ipt);}}else{for(var i in d){var ipt=doc.createElement("input");ipt.type="hidden";ipt.name=i;ipt.value=d[i];fg.appendChild(ipt);}}f.appendChild(fg);doc.getElementById("qzreferrer").value=parent.location.href;f.submit();me.postTime=+new Date;frameElement.submited=true;frameElement.state="sended";<\/script><\/body><\/html>';
			t.ifrHTML = ifrHTML;
			t.ifrurl = ifrurl;
			t.jsonData = data;
			ie ? setTimeout((function (th) {
					return function() {
						th._sender.state = 'inited';
						th._sender.src = th.ifrurl;
					}
				}) (t), 10) : (sender.src = 'javascript:;');
			if (!ie) {
				var d = sender.contentDocument || sender.contentWindow.document;
				if (d) {
					d.open();
					d.write(t.ifrHTML);
					d.close();
				}
			}
		}else{
			this.instanceForm.target = (sender.name = sender.id);
			this._sender.submited = true;
			this.instanceForm.submit();
		}
		return true;
	};
}) ();

/**
 * QZFL.FormSender对象自毁方法，用法 ins=ins.destroy();
 *
 * @return {Object} null用来复写引用本身
 */
QZFL.FormSender.prototype.destroy = function() {
	var n = this.name;
	delete QZFL.FormSender.instance[n]._sender;
	QZFL.FormSender.instance[n]._sender = null;
	delete QZFL.FormSender.instance[n];
	QZFL.FormSender.counter--;
	return null;
};



/////////////
//json.js
/////////////


/**
 * @fileoverview QZFL JSON类
 * @version 1.$Rev: 1895 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-12-27 20:19:39 +0800 (周一, 27 十二月 2010) $
 */

/**
 * JSONGetter通信器类,建议使用进行读操作的时候使用

 * @class JSONGetter通信器类
 * @param {string} actionURI 请求地址
 * @param {string} cname 可选，对象实体的索引名，默认是"_jsonInstence_n"，n为序号
 * @param {object} data 可选，hashTable形式的字典
 * @param {string} charset 所拉取数据的字符集
 * @param {boolean} [junctionMode=false] 使用插入script标签的方式拉取
 * @constructor
 * @example
 * 		var _loader = new QZFL.JSONGetter(GET_QUESTIONS_URL, void (0), {"uin": getParameter("uin"), "rd": Math.random()}, "utf-8");
 *		_loader.onSuccess = function(re){};
 *		_loader.send("_Callback");
 *		_loader.onError = function(){};
 */
QZFL.JSONGetter = function(actionURL, cname, data, charset, junctionMode) {
	if (QZFL.object.getType(cname) != "string") {
		cname = "_jsonInstence_" + (QZFL.JSONGetter.counter + 1);
	}
	
	var prot = QZFL.JSONGetter.instance[cname];
	if (prot instanceof QZFL.JSONGetter) {
		//ignore
	} else {
		QZFL.JSONGetter.instance[cname] = prot = this;
		QZFL.JSONGetter.counter++;

		prot._name = cname;
		prot._sender = null;
		prot._timer = null;

		// 记录开始请求的时间点
		this.startTime = +new Date;
		
		/**
		 * 回调成功执行
		 * 
		 * @event
		 */
		this.onSuccess = QZFL.emptyFn;

		/**
		 * 解释失败
		 * 
		 * @event
		 */
		this.onError = QZFL.emptyFn;
		
		/**
		 * 当数据超时的时候
		 * 
		 * @event
		 */
		this.onTimeout = QZFL.emptyFn;
		
		/**
		 * 超时设置,默认5秒钟
		 */
		this.timeout = 5000;
		
		/**
		 * 抛出清理接口
		 */
		this.clear = QZFL.emptyFn;

		this.ownerWindow = window;

		this._baseClear = function(){
			this._waiting = false;
			this._squeue = [];
			this._equeue = [];
			this.onSuccess = this.onError = QZFL.emptyFn;
			this.clear = null;
		};
	}

	prot._uri = actionURL;
	prot._data = (data && (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == "string")) ? data : null;
	prot._charset = (QZFL.object.getType(charset) != 'string') ? QZFL.config.defaultDataCharacterSet : charset;
	prot._jMode = !!junctionMode;

	return prot;
};

QZFL.JSONGetter.instance = {};
QZFL.JSONGetter.counter = 0;

QZFL.JSONGetter._errCodeMap = {
	999 : {
		msg : 'Connection or Server error.'
	},
	998 : {
		msg : 'Connection to Server timeout.'
	}
};

QZFL.JSONGetter.genHttpParamString = function(o){
	var r = [];

	for (var i in o) {
		r.push(i + "=" + encodeURIComponent(o[i]));
	}

	return r.join("&");
};

/**
 * 添加一个成功回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnSuccess = function(f){
	if(typeof(f) == "function"){
		if(this._squeue && this._squeue.push){

		}else{
			this._squeue = [];
		}
		this._squeue.push(f);
	}
};


QZFL.JSONGetter._runFnQueue = function(q, resultArgs, th){
	var f;
	if(q && q.length){
		while(q.length > 0){
			f = q.shift();
			if(typeof(f) == "function"){
				f.apply(th ? th : null, resultArgs);
			}
		}
	}
	th.endTime = +new Date;
	th.resultArgs = resultArgs;
	QZFL.JSONGetter._pluginsRunner("onRequestComplete", th); //sds 用插件来跑一下url做插接功能，如反CSRF组件
};

/**
 * 添加一个失败回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnError = function(f){
	if(typeof(f) == "function"){
		if(this._equeue && this._equeue.push){

		}else{
			this._equeue = [];
		}
		this._equeue.push(f);
	}
};


QZFL.JSONGetter.pluginsPool = {
	"srcStringHandler" : []
	, "onErrorHandler" : []
	, "onRequestComplete" : []
};

QZFL.JSONGetter._pluginsRunner = function(pType, data){
	var _s = QZFL.JSONGetter,
		l = _s.pluginsPool[pType],
		t = data,
		len;

	if(l && (len = l.length)){
		for(var i = 0; i < len; ++i){
			if(typeof(l[i]) == "function"){
				t = l[i](t);
			}
		}
	}

	return t;
};


QZFL.JSONGetter.prototype.send = function(callbackFnName) {
	if(this._waiting){ //已经在请求中那么就不再发请求了
		return;
	}

	var clear,
		cfn = (QZFL.object.getType(callbackFnName) != 'string') ? "callback" : callbackFnName,
		da = this._uri;
		
	if(this._data){
		da += (da.indexOf("?") < 0 ? "?" : "&") + ((typeof(this._data) == "object") ? QZFL.JSONGetter.genHttpParamString(this._data) : this._data);
	}

	da = QZFL.JSONGetter._pluginsRunner("srcStringHandler", da); //sds 用插件来跑一下url做插接功能，如反CSRF组件
	
	//传说中的jMode... 欲知详情，请咨询哓哓同学
	if(this._jMode){
		window[cfn] = this.onSuccess;
		var _sd = new QZFL.JsLoader();
		_sd.onerror = this.onError;
		_sd.load(da,void(0),this._charset);
		return;
	}

	//设置超时点
	this._timer = setTimeout(
			(function(th){
				return function(){
						//QZFL.console.print("jsonGetter timeout", 3);
						//TODO timeout can't push in success or failed... zishunchen 
						th._waiting = false;
						th.onTimeout();
					};
				})(this),
			this.timeout
		);
	
	//IE10 Customer Preview 这里不能用df甚至hf了，搞到下面的分支去
	if (QZFL.userAgent.ie && (typeof document.documentMode == 'undefined' || document.documentMode < 10) && !(QZFL.userAgent.beta && navigator.appVersion.indexOf("Trident\/4.0") > -1)) { // IE8之前的方案.确定要平稳迁移么
		var df = document.createDocumentFragment()
			,sender = document.createElement("script")
			;//sds 加个IE > 9兼容
		
		sender.charset = this._charset;
		
		this._senderDoc = df;
		this._sender = sender;
		
		//回调后清理
		this.clear = clear = function(o){
			clearTimeout(o._timer);
			if (o._sender) {
				o._sender.onreadystatechange = null;
			}
			df['callback'] = df['_Callback'] = df[cfn] = null;
			df = o._senderDoc = o._sender = null;
			o._baseClear();
		};
		
		//成功回调
		df['callback'] = df['_Callback'] = df[cfn] = (function(th){
				return (function(){
					th._waiting = false;
					th.onSuccess.apply(th, arguments);
					QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
					clear(th);
				});
			})(this);
		
		//用来模拟ie在加载失败的情况
		if(QZFL.userAgent.ie<9){
			sender.onreadystatechange = (function(th){
				return (function(){
					if (th._sender && th._sender.readyState == "loaded") {
						try {
							th._onError();
						} catch (ignore) {}
					}
				});
			})(this);
		} else {
			sender.onerror = (function(th){
				return (function(){
					try {
						th._onError();
					} catch (ignore) {}
				});
			})(this);
		}
			
		this._waiting = true;
		
		df.appendChild(sender);
		this._sender.src = da;

	} else {
		//回调后清理
		this.clear = clear = function(o) {
			//QZFL.console.print(o._timer);
			clearTimeout(o._timer);
			o._baseClear();
		};
		
		//全局执行的函数申明
		window[cfn] = function() {
			QZFL.JSONGetter.args = arguments;
		};	
		
		// 全局执行完毕回收节点触发回调
		var callback = (function(th) {
			return function() {
				th.onSuccess.apply(th, QZFL.JSONGetter.args);
				QZFL.JSONGetter._runFnQueue(th._squeue, QZFL.JSONGetter.args, th);
				QZFL.JSONGetter.args = [];
				clear(th);
			}
		})(this);
		// 失败回调
		var _ecb = (function(th){
			return (function() {
				th._waiting = false;
				var _eo = QZFL.JSONGetter._errCodeMap[999];
				th.msg = _eo.msg;
				th.onError(_eo);
				QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
				clear(th);
			});
		})(this);

		var h = document.getElementsByTagName('head'), node;
		h = h && h[0] || document.body;
		if (!h)
			return;
		var baseElement = h.getElementsByTagName('base')[0];
		node = document.createElement('script');
		node.charset = this._charset || 'utf-8';
		node.onload = function () {
			this.onload = null;
			if (node.parentNode) {
				h.removeChild(node);
			}
			callback();
			node = void(0);
		};
		node.onerror = function () {
			this.onerror = null;
			_ecb();
		}
		node.src = da;
		baseElement ? h.insertBefore(node, baseElement) : h.appendChild(node);
	}
};
QZFL.JSONGetter.prototype._onError = function() {
	this._waiting = false;
	var _eo = QZFL.JSONGetter._errCodeMap[999];
	this.msg = _eo.msg;
	this.onError(_eo);
	QZFL.JSONGetter._runFnQueue(this._equeue, [_eo], this);

	QZFL.JSONGetter._pluginsRunner("onErrorHandler", this); //sds 用插件来跑一下url做插接功能，如反CSRF组件


	this.clear(this);
};

/**
 * QZFL.JSONGetter对象自毁方法，用法 ins=ins.destroy();
 * @deprecated 这个没有存在的价值
 * @returns {object} null用来复写引用本身
 */
QZFL.JSONGetter.prototype.destroy = QZFL.emptyFn;




















/***************************************** :) *****************************************************/
/**
 * 目前已经能完成数据请求功能，要注意，现在的调用方式和以前的不同
 * 未完成功能：
 * 	1. 对proxy cache里df或者frame进行延时清理，保持在一个或者两个就够了
 * 	2. 上报功能
 * 	3. addOnSuccess, addOnError
 * 	4. 对IE8 beta版进行提示，不再支持，现在是用frame实现的
 * /

QZFL.JSONGetterBeta = function(url){
	this.url = url;
	this.charset = QZFL.config.defaultDataCharacterSet;
	this.onTimeout = this.onSuccess = this.onError = QZFL.emptyFn;
};
QZFL.JSONGetterBeta.prototype.setCharset = function(charset){
	if (typeof(charset) == 'string') {
		this.charset = charset;
	}
};
QZFL.JSONGetterBeta.prototype.setQueryString = function(data){
	var type;
	if (data && ((type = typeof(data)) == 'object' || type == 'string')) {
		if (type == 'object') {
			var r = [];
			for (var k in data) {
				r.push(k + "=" + encodeURIComponent(data[k]));
			}
			data = r.join("&");
		}
		this.url += (this.url.indexOf("?") < 0 ? "?" : "&") + data;
	}
};
QZFL.JSONGetterBeta.prototype.send = function(cbFnName){
	cbFnName = cbFnName || 'callback';
	var me = this, proxy = QZFL.JSONGetterBeta.getProxy(), tmp;
	if (QZFL.JSONGetterBeta.isUseDF) {
		var scrpt = proxy.createElement("script");
		scrpt.charset = this.charset;
		proxy.appendChild(scrpt);
		
		proxy[cbFnName] = function(){
			proxy.requesting = false;
			me.onSuccess.apply(null, Array.prototype.slice.call(arguments));
			scrpt.removeNode(true);
			QZFL.console.print('request finish : ' + me.url);
			scrpt = scrpt.onreadystatechange = me = proxy = proxy[cbFnName] = null;
		};
		
		scrpt.onreadystatechange = function(){
			if (scrpt.readyState == "loaded") {
				proxy.requesting = false;
				me.onError({
					ret: 999,
					msg: 'Connection or Server error.'
				});
				scrpt.removeNode(true);
				QZFL.console.print('request Error : ' + me.url);
				scrpt = scrpt.onreadystatechange = me = proxy = proxy[cbFnName] = null;
			}
		};
		
		proxy.requesting = true;
		scrpt.src = this.url;
	} else {
		proxy.style.width = proxy.style.height = proxy.style.borderWidth = "0";
		
		proxy.callback = function(){
			proxy.requesting = false;
			me.onSuccess.apply(null, Array.prototype.slice.call(arguments));
			var win = proxy.contentWindow;
			clearTimeout(win.timer);
			var scrpts = win.document.getElementsByTagName('script');
			for (var i = 0, l = scrpts.length; i < l; i++) {
				QZFL.dom.removeElement(scrpts[i]);
			}
			QZFL.console.print('request finish : ' + me.url);
			me = proxy = proxy.callback = proxy.errorCallback = null;
		};
		proxy.errorCallback = function(){
			proxy.requesting = false;
			me.onError.apply(null, [{
				ret: 999,
				msg: 'Connection or Server error.'
			}]);
			var win = proxy.contentWindow;
			clearTimeout(win.timer);
			var scrpts = win.document.getElementsByTagName('script');
			for (var i = 0, l = scrpts.length; i < l; i++) {
				QZFL.dom.removeElement(scrpts[i]);
			}
			QZFL.console.print('request Error : ' + me.url);
			me = proxy = proxy.callback = proxy.errorCallback = null;
		};
		var dm = (document.domain == location.host) ? '' : 'document.domain="' + document.domain + '";', 
			html = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this.charset + '"/></head><body><script>' + dm + ';function ' + cbFnName + '(){frameElement.callback.apply(null, arguments);}<\/script><script charset="' + this.charset + '" src="' + this.url + '"><\/script><script>timer=setTimeout(frameElement.errorCallback,50);<\/script></body></html>';
		
		proxy.requesting = true;
		if (QZFL.userAgent.opera || QZFL.userAgent.firefox < 3) {
			proxy.src = "javascript:'" + html + "'";
			document.body.appendChild(proxy);
		} else {
			document.body.appendChild(proxy);
			(tmp = proxy.contentWindow.document).open('text/html');
			tmp.write(html);
			tmp.close();
		}
	}
};
QZFL.JSONGetterBeta.getProxy = function(){
	for (var p, i = 0, len = QZFL.JSONGetterBeta.proxy.length; i < len; i++) {
		if ((p = QZFL.JSONGetterBeta.proxy[i]) && !p.requesting) {
			QZFL.console.print('找到第' + i + '个代理可用');
			return p;
		}
	}
	QZFL.console.print('没有可用的代理，创建一个新的');
	QZFL.JSONGetterBeta.proxy.push(p = QZFL.JSONGetterBeta.isUseDF ? document.createDocumentFragment() : document.createElement("iframe"));
	return p;
};
QZFL.JSONGetterBeta.proxy = [];
QZFL.JSONGetterBeta.isUseDF = QZFL.userAgent.ie && !QZFL.userAgent.beta;


//以下是几个测试用例
var jg = new QZFL.JSONGetterBeta('http://u.qzone.qq.com/cgi-bin/qzone_static_widget?fs=1&uin=20050606&timestamp=0');
jg.onSuccess = function(o){QZFL.console.print(o['_2_0']._uname_);};
jg.send('staticData_Callback');

var jg2 = new QZFL.JSONGetterBeta('http://g.qzone.qq.com/fcg-bin/cgi_emotion_list.fcg?uin=20050606&loginUin=0&s=820043');
jg2.onSuccess = function(o){QZFL.console.print(o.visitcount);};
jg2.send('visitCountCallBack');

var jg1 = new QZFL.JSONGetterBeta('http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=20050606&r=0.39620088664296915');
jg1.onSuccess = function(o){QZFL.console.print(o.todayPV);};
jg1.send('QZonePGVDataCallBack1');

var jg3 = new QZFL.JSONGetterBeta('http://u.qzone.qq.com/cgi-bin/qzone_static_widget?fs=1&uin=20050606&timestamp=0&r=' + Math.random());
jg3.onSuccess = function(o){QZFL.console.print(o['_2_0']._uname_);};
jg3.send('staticData_Callback');

var jg4 = new QZFL.JSONGetterBeta('http://n.qzone.qq.com/cgi-bin/pvuv/set_pvuv?uin=20050606&r=0.39620088664296915&r=' + Math.random());
jg4.onSuccess = function(o){QZFL.console.print(o.todayPV);};
jg4.send('QZonePGVDataCallBack1');

var jg5 = new QZFL.JSONGetterBeta('http://g.qzone.qq.com/fcg-bin/cgi_emotion_list.fcg?uin=20050606&loginUin=0&s=820043&r=' + Math.random());
jg5.onSuccess = function(o){QZFL.console.print(o.visitcount);};
jg5.send('visitCountCallBack');

 * 
 * 
 */



/////////////
//ping_sender.js
/////////////


/*****************************************************************************************/

/**
 * @fileoverview 发一个简短get请求的组件
 * @author scorpionxu
 * @version 1.0
 */


window.QZFL = window.QZFL || {};

/**
 * 简单get请求发送器
 * @namespace
 * @param {string} url 请求url
 * @param {number} [t = 0] 请求延迟时延，单位ms
 * @param {object} [opts = {}] 可选参数包
 * @param {function} [opts.load = QZFL.emptyFn] 成功回调
 *     回调模型
 *          param {object} info 回调信息说明
 *          param {number} info.duration 总延迟时间
 *          param {string} info.type 回调类型 'load', 'error', 'timeout' 成功，错误，超时 三类回调
 *         function(info){
 *         }
 * @param {function} [opts.error = QZFL.emptyFn] 失败回调
 * @param {function} [opts.timeout = QZFL.emptyFn] 超时回调
 * @param {number} [opts.timeoutValue = opts.timeout ? 5000 : undefined] 超时时间
 *
 */
QZFL.pingSender = function(url, t, opts){
	var _s = QZFL.pingSender,
		iid,
		img;

	if(!url){
		return;
	}

	opts = opts || {};
	
	iid = "sndImg_" + _s._sndCount++;
	img = _s._sndPool[iid] = new Image();
	img.iid = iid;
	img.onload = img.onerror = img.ontimeout = (function(t){
		return function(evt){
			evt = evt || window.event || { type : 'timeout' };
			void(typeof(opts[evt.type]) == 'function' ? setTimeout(
				(function(et, ti){
					return function(){
						opts[et]({ 'type' : et, 'duration' : ((new Date()).getTime() - ti) });
					};
				})(evt.type, t._s_)
				, 0) : 0);
			QZFL.pingSender._clearFn(evt, t);
		};
	})(img);

	(typeof(opts.timeout) == 'function') && setTimeout(function(){
					img.ontimeout && img.ontimeout({ type : 'timeout' });
				}, (typeof(opts.timeoutValue) == 'number' ? Math.max(100, opts.timeoutValue) : 5000));

	void((typeof(t) == 'number') ? setTimeout(function(){
		img._s_ = (new Date()).getTime();
		img.src = url;
	}, (t = Math.max(0, t))) : (img.src = url));
};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndPool = {};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndCount = 0;

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._clearFn = function(evt, ref){
	//evt = evt || window.event;
	var _s = QZFL.pingSender;
	if(ref){
		_s._sndPool[ref.iid] = ref.onload = ref.onerror = ref.ontimeout = ref._s_ = null;
		delete _s._sndPool[ref.iid];
		_s._sndCount--;
		ref = null;
	}
};




/////////////
//media.js
/////////////


/**
 * @fileoverview QZFL 多媒体类
 * @version 1.$Rev: 1924 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:52:16 +0800 (周二, 11 一月 2011) $
 */
/**
 * 增强对flash, wmp等多媒体控件的处理
 *
 * @namespace QZFL.media
 */
QZFL.media = {
	_tempImageList : [],

	_flashVersion : null,
	/*
	 * 获取图片信息，如长短边比例，以及哪条是长边哪条是短边
	 * img Element||String 待分析图片的节点或者src
	 * opts{
	 *		ow:原始宽度
	 *		oh:原始高度
	 *		errCallback
	 * }
	 * return {
	 *		direction : [长边长度属性名,短边长度属性名],
	 *		rate : 长边和短边的比值
	 }
	 */
	getImageInfo : (function(){
		var _getInfo = function(img,callback,opts){
			if(img){
				var _w = opts.ow || img.width, _h = opts.oh || img.height, r,ls,ss,d;
				if(_w && _h){
					if(_w >=_h){
						ls = _w;
						ss = _h;
						d = ["width","height"];
					}else{
						ls = _h;
						ss = _w;
						d = ["height","width"];
					}
					r = {
						direction:d,
						rate : ls/ ss,
						longSize :ls,
						shortSize :ss
					};
					r.ow = _w;
					r.oh = _h;
				}
				QZFL.lang.isFunction(callback) && callback(img,r,opts);
			}
		};

		return function( callback, opts){
			opts = opts || {};
			if( QZFL.lang.isString( opts.trueSrc ) ){
				var _i = new Image();
				_i.onload = (function(ele, cb, p){
					return function(){
						_getInfo( ele, cb, p );
						ele = ele.onerror =  ele.onload = null;
					};
				})(_i, callback, opts);

				_i.onerror =  (function(ele, cb, p){
					return function(){
						if (typeof(p.errCallback) == 'function') {
							p.errCallback();
						}
						ele = ele.onerror =  ele.onload = null;
					};
				})(_i, callback, opts);

				_i.src = opts.trueSrc;
			}else if( QZFL.lang.isElement( opts.img ) ){
				_getInfo( opts.img, callback, opts );
			}
		};
	})(),
	/**
	 * 按比例调节图的大小
	 * @example
	 * 			<img src="b.gif" onload="QZFL.media.adjustImageSize(200,150,'http://www.true.com/true.jpg')" />
	 * @param {Number} w 期望宽度上限
	 * @param {Number} h 期望高度上限
	 * @param {String} trueSrc 真正地图片源
	 * @param {Function} callback 图片大小调整完成后的回调
	 */
	adjustImageSize : function(w, h, trueSrc, callback,errCallback) {
		var opts = {trueSrc:trueSrc,callback:function(cb){
			return function(o, type, ew, eh, p){
				//兼容久方法，不得不以这个形式传参给回调，但增加一个参数，把照片压缩的信息全部传进去
				QZFL.lang.isFunction(cb) && cb(o, ew, eh, null, p.ow, p.oh,p);
			};
		}(callback),errCallback:errCallback};
		QZFL.media.reduceImage( 0, w, h, opts);
	},

	/**
	 * 生成flash的描述HTML
	 *
	 * @param {Object} flashArguments 以hashTable描述的flash参数集合,flashUrl请用"src"
	 * @param {QZFL.media.SWFVersion} requiredVersion
	 *            所需要的flashPlayer的版本，QZFL.media.SWFVersion的实例
	 * @param {String} flashPlayerCID flash在IE中使用的classID,可选
	 * @return {String} 生成的HTML代码
	 * @example
	 * 			var swf_html = QZFL.media.getFlashHtml({
	 *									"src" :"your flash url",
	 *									"width" : "100%",
	 *									"height" : "100%",
	 *									"allowScriptAccess" : "always",
	 *									"id" : "avatar",
	 *									"name" : "avatar",
	 *									"wmode" : "opaque",
	 *                                  "noSrc" : false
	 *						});
	 */
	getFlashHtml : function(flashArguments, requiredVersion, flashPlayerCID) {
		var _attrs = [],
			_params = [];

		for (var k in flashArguments) {
			switch (k) {
				case "noSrc" :
				case "movie" :
					continue; //sds 这里是不处理的特性
					break;
				case "id" :
				case "name" :
				case "width" :
				case "height" :
				case "style" :
					if(typeof(flashArguments[k]) != 'undefined'){
						_attrs.push(' ', k, '="', flashArguments[k], '"');
					}
					break;
				case "src" :
					if (QZFL.userAgent.ie) {
						_params.push('<param name="movie" value="', (flashArguments.noSrc ? "" : flashArguments[k]), '"/>');
					//	_params.push('<param name="movie" value="', flashArguments[k], '"/>');
					}else{
						_attrs.push(' data="', (flashArguments.noSrc ? "" : flashArguments[k]), '"');
					}
					break;
				default :
					_params.push('<param name="', k, '" value="', flashArguments[k], '" />');
			}
		}
		
		
		if (QZFL.userAgent.ie) {
			_attrs.push(' classid="clsid:', flashPlayerCID || 'D27CDB6E-AE6D-11cf-96B8-444553540000', '"',
				' data="',flashArguments.src||'','"');
		}else{
			_attrs.push(' type="application/x-shockwave-flash"');
		}
	 	
		if (requiredVersion && (requiredVersion instanceof QZFL.media.SWFVersion)) {
			var _ver = QZFL.media.getFlashVersion().major,
				_needVer = requiredVersion.major;

			//当没有安装并且应用没有刻意指定的时候，走Codebase路线
			_attrs.push(' codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=', requiredVersion, '"');
		}

		return "<object" + _attrs.join("") + ">" + _params.join("") + "</object>";
	},
	

	/**
	 * 对调用方给出的一个节点插入需要的flash object
	 * @param {HTMLElement} containerElement 容器节点，必须
	 * @param {Object} flashArguments @see QZFL.media.getFlashHtml()
	 * @return {boolean} 是否成功
	 *
	 *
	 */
	insertFlash : function(containerElement, flashArguments){
		if(!containerElement || typeof(containerElement.innerHTML) == "undefined"){
			return false;
		}
		flashArguments = flashArguments || {};
		flashArguments.src = flashArguments.src || "";
		flashArguments.width = flashArguments.width || "100%";
		flashArguments.height = flashArguments.height || "100%";

		flashArguments.noSrc = true;

		containerElement.innerHTML = QZFL.media.getFlashHtml(flashArguments);
		var f = containerElement.firstChild;

		if(QZFL.userAgent.ie){
			setTimeout(function(){
					try{ f.LoadMovie(0, flashArguments.src); }catch(ign){}
				}, 0);
		}else{
			f.setAttribute("data", flashArguments.src);
		}
		return true;
	},

	/*
	 * 生成Windows Media Player的HTML描述
	 * @example
	 * 			var wmphtml=QZFL.media.getWMMHtml({id:'qzfl_media',name:'qzfl_wmp',width:'300px',height:'200px',src:'#',style:''});
	 */
	getWMMHtml : function(wmpArguments, cid) {
		var params = [],
			objArgm = [];

		for (var k in wmpArguments) {
			switch (k) {
				case "id" :
				case "width" :
				case "height" :
				case "style" :
				case "src" :
					objArgm.push(' ', k, '="', wmpArguments[k], '"');
					break;
				default :
					objArgm.push(' ', k, '="', wmpArguments[k], '"');
					params.push('<param name="', k, '" value="', wmpArguments[k], '" />');
			}
		}
		if (wmpArguments["src"]) {
			params.push('<param name="URL" value="', wmpArguments["src"], '" />');
		}

		if (QZFL.userAgent.ie) {
			return '<object classid="' + (cid || "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6") + '" ' + objArgm.join("") + '>' + params.join("") + '</object>';
		} else {
			return '<embed ' + objArgm.join("") + '></embed>';
		}
	}
};

/**
 * flash版本号显示器
 *
 * @param {Number} arguments...
 *            可变参数，一系列数字，前4个是flash的四段版本号，也可以单数组传入，也可以只使用一个整数表示主版本号
 * @constructor
 */
QZFL.media.SWFVersion = function() {
	var a;
	if (arguments.length > 1) {
		a = arg2arr(arguments);
	} else if (arguments.length == 1) {
		if (typeof(arguments[0]) == "object") {
			a = arguments[0];
		} else if (typeof arguments[0] == 'number') {
			a = [arguments[0]];
		} else {
			a = [];
		}
	} else {
		a = [];
	}

	this.major = parseInt(a[0], 10) || 0;
	this.minor = parseInt(a[1], 10) || 0;
	this.rev = parseInt(a[2], 10) || 0;
	this.add = parseInt(a[3], 10) || 0;
};

/**
 * flash版本显示器序列化方法
 *
 * @param {Object} spliter 版本号显示，数字分隔符
 * @return {String} 一个描述flashPlayer版本号的字符串
 */
QZFL.media.SWFVersion.prototype.toString = function(spliter) {
	return ([this.major, this.minor, this.rev, this.add])
			.join((typeof spliter == 'undefined') ? "," : spliter);
};
/**
 * flash版本显示器序列化方法
 *
 * @return {String} 一个描述flashPlayer版本号的数字
 */
QZFL.media.SWFVersion.prototype.toNumber = function() {
	var se = 0.001;
	return this.major + this.minor * se + this.rev * se * se + this.add * se * se * se;
};

/**
 * 获取当前浏览器上安装的flashPlayer的版本，未安装返回的实例toNumber()方法等于0
 *
 * @return {Object} 返回QZFL.media.SWFVersion的实例 {major,minor,rev,add}
 * @example
 * 			QZFL.media.getFlashVersion();
 */
QZFL.media.getFlashVersion = function() {
	if (!QZFL.media._flashVersion) {
		var resv = 0;
		if (navigator.plugins && navigator.mimeTypes.length) {
			var x = navigator.plugins['Shockwave Flash'];
			if (x && x.description) {
				resv = x.description.replace(/(?:[a-z]|[A-Z]|\s)+/, "")
						.replace(/(?:\s+r|\s+b[0-9]+)/, ".").split(".");
			}
		} else {
			try {
				for (var i = (resv = 6), axo = new Object(); axo != null; ++i) {
					axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
					resv = i;
				}
			} catch (e) {
				if (resv == 6) {
					resv = 0;
				}//6都没有就当没安装吧
				resv = Math.max(resv - 1, 0);
			}
			try {
				resv = new QZFL.media.SWFVersion(axo.GetVariable("$version")
						.split(" ")[1].split(","));
			} catch (ignore) {}
		}
		if (!(resv instanceof QZFL.media.SWFVersion)) {
			resv = new QZFL.media.SWFVersion(resv);
		}

		if (resv.major < 3) {
			resv.major = 0;
		}
		QZFL.media._flashVersion = resv;
	}
	return QZFL.media._flashVersion;
};
/*
 * @author heliosliu
 * @param {number} type	压缩类型,1是按短边压缩，0是按长边压缩
 * @param {number} ew	最大宽度
 * @param {number} eh	最大高度
 * @param {object} opts{
 *		direction : [长边长度属性名,短边长度属性名],
 *		rate : 长边和短边的比值,
 *		callback : 回调函数,
 *		ow:	原始宽度
 *		oh:	原始高度
 *		img	待压缩的图片
 *		trueSrc : 实际地址
 *  }
 * @example <img src="b.gif" onload="QZFL.media.reduceImage(1,60,45,{callback:QZFL.emptyFn,eroCallback:QZFL.emptyFn,trueSrc:'http://www.true.com/true.jpg'});" /> 
 */
QZFL.media.reduceImage = (function(){
	var doReduce = function(o, type, ew, eh, p, cb){
		var rl, k;
		if(p.rate==1){
			p.direction[0] = ( ew>eh ? 'height' : 'width');
			p.direction[1] = ( ew>eh ? 'width' : 'height');
		}
		rl = ( p.direction[type] == "width" ? ew : eh );
		type ?
			( ( ( rl>p.shortSize ) ? ( rl = p.shortSize ) : 1 ) && ( p.k = p.shortSize/rl ) )
		:
			( ( ( rl>p.longSize ) ? ( rl = p.longSize ) : 1 ) && ( p.k = p.longSize/rl ) );
		o.setAttribute(p.direction[type],rl);

		QZFL.lang.isFunction(cb) && cb(o, type, ew, eh, p);
	};
	return function( type, ew, eh, opts){//img, 
		opts = opts || {};
		opts.img = ( QZFL.lang.isNode( opts.img ) ? opts.img : QZFL.event.getTarget() );
		opts.img.onload=null;
		opts.trueSrc && (opts.img.src = opts.trueSrc);
		if(opts.img){
			if( ! ( opts.direction && opts.rate && opts.longSize && opts.shortSize ) ){
				r = QZFL.media.getImageInfo(function(o,p){
					if(!o||!p){
						return;
					}
					doReduce(opts.img, type, ew, eh, p, opts.callback)
				},opts);
			}else{
				doReduce(opts.img, type, ew, eh, opts, opts.callback)
			}
		}
	};
})();
QZFL.media.imagePlusUrl = 'http://' + QZFL.config.resourceDomain + '/ac/qzfl/release/widget/smart_image.js?max_age=1209603';
/*
 * @info 详细见smart_image.js
 */
QZFL.media.smartImage = function(w, h, params){
	params = params||{};
	params.img = ( QZFL.lang.isNode( params.img ) ? params.img : QZFL.event.getTarget() );
	QZFL.imports(QZFL.media.imagePlusUrl, (function(w, h ,params){
		return function(){
			QZFL.media.smartImage(w, h,params);
		};
	})(w, h ,params));
};
/*
 * @info 根据给定的图片比例的不同做出不同策略的压缩
 * @info 详细见smart_image.js
 */
QZFL.media.reduceImgByRule = function(  ew, eh, opts, cb){
	opts = opts || {} ;
	opts.img = ( QZFL.lang.isNode( opts.img ) ? opts.img : QZFL.event.getTarget() );
	QZFL.imports(QZFL.media.imagePlusUrl, (function( ew, eh, opts, cb){
		return function(){
			QZFL.media.reduceImgByRule( ew, eh, opts, cb);
		};
	})( ew, eh, opts, cb));
};
//sds 似乎也可以干掉了
//edit by youyeelu
/*
QZFL.media._changeFlashSrc = function(src, installVer, needVer) {
	//当用户安装了flash player，但是没有达到应用要求的版本的时候，走快速安装路线
	if( installVer >= 6 && needVer > installVer){
		src = "http://qzs.qq.com/qzone/flashinstall.swf";
	}
	return src;
};
*/



/////////////
//shareobject.js
/////////////


/**
 * @fileoverview QZFL ShareObject 存储类
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * Qzone 用于基本存储客户端基本信息
 *
 * @namespace QZFL.shareObject
 */
QZFL.shareObject = {};

/**
 * 初始化shareObject
 *
 * @param {String} [path] 要拉起的shareObject swf地址
 * @example
 * 			QZFL.shareObject.create();
 */
QZFL.shareObject.create = function(path) {
	if (typeof(path) == 'undefined') {
		path = QZFL.config.defaultShareObject;
	}
	var t = new QZFL.shareObject.DataBase(path);
};

QZFL.shareObject.instance = {};
QZFL.shareObject.refCount = 0;

/**
 * 获取一个可用的SO
 *
 * @return {Object} ShareObject实例
 * @example
 * 			var so=QZFL.shareObject.getValidSo();//获取一个可用的ShareObject
 */
QZFL.shareObject.getValidSO = function() {
	var cnt = QZFL.shareObject.refCount + 1;
	for (var i = 1; i < cnt + 1; ++i) {
		if (QZFL.shareObject.instance["so_" + i] && QZFL.shareObject.instance["so_" + i]._ready) {
			return QZFL.shareObject.instance["so_" + i];
		}
	}
	return null;
};

/**
 * 获取数据的静态方法
 * @param {String} s 键名
 * @return {All} 存储的值
 * @example
 * 			QZFL.shareObject.get(key);//读取
 */
QZFL.shareObject.get = function(s){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.get(s);
	else return void(0);
};



/**
 * 存入数据的静态方法
 * @param {String} k 键名
 * @param {All} v 值
 * @return {Boolean} 是否成功
 * @example
 * 			QZFL.shareObject.set(key,value);//存入
 */
QZFL.shareObject.set =	function(k, v){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.set(k, v);
	else return false;
};


/**
 * flash客户端存储器构造器，只会在页面创建一个实例
 *
 * @constructor
 */
QZFL.shareObject.DataBase = function(soUrl) {
	/* 限制数目 */
	if (QZFL.shareObject.refCount > 0) {
		return QZFL.shareObject.instance["so_1"];
	}

	//TODO 暂时去掉对SO的判断
	//var fv = QZFL.media.getFlashVersion();
	//if (fv.toNumber() < 8) {
	//	rt.error("flash player version is too low to build a shareObject!");
	//	return null;
	//}

	this._ready = false;

	QZFL.shareObject.refCount++;
	var c = document.createElement("div");
	c.style.height = "0px";
	c.style.overflow = "hidden";//add by joltwang 影响v6自定义皮肤
	//c.className = "qz_v6_so_container"
	//c.style.marginTop = "-1px"; //removed by scorpionxu 这个有严重问题
	document.body.appendChild(c);
	c.innerHTML = QZFL.media.getFlashHtml({
		src : soUrl,
		id : "__so" + QZFL.shareObject.refCount,
		width : 1, //给一点可见性
		height : 0,
		allowscriptaccess : "always"
	});
	this.ele = $("__so" + QZFL.shareObject.refCount);

	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount] = this;
};

/**
 * 以指定键名，存储一个字符串描述的数据
 *
 * @param {String} key 存储的键名
 * @param {String} value 存储的值，必须是字符串类型
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.set = function(key, value) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, value);
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 删除一个已经存储的键
 *
 * @param {String} key 存储的键名
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.del = function(key) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, void(0));
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取指定键名的数据
 *
 * @param {String} key 指定的键名
 * @return {String/Object} 得到的值，null表示不存在
 */
QZFL.shareObject.DataBase.prototype.get = function(key) {
	return (this._ready) ? (this.ele.get(key)) : null;
};
/**
 * 清除所有数据，慎用！
 *
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.clear = function() {
	if (this._ready) {
		this.ele.clear();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取数据长度
 *
 * @return {Number} -1表示失败
 */
QZFL.shareObject.DataBase.prototype.getDataSize = function() {
	if (this._ready) {
		return this.ele.getSize();
	} else {
		return -1;
	}
};
/**
 * 发起连接
 *
 * @param {String} url
 * @param {String} succFnName
 * @param {String} errFnName
 * @param {Object} data
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.load = function(url, succFnName,
		errFnName, data) {
	if (this._ready) {
		this.ele.load(url, succFnName, errFnName, data);
		return true;
	} else {
		return false;
	}
};
/**
 * @ignore
 */
QZFL.shareObject.DataBase.prototype.setReady = function() {
	this._ready = true;
};

/**
 * Flash初始化方法
 *
 * @return {String} flash内部使用
 */
function getShareObjectPrefix() {
	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount].setReady();
	// return location.host.match(/\w+/)[0];
	return location.host.replace(".qzone.qq.com","");
}

/**
 * 复制到剪贴板
 *
 * @param {String} value 要复制的值
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.setClipboard = function(value) {
	if (this._ready && isString(value)) {
		this.ele.setClipboard(value);
		return true;
	} else {
		return false;
	}
};



/////////////
//dragdrop_shell.js
/////////////


/**
 * @fileoverview QZFL 拖拽类
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */

/**
 * 拖拽管理器，负责对dom对象进行拖拽的绑定。
 *
 * @namespace QZFL.dragdrop
 */
QZFL.dragdrop = {

	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/dragdrop.js?max_age=864001",

	/**
	 * 拖拽池，用来记录已经注册拖拽的对象
	 */
	dragdropPool : {},

	/**
	 * 拖拽对象临时ID.
	 *
	 * @ignore
	 */
	count : 0,


	/**
	 * 注册拖拽对象, 注册后，返回拖放描述对象
	 *
	 * @param {HTMLElement} handle 推拽的对象的handler
	 * @param {HTMLElement} target 需要推拽的对象
	 * @param {Object} opts 参数 {range,rangeElement,x,y,ghost,ghostStyle} <br/><br/>
	 *            range [top,left,bottom,right]
	 *            指定一个封闭的拖放区域,参数可以不比全设置留空或设置为非数字如null[top,left,bottom,right]
	 *            是number<br/> rangeElement [element,[top,left,bottom,right],isStatic]
	 *            制定拖放区域的对象，限制物体只能在这个区域内拖放。 [top,left,bottom,right]
	 *            是boolean,rangeElement和target必须是同一个坐标系，而且target必须在rangeElement内
	 *            。isStatic {boolean} 是指 rangeElement 没有使用独立的坐标系(默认值是flase)。
	 *            <br/>
	 *            x,y 刻度偏移量（暂时未支持）<br/> ghost 如果拖放的对象是浮动的，是否拖放出现影子 ghostSize
	 *            鬼影的尺寸，当设置了尺寸，初始位置就以鼠标位置定位了，注意。 ignoreTagName 忽略的tagName.
	 *            一般用来忽略一些 控件等 例如 object embed autoScroll 是否自动滚屏 cursor 鼠标 <br/>
	 *            ghostStyle 设置ghost层次的样式
	 *            <br/><br/>
	 * @returns {object} 返回拖放描述对象
	 * @example
	 * 			QZFL.dragdrop.registerDragdropHandler(this.titleElement,this.mainElement,{range:[0,0,'',''],x:50,y:160});
	 */
	registerDragdropHandler : function(handler, target, opts) {
		var _e = QZFL.event,
			_s = QZFL.dragdrop,
			_hDom = QZFL.dom.get(handler),
			_tDom = QZFL.dom.get(target),
			targetObject;

		opts = opts || {
			range : [null, null, null, null],
			ghost : 0
		};

		if (!(_hDom = _hDom || _tDom)) { //啥都没给还玩神马？
			return null;
		}

		// 拖放目标对象
		targetObject = _tDom || _hDom;

		if (!_hDom.id) {
			_hDom.id = "dragdrop_" + (++_s.count);
		}

		_hDom.style.cursor = opts.cursor || "move";

		_s.dragdropPool[_hDom.id] = {};

		_e.on(_hDom, "mousedown", _s.startDrag, [_hDom.id, targetObject, opts]);

		return _s.dragdropPool[_hDom.id];
	},

	/**
	 * 取消注册拖拽对象
	 *
	 * @param {HTMLElement} handle 推拽的对象的handler
	 */
	unRegisterDragdropHandler : function(handler) {
		var _hDom = QZFL.dom.get(handler),
			_e = QZFL.event;

		if (!_hDom) {
			return null;
		}

		_hDom.style.cursor = "";

		QZFL.dragdrop._oldSD && (_e.removeEvent(_hDom, "mousedown", QZFL.dragdrop._oldSD)); //干掉异步前的老方法

		_e.removeEvent(_hDom, "mousedown", QZFL.dragdrop.startDrag);
		delete QZFL.dragdrop.dragdropPool[_hDom.id];
	},



	startDrag : function(evt){
		QZFL.dragdrop.doStartDrag.apply(QZFL.dragdrop, arguments);
		QZFL.event.preventDefault(evt);
	},


	//老逻辑兼容 begin
	dragTempId : 0,
	//老逻辑兼容 end


	doStartDrag : function(evt, handlerId, target, opts){
		var _s = QZFL.dragdrop,
			_e = {};
		QZFL.object.extend(_e, evt);
		QZFL.imports(_s.path, function(){
				_s.startDrag.call(_s, _e, handlerId, target, opts);
			});
	}
};


//很重要，保存被覆盖前的老引用
QZFL.dragdrop._oldSD = QZFL.dragdrop.startDrag;


// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	dragdrop : function(target, opts){
		var _arr = [];
		this.each(function(){
			_arr.push(QZFL.dragdrop.registerDragdropHandler(this, target, opts));
		});
		return _arr;
	},
	unDragdrop : function(target, opts){
		this.each(function(){
			_arr.push(QZFL.dragdrop.unRegisterDragdropHandler(this));
		});
	}
});



/////////////
//msgbox_shell.js
/////////////


/**
 * @fileoverview 信息提示框组件外壳部分逻辑
 * @author scorpionxu
 * @version 1.0
 */



/**
 * 信息提示框组件包
 * @memberOf QZFL.widget
 * @namespace 信息提示框组件包
 */
QZFL.widget.msgbox = {
	/**
	 * 默认css文件路径
	 * @type string
	 * @static
	 */
	cssPath : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/css/msgbox.css",

	/**
	 * jslib主体路径
	 * @type string
	 * @static
	 */
	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/msgbox.js",

	/**
	 * 当前css文件路径
	 * @private
	 * @type string
	 * @static
	 */
	currentCssPath : null,

	/**
	 * 加载样式皮肤
	 * @private
	 * @param {string} [s=QZFL.widget.msgbox.cssPath] 皮肤css路径
	 */
	_loadCss : function(s){
		var th = QZFL.widget.msgbox;
		s = s || th.cssPath;
		if(th.currentCssPath != s){
			QZFL.css.insertCSSLink(th.currentCssPath = s);
		}
	},

	/**
	 * 显示信息
	 *
	 * @param {string} [msgHtml=""] 信息文字
	 * @param {number} [type=0] 信息提示类型 0~3 提示, 4:成功 5:失败 6:加载
	 * @param {number} [timeout=5000] 提示信息超时关闭，0为手动关闭
	 * @param {object} [opts={}] 可选参数包
	 * @param {number} [opts.topPosition] 提示框的高度位置
	 * @param {string} [opts.cssPath=QZFL.widget.msgbox.cssPath] 自定义样式文件
	 */
	show : function(msgHtml, type, timeout, opts){
		var _s = QZFL.widget.msgbox;

		if(typeof(opts) == 'number'){
			opts = { topPosition : opts };
		}

		opts = opts || {};

		_s._loadCss(opts.cssPath);

		QZFL.imports(_s.path, function(){
			_s.show(
				msgHtml,
				type,
				timeout,
				opts
			);
		});
	},

	/**
	 * 隐藏信息
	 *
	 * @param {number} timeout 延迟关闭的时间
	 */
	hide : function(timeout){
		QZFL.imports(QZFL.widget.msgbox.path, function(){
			QZFL.widget.msgbox.hide(timeout);
		});
	}
};




/////////////
//dialog_shell.js
/////////////


/**
 * QZFL.dialog通用对话框功能的外壳部分
 * @fileOverview QZFL.dialog通用对话框功能的外壳部分
 * @version 1.0
 * @author scorpionxu
 */


/**
 * QZFL的弹出对话框系统类,可能需要QZFL.dragdrop类支持
 *
 * @namespace QZFL的弹出对话框系统
 * @memberOf QZFL
 */
QZFL.dialog = {
	cssPath : "http://" + QZFL.config.resourceDomain + "/qzone_v6/qz_dialog.css",
	currentCssPath : '',
	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/dialog.js?max_age=864020",
	count : 0,
	instances : {},

	/**
	 * 按钮类型的枚举常数包<pre>
BUTTON_TYPE : {
	Disabled : -1,
	Normal : 0,
	Cancel : 1,
	Confirm : 2,
	Negative : 3
}</pre>

	 * @type object
	 *
	 */
	BUTTON_TYPE : {
		Disabled : -1,
		Normal : 0,
		Cancel : 1,
		Confirm : 2,
		Negative : 3
	},

	/**
 	* 创建一个新的对话框<br />
	* 老接口模型：create : function(title, content, width, height, useTween, noBorder) 不建议使用，但目前仍然兼容
	*     
 	* @param {string} [title=''] 标题
 	* @param {string|object} [content=''] 内容，以文本格式给，支持HTML，或者{ src : 'url'} 的形式，用iframe引入指定页面
 	* @param {object} [opts={}] 高级功能选项
	* @param {number} [opts.width=300] 宽度
	* @param {number} [opts.height=200] 高度，这里不是整个popup dialog的高度，而是内容区的高度
	* @param {number} [opts.top] 左上角纵坐标，默认是动态计算的位置
	* @param {number} [opts.left] 左上角横坐标，默认是动态计算的位置
	* @param {boolean} [opts.useTween=false] 是否用动画（根据情况支持）
	* @param {boolean} [opts.noBorder=false] 是否无边框
	* @param {boolean} [opts.showMask=false] 是否使用蒙板
	* @param {string} [opts.title=''] 标题
	* @param {string} [opts.content=''] 内容
	* @param {function} [opts.onLoad] 对话框DOM结构绘制完成时的onLoad事件侦听<br />
模型为：<pre>
function(o){ //o是该对话框本身 QZFL.dialog.base 类实例引用
}</pre>
	* @param {string} [opts.cssPath='http://qzonestyle.gtimg.cn/ac/qzfl/release/resource/css/dialog.css']
	* @param {string} [opts.statusContent=''] 默认不展现，若有文本，则在左下角展示，所产生的行高不计算在内容高度中
	* @param {object[]} [opts.buttonConfig=[]] 按钮定义表，默认无按钮
	* <pre>一个按钮配置:
{
	text: '按钮文字',
	tips: '按钮鼠标悬停后的小黄标提示文字',
	type: QZFL.dialog.BUTTON_TYPE.Normal, //按钮类型:
		//有Normal, Confirm, Negative, Cancel, Disabled 五种选择
		//其中Cancel, Confirm, Negative 三种关联到对象整体时间处理器onConfirm, onNegative, onCancel
		//且点击后dialog将关闭
	clickFn: function(){
			//to do 这里是直接按钮点击后的处理，可以和onConfirm等同时存在，先于执行
		}
}</pre>

	* @returns {object} 返回一个 QZFL.dialog.base 类的实例
	* 
	* @example
	<pre>
var d = QZFL.dialog.create("Hello", 'world!<br/>sdfsfsdddddddddddddddddddddddddddddddddddddddddddddddf',
	{
		statusContent : "你好，Tester",
		showMask : true,
		buttonConfig : [
			{
				type : QZFL.dialog.BUTTON_TYPE.Confirm,
				text : '尼玛',
				tips : '哈哈哈哈'
			},
			{
				type : QZFL.dialog.BUTTON_TYPE.Cancel,
				text : '啥？',
				tips : '取消',
				clickFn : function(){
						alert("hehe");
					}
			},
			{
				type : QZFL.dialog.BUTTON_TYPE.Normal,
				text : '普',
				tips : '通'
			},
			{
				type : QZFL.dialog.BUTTON_TYPE.Negative,
				text : '否',
				tips : '绝'
			},
			{
				type : QZFL.dialog.BUTTON_TYPE.Disabled,
				text : '你来点啊！',
				tips : '点得了么？？！'
			}
		]
	});</pre>

	* @see QZFL.dialog.base
 	*/
	create : function(title, content, opts /*width,height,tween,noborder,top,left*/) {
		var t,
			args,
			dialog;
		
		if(t = (typeof(opts) != "number" || isNaN(parseInt(opts, 10)))){ //判断兼容新老逻辑
			opts = opts || {};
			args = [0, 0, opts.width, opts.height, opts.useTween, opts.noBorder];
		}else{
			opts = {
				'width' : opts
			};
			args = arguments;
		}

		t && (opts.width = args[2] || 300);
		opts.height = args[3] || 200;
		opts.useTween = !!args[4];
		opts.noBorder = !!args[5];
		opts.title = title || opts.title || '';
		opts.content = content || opts.content || '';

		dialog = new QZFL.dialog.shell(opts);
		dialog.init(opts);
		return dialog;
	},


	/**
 	* 创建无边框的dialog视图 contributed by scorr
 	*
 	* @param {string} [content=''] 内容
 	* @param {number} [width=300] 宽度
 	* @param {number} [height=200] 高度
	* @deprecated 多此一举，以后不要用了，直接用 create 接口中的 noBorder 可选参数
	* @see QZFL.dialog.create
 	*/
	createBorderNone : function(content, width, height) {
		var opts = opts || {};
		opts.noBorder = true;
		opts.width = width || 300;
		opts.height = height || 200;
		return QZFL.dialog.create(null, content || '', opts);
	}
};

/**
 * 用于异步构建的虚方法对接器
 * @private
 * @param {string} pFnName 映射的方法名
 * @param {object} objInstance 触发方法的对象
 * @param {object[]} args 参数列表
 *
 */
QZFL.dialog._shellCall = function(pFnName, objInstance, args){
	var _s = QZFL.dialog;
	QZFL.imports(_s.path, (function(th){
				return function(){
						_s.base.prototype[pFnName].apply(th, args || []);
					};
			})(objInstance));
};

/**
 * 外壳对象构造器，只是临时使用，本体加载后将被覆盖
 * @memberOf QZFL.dialog
 * @private
 * @constructor
 * @param {object} opts 格式同 QZFL.dialog.create 中的 opts
 */
QZFL.dialog.shell = function(opts){
	var _s = QZFL.dialog,
		cssp = opts.cssPath || _s.cssPath;
	if(cssp != _s.currentCssPath){ //把主样式加载回来
		QZFL.css.insertCSSLink(cssp);
		_s.currentCssPath = cssp;
	}

	this.opts = opts;
	this.id = ('qzDialog' + (++_s.count));
	_s.instances[this.id] = this;

	//兼容老版本 begin
	this.uniqueID = _s.count;
	//兼容老版本 end

	if(!_s.base){ //把主lib加载回来
		QZFL.imports(_s.path);
	}
};


/**
 * 获取zIndex
 * @private
 * @deprecated 尽量不要用这个吧，用来干啥呢？没意义嘛
 * @returns {number} 返回z-index值
 */
QZFL.dialog.shell.prototype.getZIndex = function() {
	return this.zIndex || (6000 + QZFL.dialog.count); //这里必须要同步返回，不能用_shellCall，异步性无法被包容
};


(function(fl){ //把一个个shell方法都映射出来
	for(var i = 0, len = fl.length; i < len; ++i){
		QZFL.dialog.shell.prototype[fl[i]] = (function(pName){
				return function(){
						QZFL.dialog._shellCall(pName, this, arguments);
					};
			})(fl[i]);
	}
})(['hide', 'unload', 'init', 'fillTitle', 'fillContent', 'setSize', 'show', 'hide', 'focus', 'blur', 'setReturnValue']);





/////////////
//confirm_shell.js
/////////////


/**
 * @fileoverview confirm信息提示类
 * @version 1.$Rev: 1855 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2010-10-27 15:51:14 +0800 (周三, 27 十月 2010) $
 * @requires QZFL.dialog
 * @requires QZFL.maskLayout
 */

/**
 * confirm信息提示类,建议使用新的接口，如果在QZONE里建议只用QZONE.FP.confirm();具体接口请参见FrontPage接口文档。
 *
 * @param {string} title 对话框标题
 * @param {string} content 内容
 * @param {number} config 参数配置,说明{"type":"type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001","icontype":"confirm支持的提示类型,succ代表成功,warn代表提示,error代表错误,help代表问号","hastitle":false}
 * @constructor QZFL.widget.Confirm
 * @example var _c = new QZFL.widget.Confirm(title, content, {"type":3,"icontype":"succ","hastitle":false});
 * 			_c.show();
 */
//@param {string} title 对话框标题
//@param {string} content 内容
//@param {number} type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001
//QZFL.widget.Confirm = function(title, content, type, btnText) {



QZFL.widget.Confirm = function(title, content, opts){
	//最先开始的是新老接口兼容
	if((typeof opts != 'undefined') && (typeof opts != 'object')){
		opts = {
			type : opts,
			tips : arguments[3]
		};
	}

	opts = opts || {};

	var n,
		_s = QZFL.widget.Confirm,
		cssp = opts.cssPath || _s.cssPath;


	opts.title = opts.title || title || '';
	opts.content = opts.content || content || '';

	this.opts = opts;

	//老代码兼容 .... 尼玛你们对内部成员依赖还要... begin
	this.tips = opts.tips = (opts.tips || []);
	//end

	n = (++_s.count);
	this.id = 'qzConfirm' + n;
	_s.instances[n] = this;

	if(cssp != _s.currentCssPath){ //把主样式加载回来
		QZFL.css.insertCSSLink(cssp);
		_s.currentCssPath = cssp;
	}

	if(!_s.iconMap){
		QZFL.imports(_s.path);
	}
};

QZFL.widget.Confirm.TYPE = {
	OK : 1,
	NO : 2,
	OK_NO : 3,
	CANCEL : 4,
	OK_CANCEL : 5,
	NO_CANCEL : 6,
	OK_NO_CANCEL : 7
};

QZFL.widget.Confirm.count = 0;
QZFL.widget.Confirm.instances = {};

QZFL.widget.Confirm.cssPath = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/resource/css/confirm_by_dialog.css";
QZFL.widget.Confirm.path = "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/confirm_base.js";


/**
 * 用于异步构建的虚方法对接器
 * @private
 *
 */
QZFL.widget.Confirm._shellCall = function(pFnName, objInstance, args){
	var _s = QZFL.widget.Confirm;
	QZFL.imports(_s.path, (function(th){
				return function(){
						_s.prototype[pFnName].apply(th, args || []);
					};
			})(objInstance));
};



(function(fl){ //把一个个shell方法都映射出来
	for(var i = 0, len = fl.length; i < len; ++i){
		QZFL.widget.Confirm.prototype[fl[i]] = (function(pName){
				return function(){
						QZFL.widget.Confirm._shellCall(pName, this, arguments);
					};
			})(fl[i]);
	}
})(['hide', 'show']);





/////////////
//datacenter.js
/////////////


/**
 * @fileoverview 数据中心 字典方式索引的数据中心 //to do
 * @version 1.$Rev: 1921 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2011-01-11 18:46:01 +0800 (周二, 11 一月 2011) $
 */

/**
 * 数据中心
 *
 * @namespace QZFL.dataCenter
 * 
 * 存在shareObject中的东西根本取不到
 */
(function(qdc){
	var dataPool = {};
	/**
	 * 内部实体
	 *
	 * @ignore
	 */
	qdc.get = qdc.load = function(key){
		return dataPool[key];
	};
	/**
	 * @内部实体
	 * @ignore
	 */
	qdc.del = function(key){
		dataPool[key] = null;
		delete dataPool[key];
		return true;
	};
	/**
	 * 内部实体
	 *
	 * @ignore
	 */
	qdc.save = function saveData(key, value){
		dataPool[key] = value;
		return true;
	};
})(QZFL.dataCenter = {});




/////////////
//mask_layout.js
/////////////


/**
 * @fileoverview QZFL对话框类,需要QZFL.dragdrop类支持
 * @version 1.$Rev: 1917 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 */


/**
 * 开启一个全屏幕遮盖的灰色蒙板，灰度可调节，全局唯一
 * 也可以当建立遮罩层的方法
 *
 * @namespace 蒙板层组件
 * @name maskLayout
 * @memberOf QZFL
 * @function
 * @see QZFL.maskLayout.create
 * @example QZFL.maskLayout();
 */
QZFL.maskLayout = (function(){
	var masker = null,
		count = 0,

		/**
		 * 建立一个遮罩层
		 * @memberOf QZFL.maskLayout
		 * @name create
		 * @function
		 */
		qml = function(zi, doc, opts){
			++count;

			if(masker){
				return count;
			}

			zi = zi || 5000;
			doc = doc || document;
			opts = opts || {};

			var t = parseFloat(opts.opacity, 10);
			opts.opacity = isNaN(t) ? 0.2 : t;

			t = parseFloat(opts.top, 10);
			opts.top = isNaN(t) ? 0 : t;

			t = parseFloat(opts.left, 10);
			opts.left = isNaN(t) ? 0 : t;

			masker = QZFL.dom.createElementIn("div", doc.body, false, {
				className: "qz_mask",
				unselectable: 'on',
				style: '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=20)"'
			});
			masker.style.cssText = 'background-color:#000;filter:alpha(opacity=' + 100 * opts.opacity + ');opacity:' + opts.opacity + 		';position:fixed;_position:absolute;left:' + (opts.left) + 'px;top:' + (opts.top) + 'px;z-index:' + zi + ';width:100%;height:' + QZFL.dom[QZFL.userAgent.ie < 7 ? 'getScrollHeight' : 'getClientHeight'](doc) + 'px;';

			return count;
		};

	/**
	 * 设置层透明度
	 * @memberOf QZFL.maskLayout
	 * @name setOpacity
	 * @function
	 * @param {number} ov 透明度比例，数值在 [0, 1] 区间内，如 0.35
	 */
	qml.setOpacity = function(ov){
		if (masker && ov) {
			QZFL.dom.setStyle(masker, 'opacity', ov);
		}
	};

	/**
	 * 获取当前遮罩层的DOM引用
	 * @memberOf QZFL.maskLayout
	 * @name getRef
	 * @function
	 * @returns {object} 当前遮罩层的DOM引用
	 */
	qml.getRef = function(){
		return masker;
	};

	/**
	 * 移除遮罩层
	 * @memberOf QZFL.maskLayout
	 * @name remove
	 * @function
	 * @param {boolean} [rmAll=false] 如果是true则立即移除，如果为false则只减少引用计数，计数为0时做实际移除
	 */
	qml.remove = function(rmAll){
		count = Math.max(--count, 0);

		if(!count || rmAll){
			QZFL.dom.removeElement(masker);
			masker = null;

			rmAll && (count = 0);
		}
	};

	return (qml.create = qml);
})();




/////////////
//fix_layout.js
/////////////


/**
 * @fileoverview fixed层效果，主要正对IE6做兼容
 * @version 1.$Rev: 1723 $
 * @author QzoneWebGroup, ($LastChangedBy: ryanzhao $)
 * @lastUpdate $Date: 2010-04-08 19:26:57 +0800 (周四, 08 四月 2010) $
 */

/**
 * 页面上下区域的水印层生成器
 *
 * @namespace QZFL.fixLayout
 */
QZFL.fixLayout = {
	_fixLayout : null,
	_isIE6 : (QZFL.userAgent.ie && QZFL.userAgent.ie < 7),

	_layoutDiv : {},
	_layoutCount : 0,

	/**
	 * 初始化fixed层
	 *
	 * @ignore
	 */
	_init : function() {
		this._fixLayout = QZFL.dom.get("fixLayout") || QZFL.dom.createElementIn("div", document.body, false, {
			id : "fixLayout",
			style : "width:100%;"
		});
		this._isInit = true;
		// document.body.onscroll = this._onscroll;
		if (this._isIE6) {
			// // document.documentElement.onscroll = QZFL.event.bind(this,
			// this._onscroll);
			QZFL.event.addEvent(document.compatMode == "CSS1Compat" ? window : document.body, "scroll", QZFL.event.bind(this, this._onscroll));
		}
	},

	/**
	 * 创建一个自动修正的层, 不建议创建太多
	 *
	 * @param {String} html html内容
	 * @param {Boolean} isBottom=false 所在位置，是否处于底部,默认为创建顶部的容器
	 * @param {String} layerId 浮动层的dom id
	 * @param {bool} noFixed 不修正浮动层的位置 for ie6 only argument
	 * @param {Object} options 其他参数
	 * @return {Number} 返回这个层的id编号
	 * @example
	 * 			QZFL.fixLayout.create(html, true, "_returnTop_layout", false, {style : "right:0;z-index:5000" + (QZONE.userAgent.ie ? ";width:100%" : "")});
	 */
	create : function(html, isBottom, layerId, noFixed, options) {
		if (!this._isInit) { // 如果没有初始化，则自动初始化
			this._init();
		}
		options = options || {};
		var tmp = {
			style : (isBottom ? "bottom:0;" : "top:0;") + (options.style || "left:0;width:100%;z-index:10000")
		}, _c;

		if (layerId) {
			tmp.id = layerId;
		}
		this._layoutCount++;
		_c = this._layoutDiv[this._layoutCount] = QZFL.dom.createElementIn("div", this._fixLayout, false, tmp);
		_c.style.position = this._isIE6 ? "absolute" : "fixed";
		_c.isTop = !isBottom;
		_c.innerHTML = html;
		_c.noFixed = noFixed ? 1 : 0;
		return this._layoutCount;
	},

	/**
	 * 把固定层固定到顶部
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveTop : function(layoutId) {
		if (!this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = QZFL.dom.getScrollTop() + "px";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "0";
				style.bottom = "";
				isTop = true;
			}
		}
	},

	/**
	 * 把固定层固定到底部
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveBottom : function(layoutId) {
		if (this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = "auto";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "";
				style.bottom = "0";
				isTop = false;
			}
		}
	},

	/**
	 * 往固定层里填充html内容html
	 *
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 * @param {string} html html内容
	 */
	fillHtml : function(layoutId, html) {
		this._layoutDiv[layoutId].innerHTML = html;
	},

	/**
	 * 监听滚动条，for ie6
	 *
	 * @ignore
	 */
	_onscroll : function() {
		var o = QZFL.fixLayout;
		for (var k in o._layoutDiv) {
			if (o._layoutDiv[k].noFixed) {
				continue;
			}
			QZFL.dom.setStyle(o._layoutDiv[k], "display", 'none');
		}
	
		clearTimeout(this._timer);
		this._timer = setTimeout(this._doScroll, 500);

		if (this._doHide) {
			return
		}

		this._doHide = true;
	},

	/**
	 * 执行滚动条滚动后的脚本 for ie6
	 *
	 * @ignore
	 */
	_doScroll : function() {
		var o = QZFL.fixLayout;

		for (var k in o._layoutDiv) {
			if (o._layoutDiv[k].noFixed) {
				continue;
			}
			var _item = o._layoutDiv[k];
			if (_item.isTop) {
				o._layoutDiv[k].style.marginTop = QZFL.dom.getScrollTop() + "px";
			} else {
				// ie6的bottom 有bug...
				// 必须要重新设置一下，然后在还原marginBottom即可还原。崩溃了,想死的心都有了
				o._layoutDiv[k].style.marginBottom = "0";
				o._layoutDiv[k].style.marginBottom = "auto";
			}
		}
		
		clearTimeout(this._stimer);
		this._stimer = setTimeout(function(){
			for (var k in o._layoutDiv) {
				if (o._layoutDiv[k].noFixed) {
					continue;
				}
				QZFL.dom.setStyle(o._layoutDiv[k], "display", "");
			}
		},800);

		o._doHide = false;
	}
};




/////////////
//tips_shell.js
/////////////


/**
 * @fileoverview 指向性提示框 外壳
 * @version 1.$Rev: 1821 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-09-26 12:22:44 +0800 (周日, 26 九月 2010) $
 */





/**
 * @fileoverview 气泡提示框
 * @version 1.$Rev: 1869 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-11-03 12:37:14 +0800 (周三, 03 十一月 2010) $
 */

/**
 * 气泡 widget
 * 
 * @namespace
 */
QZFL.widget.bubble = {
	/**
	 *
	 *path在本文件尾被指向QZFL.widget.path
	 */
//	path : "http://qzonestyle.gtimg.cn/ac/qzfl/release/widget/tips.js",

	/**
	 * 气泡提示接口
	 * 
	 * @param {Element} target 对象
	 * @param {String} title 气泡标题
	 * @param {String} msg 气泡内容
	 * @param {Object} opts 气泡参数 {timeout,className,id,styleText,call}
	 * @return 返回新建的气泡编号
	 */
	show : function(target, title, msg, opts) {
		opts = opts || {};
		var bid = opts.id || "oldBubble_" + (++QZFL.widget.bubble.count);
		opts.id = bid;
		QZFL.imports(QZFL.widget.bubble.path, function(){
			QZFL.widget.tips.show(
				'<div>' + title + '</div>' + msg,
				target,
				opts
			);
		});
		return bid;
	},

	/*
	 * 初始计数
	 */
	count: 0,

	/**
	 * 隐藏气泡
	 * 
	 * @param {Number} id 气泡编号
	 */
	hide : function(id) {
		if(QZFL.widget.tips){
			QZFL.widget.tips.close(id);
		}
	},

	/**
	 * 隐藏所有气泡
	 */
	hideAll : function() {
		if(QZFL.widget.tips){
			QZFL.widget.tips.closeAll();
		}
	}
};

/**
 * 隐藏气泡
 * @deprecated
 * @param {String} bubbleId 气泡编号
 */
function hideBubble(bubbleId) {
	QZFL.widget.bubble.hide(bubbleId);
}

/**
 * 隐藏所有气泡
 * @deprecated
 */
function hideAllBubble() {
	QZFL.widget.bubble.hideAll();
}
/**
 * @fileoverview 气泡功能扩展
 * @version 1.$Rev: 1869 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2010-11-03 12:37:14 +0800 (周三, 03 十一月 2010) $
 */

/**
 * extend Bubble Create
 * @deprecated
 * @param {String} key 关键key
 * @param {Element} target 对象
 * @param {String} msg 气泡标题
 * @param {Object} options 气泡参数 {timeout,className,id,styleText,callback}
 * @return 返回新建的气泡编号
 */
QZFL.widget.bubble.showEx = QZFL.emptyFn;

/**
 * 设置气泡是否不再显示的key
 * @deprecated
 * @param {string} key shareObject 的 key
 * @param {bool} value 设置不在显示的值
 */
QZFL.widget.bubble.setExKey =  QZFL.emptyFn;


/**
 * 气泡 widget
 * 
 * @namespace
 */
QZFL.widget.tips = {
	/**
	 *
	 *
	 */
	path : "http://" + QZFL.config.resourceDomain + "/ac/qzfl/release/widget/tips.js?max_age=1209600",

	/**
	 * 气泡展示
	 *
	 * @param {string} [html = ""] 内容html
	 * @param {HTMLElement} [aim = document.body] 所指目标节点
	 * @param {object} [opts = {
			 x:0, //与默认计算的对齐位置的横向便宜，正负整数皆可
			 y:0, //与默认计算的对齐位置的纵向便宜，正负整数皆可
			 width:200, //宽度
			 height:100, //高度
			 arrowType:2 //2：90度角式样，经典场景 1：45度角式样，适合“谁谁说。。。”场景
			 arrowSize:(根据arrowType决定) //小尖角zoom大小
			 arrowEdge:(根据aim节点位置动态决定) //尖角所在的边 1：上 2：右 3：下 4：左
			 arrowPoint:(根据aim节点位置和arrowEdge动态决定) //尖角所靠近的端点 1：左上 2：右上 3：右下 4：左下
			 arrowOffset:(根据arrowtype和arrowSize动态计算) //尖角距离所指定的“靠近端点”的偏移
			 borderColor:'#cbae85',
			 backgroundColor:'#fdfdd9',
			 backgroundImageUrl:"", //整个内容区背景图URL
			 appendMode:0, //插入页面的方式：
			 //   0 [默认]绝对定位在页面body上插入
			 //   1 插在aim之后，与aim并列
			 //   2 插在aim之前，与aim并列
			 noShadow:false,
			 closeButtonColor:'#ba6f2b',
			 closeButtonSize:'12', //默认12px的字体大小（这里使用unicode '×' 字符实现的）
			 needFixed:false, //是否使用position:fixed模式
			 noQueue:false, //是否不参与排队，排队的意思是：当前有个tips在展示了，那么就pedding着，等当前tips关掉再显示自己
			 timeout:5000, //自动关闭前停留时间，需要恒定存在可以给 -1
			 callback:undefined //关闭后的回调函数
		 }]
	 * @return {string} 实体的id
	 */
	show : function(html, aim, opts) {
		opts = opts || {};
		var bid = opts.id || "QZFL_bubbleTips_" + (++QZFL.widget.tips.count);
		opts.id = bid;
		QZFL.imports(QZFL.widget.tips.path, function(){
			QZFL.widget.tips.show(
				html,
				aim,
				opts
			);
		});
		return bid;
	},

	/*
	 * 初始计数
	 */
	count: -1,

	/**
	 * 隐藏气泡
	 * 
	 * @param {Number} id 气泡编号
	 */
	close : function(id) {
		QZFL.imports(QZFL.widget.tips.path, function(){
			if(QZFL.widget.tips){
				QZFL.widget.tips.close(id);
			}
		});
	},

	/**
	 * 隐藏所有气泡
	 */
	closeAll : function() {
		QZFL.imports(QZFL.widget.tips.path, function(){
			if(QZFL.widget.tips){
				QZFL.widget.tips.closeAll();
			}
		});
	},
	resize : function(id) {
		QZFL.imports(QZFL.widget.tips.path, function(){
			if(QZFL.widget.tips){
				QZFL.widget.tips.resize && QZFL.widget.tips.resize(id);
			}
		});
	}
};
//加个判断，怕干掉QZFL.widget.bubble的时候疏忽了没干掉这句代码就报错了
(QZFL.widget.bubble || {}).path = QZFL.widget.tips.path;



/////////////
//seed.js
/////////////


/*
 * Copyright (c) 2008, Tencent Inc. All rights reserved.
 */
/**
 * @fileoverview 随机seed
 * @author QzoneWebGroup
 * @version 1.0
 */

/**
 * 用来返回
 *
 * @namespace
 */
QZFL.widget.seed = {
	_seed : 1,

	/**
	 * 记录cooki的域名
	 */
	domain : "qzone.qq.com",
	
	prefix : "__Q_w_s_",

	/**
	 * 更新Seed数值
	 * @param {string} [k] seed的名称
	 * @param {object} [opt] 相关选项 useCookie, domain
	 * @return {number} 更新后的值，更新失败为0
	 */
	update : function(k, opt) {
		var n = 1, s, th = QZFL.widget.seed;
		if (typeof(k) == "undefined") {
			n = th._update();
		}else{
			k = th.prefix + k;
			if(opt && opt.useCookie){
				n = QZFL.cookie.get(k);
				if(n){
					QZFL.cookie.set(k, ++n, opt.domain || th.domain, null, 3000)
				}else{
					return 0;
				}
			}else{
				s = QZFL.shareObject.getValidSO();

				if (!s) {
					n = th._update();
				} else if (n = s.get(k)) {
					s.set(k, ++n);
				} else {
					return 0;
				}
			}
		}
		return n;
	},
	
	_update : function(){
		var th = QZFL.widget.seed;
		QZFL.cookie.set(
			"randomSeed",
			(th._seed = parseInt(Math.random() * 1000000, 10)),
			th.domain,
			null,
			3000);
		return th._seed;
	},

	/**
	 * 获得Seed数值
	 * @param {string} [k] seed的名称
	 * @param {object} [opt] 相关选项 useCookie, domain
	 * @return {number} seed值
	 */
	get : function(k, opt) {
		var s, n, th = QZFL.widget.seed;
		if (typeof(k) == "undefined") {
			return (th._seed = QZFL.cookie.get("randomSeed")) ? th._seed : th.update();
		}else{
			k = th.prefix + k;
			if(opt && opt.useCookie){
				return (n = QZFL.cookie.get(k)) ? n : (QZFL.cookie.set(k, n = 1, opt.domain || th.domain, null, 3000), n);
			}else{
				if(!(s = QZFL.shareObject.getValidSO())){
					return th._seed;
				}
				return (n = s.get(k)) ? n : (s.set(k, n = 1), n); /* 呵呵，好久不用逗号表达式了 */
			}
		}
	}
};



/////////////
//runbox.js
/////////////


/**
 * @fileOverview 这是个有趣的widget,能够在两个Dom之期间绘制一个会跑的外框 需要 QZFL.Tween 支持
 * @author zishunchen, last modified by scorpionxu
 */

/**
 * 两个已经给出的节点间跑一次虚线框，标识路径
 * @memberOf QZFL.widget
 * @param {object - HTMLElement} startNode 开始节点
 * @param {object - HTMLElement} endNode 结束节点
 * @param {object} [opts={}] 选项
 * @param {number} [opts.duration=0.8] 跑一次的时间
 * @param {object} [opts.doc=document] document节点
 *
 */
QZFL.widget.runBox = function(startNode, endNode, opts){
	var doc,
		dv,
		sp,
		ep;

	startNode = QZFL.dom.get(startNode);
	endNode = QZFL.dom.get(endNode);

	if(!QZFL.lang.isNode(startNode) || !QZFL.lang.isNode(endNode) || !QZFL.effect){
		return;
	}

	opts = opts || {};
	opts.duration = opts.duration || 0.8;
	doc = opts.doc = opts.doc || document;

	sp = QZFL.dom.getPosition(startNode);

	dv = doc.createElement("div");
	dv.style.cssText = "border:3px solid #999; z-index:10000; position:absolute; left:" + sp.left + "px; top:" + sp.top + "px; width:" + sp.width + "px; height:" + sp.height + "px;";
	doc.body.appendChild(dv);

	ep = QZFL.dom.getPosition(endNode);

	QZFL.effect.run(dv, {
		left : ep.left,
		top : ep.top,
		width : ep.width,
		height : ep.height
	},{
		duration : opts.duration * 1000,
		complete : function(){
			doc.body.removeChild(dv);
			sp = ep = dv = null;
		}
	});
};


/**
 * 同QZFL.widget.runBox
 * @deprecated 名字太长，用QZFL.widget.runBox吧
 * @see QZFL.widget.runBox
 *
 */
QZFL.widget.runBox.start = function(){
	QZFL.widget.runBox.apply(QZFL.widget.runBox, arguments);
};



/////////////
//global_var.js
/////////////





/**
 * @author scorr
 */


/**
 * 需要打开string命名空间
 */
QZFL.object.map(QZFL.string || {});

/**
 * 需要打开util命名空间
 */
QZFL.object.map(QZFL.util || {});

/**
 * 需要打开lang命名空间
 */
QZFL.object.map(QZFL.lang || {});

(function(w){
	w.ua = w.ua || QZFL.userAgent;
	w.$e = QZFL.element.get;
	!w.$ && (w.$ = QZFL.dom.get);
	w.removeNode = QZFL.dom.removeElement;
	w.ENV = QZFL.enviroment;
	w.addEvent = QZFL.event.addEvent;
	w.removeEvent = QZFL.event.removeEvent;
	w.getEvent = QZFL.event.getEvent;
	w.insertFlash = QZFL.media.getFlashHtml;

	w.getShareObjectPrefix = getShareObjectPrefix; //flash so 中要用的回调

})(window);



/////////////
//qzfl_common_anti_csrf.js
/////////////


if(!QZFL.pluginsDefine){
	QZFL.pluginsDefine = {};
}

/**
 * 获取反CSRF的token
 * @author scorpionxu
 * @example QZONE.FrontPage.getACSRFToken();
 * @return {String} 返回token串
 *
 */
QZFL.pluginsDefine.getACSRFToken = function(){
	var skey = QZFL.cookie.get("p_skey") || QZFL.cookie.get("skey") || QZFL.cookie.get("rv2");
	return arguments.callee._DJB(skey);
};

/**
 * 一个简单的摘要签名算法
 * @author scorpionxu
 * @ignore
 */
QZFL.pluginsDefine.getACSRFToken._DJB = function(str){
	var hash = 5381;

	for(var i = 0, len = str.length; i < len; ++i){
		hash += (hash << 5) + str.charCodeAt(i);
	}

	return hash & 0x7fffffff;
};




/////////////
//qzfl_formsender_anti_csrf.js
/////////////


(function(){
	var t = QZONE.FormSender;


	if(t && t.pluginsPool){
		t.pluginsPool.formHandler.push(function(fm){
			if(fm){
				if(!fm.g_tk){
				/*	var ipt = QZFL.dom.createNamedElement("input", "g_tk", document);
					ipt.type = "hidden";
					ipt.value = QZFL.pluginsDefine.getACSRFToken();
					fm.appendChild(ipt);*/

					var a = QZFL.string.trim(fm.action);
					a += (a.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
					fm.action = a;
				}
			}

			return fm;
		});
	}
})();



/////////////
//qzfl_jsongetter_anti_csrf.js
/////////////


/*(function(){
	var t = QZONE.JSONGetter;


	if(t && t.pluginsPool){
		t.pluginsPool.srcStringHandler.push(function(ss){
			if(typeof(ss) == "string"){
				if(ss.indexOf("g_tk=") < 0){
					ss += (ss.indexOf("?") > -1 ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
				}
			}
			return ss;
		});
	}
})();*/

(function(){
	var t = QZONE.JSONGetter,
		jsRE = /\.js|\.json$/i;


	if(t && t.pluginsPool){
		t.pluginsPool.srcStringHandler.push(function(ss){
			var sw, pn;
			if(typeof(ss) == "string"){
				if(ss.indexOf("g_tk=") < 0){
					pn = (sw = (ss.indexOf("?") > -1)) ? ss.split('?')[0] : ss;
					if(jsRE.lastIndex = 0, !jsRE.test(pn)){
						ss += (sw ? "&" : "?") + "g_tk=" + QZFL.pluginsDefine.getACSRFToken();
					}
				}
			}
			return ss;
		});
	}
})();




/////////////
//qzfl_common_network_check.js
/////////////


if(!QZFL.pluginsDefine){
	QZFL.pluginsDefine = {};
}

QZFL.pluginsDefine.networkChectLibPath = 'http://' + QZFL.config.resourceDomain + '/qzone/v6/troubleshooter/network_check_plugin_lib.js';




/////////////
//qzfl_formsender_network_check.js
/////////////


(function(){
	var t = QZONE.FormSender;


	if(t && t.pluginsPool){
		t.pluginsPool.onErrorHandler.push(function(fsObj){
			fsObj
				&& QZFL.pluginsDefine
				&& QZFL.pluginsDefine.networkChectLibPath
				&& QZFL.imports
				&& QZFL.imports(QZFL.pluginsDefine.networkChectLibPath, (function(d){
					return function(){
						QZONE
							&& QZONE.troubleShooter
							&& QZONE.troubleShooter.qzflPluginNetworlCheck
							&& QZONE.troubleShooter.qzflPluginNetworlCheck(d);
					};
				})({ url : fsObj.uri }));
		});
	}
})();



/////////////
//qzfl_jsongetter_network_check.js
/////////////


(function(){
	var t = QZONE.JSONGetter;


	if(t && t.pluginsPool){
		t.pluginsPool.onErrorHandler.push(function(jgObj){
			jgObj
				&& QZFL.pluginsDefine
				&& QZFL.pluginsDefine.networkChectLibPath
				&& QZFL.imports
				&& QZFL.imports(QZFL.pluginsDefine.networkChectLibPath, (function(d){
					return function(){
						QZONE
							&& QZONE.troubleShooter
							&& QZONE.troubleShooter.qzflPluginNetworlCheck
							&& QZONE.troubleShooter.qzflPluginNetworlCheck(d);
					};
				})({ url : jgObj._uri }));

		});
	}
})();




/////////////
//common_value_stat.js
/////////////


(function(q){
	var isspeedup = false;
	(function (callback) {
		var _cur = window, flag, cnt = 0, _pool = [];
		while (true) {
			flag = false;
			try {
				_cur.document && _cur.document.domain == document.domain && (flag = true);
			} catch (_) {
			}
			if (flag) {
				_pool.push(_cur);
			}
			if (_cur == top) {
				break;
			}
			_cur = _cur.parent;
		}
		while (_pool.length) {
			if (callback(_cur = _pool.pop()) === true) {
				return _cur;
			}
		}
		return null;
	})(function (win) {
		if (/(?:user\.(s\d\.)?|\d{5,}\.|rc\.)qzone\.qq\.com/.test(win.location.host) && win.QZFL && win.QZFL.cookie) {
			isspeedup = win.QZFL && win.QZFL.cookie.get('blabla') == 'dynamic';
			return true;
		}
	});

	var commurl = 'http://c.isdspeed.qq.com/code.cgi'
		, urlParse = /^http:\/\/([\s\S]*?)(\/[\s\S]*?)(?:\?|$)/
		, pingSender = q.pingSender
		, collector = []
		, timer
		, hours = new Date().getHours()
		, rateNumG = (hours >0 && hours < 8 ) ? 1 : 2000
		, rateNumP = (hours >0 && hours < 8 ) ? 1 : 100
		, isreportG = Math.random() * rateNumG < 1 // jsongetter成功时的抽样上报率
		, isreportP = Math.random() * rateNumP < 1 // formsender成功时的抽样上报率
		, uin = typeof g_iUin == 'undefined' ? 0 : g_iUin
		, duration = 1000
		, each = q.object.each;
	// 公共上报
	function valueStat(domain, cgi, type, code, time, rate, uin, exts) {
		if(Math.random() > 1 / rate) 
			return;
		var param = [];
		param.push(
			'uin=' + uin,
			'key=' + 'domain,cgi,type,code,time,rate',
			'r=' + Math.random()
		);
		// 如果是数组
		if (typeof exts.unshift == 'function') {
			var i = 0;
			while (exts.length) {
				if (param.join('&').length > 1000) {
					break;
				}
				var c = exts.shift();
				param.push([i + 1, 1].join('_') + '=' + c[0]);
				param.push([i + 1, 2].join('_') + '=' + c[1] + '?qzfl');
				param.push([i + 1, 3].join('_') + '=' + c[2]);
				param.push([i + 1, 4].join('_') + '=' + c[3]);
				param.push([i + 1, 5].join('_') + '=' + c[4]);
				param.push([i + 1, 6].join('_') + '=' + c[5]);
				i++;
			}
		}
		if (domain != '' || i > 0) {
			q.pingSender &&  q.pingSender(commurl + '?' + param.join('&'), 1000);	
		}
	}
	
	function _r() {
		if (collector.length) {
			valueStat('','','','','','',uin, collector);	
		}
		// 间隔1秒钟进行一次上报
		timer = setTimeout(_r, duration);
		duration *= 1.1;
	}
	function toabs(id) {
		if (!id)
			return '';
		var ret = id;
		if (id.indexOf('://') == 4 || id.indexOf('://') == 5) {
			ret = id;
		}
		else if (id.indexOf('../') === 0) {
			ret = location.protocol + '//' + location.host +  '/' + id.replace(/(?:\.\.\/)*/, location.pathname.split('/').slice(1, -1 * (id.split('../').length)).join('/') + '/' );
		}
		else if(/^[^\/]+\//.test(id) || id.indexOf('./') === 0) {
			if (id.indexOf('./') === 0) {
				id = id.substring(2);
			}
			ret = location.protocol + '//' + location.host + location.pathname.split('/').slice(0, -1).join('/') + '/' + id;
		}
		else if (id.charAt(0) === '/') {
			ret = location.protocol + '//' + location.host + id;
		}
		return ret;
	}
	each(['JSONGetter', 'FormSender'], function(n) {
		q[n].prototype.setReportRate = function (rate) {
			this.reportRate = rate;
		};
		if (q[n] && q[n].pluginsPool) {
			if (typeof q[n].pluginsPool.onRequestComplete == 'undefined') {
				q[n].pluginsPool.onRequestComplete = [];
			}
			q[n].pluginsPool.onRequestComplete.push(function (th) {
				var u = th._uri || th.uri;
				u = toabs(u);
				var mtch = u.match(urlParse), url = mtch[2], domain = mtch[1];
				// 出现了网络错误统一上报哥502的状态码
				if (th.msg && th.msg.indexOf('Connection') > -1) {
					collector.push([domain, url, 2, th.statusCode || 502, +th.endTime - th.startTime, 1]);
					return;
				}
				var d = th.resultArgs;
				if (d && (d = d[0])) {
					// 没有接入公共返回码系统的可以直接返回
					if (typeof d.code == 'undefined') {
						return;
					}
					// 失败才上报
					else if (d.code != 0) {
						collector.push([domain, url, 3, d.subcode || 1, +th.endTime - th.startTime, 1]);	
					}
					else {
						// 成功按1/2000抽样上报
						if (th instanceof q.JSONGetter) {
							if (th.reportRate) {
								(th.reportRate == 1 || Math.random() < 1 / th.reportRate) && collector.push([domain, url, 1, d.subcode || 1, +th.endTime - th.startTime, th.reportRate || rateNumG]);	
							}
							else {
								isreportG && collector.push([domain, url, 1, d.subcode || 1, +th.endTime - th.startTime, th.reportRate || rateNumG]);	
							}
						}
						// 成功按1/10抽样上报
						if (th instanceof th.ownerWindow.QZFL.FormSender) {
							if (th.reportRate) {
								(th.reportRate == 1 || Math.random() < 1 / th.reportRate) && collector.push([domain, url, 1, d.subcode || 1, +th.endTime - th.startTime, th.reportRate || rateNumP]);	
							}
							else {
								isreportP && collector.push([domain, url, 1, d.subcode || 1, +th.endTime - th.startTime, th.reportRate || rateNumP]);
							}
							
						}
					}
				}
			});
			// 加入测速统计
			q[n].pluginsPool.onRequestComplete.push(function (th) {
				if (isspeedup && th && th instanceof th.ownerWindow.QZFL.FormSender) {
					var takes = (th.postTime - th.startTime), s, fl3;
					if ((th._uri || th.uri).indexOf('taotao.qq.com') > -1) {
						fl3 = 51;
					}
					else if ((th._uri || th.uri).indexOf('w.qzone.qq.com') > -1){
						fl3 = 52;
					}
					if (!fl3) {
						return;
					}
					var stat_url = 'http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=175&flag2=363&flag3=' + fl3;

					if (ua.ie == 8) {
						s = '2';
					}
					else if (ua.ie == 9) {
						s = '3';
					}
					else if (ua.ie == 10) {
						s = '4';
					}
					else if (ua.chrome) {
						s = '5';
					}
					else if (ua.safari) {
						s = '6';
					}
					else if (ua.opera) {
						s = '7';
					}
					else if (ua.firefox) {
						s = '8';
					}
					stat_url += '&' + s + '=' + takes;
					QZFL.pingSender && QZFL.pingSender(stat_url);
				}
			});
		}
	});
	_r();
})(QZFL);



/////////////
//footerfix.js
/////////////


if(typeof(define) === 'function'){
	define(function(){
		return QZFL;
	});
}

//(window.qzc = function(){




})();



/////////////
//global_eval.js
/////////////


/**
 * @fileOverview 需要用eval覆盖系统原生接口的fix都放在这里
 * @author scorr
 */


if(QZFL.userAgent.ie){ //一些浏览器行为矫正，IE9不支持重定义document!
	eval((typeof document.documentMode == 'undefined' || document.documentMode < 9? "var document = QZFL._doc;" : "") + "var setTimeout = QZFL._setTimeout, setInterval = QZFL._setInterval");
}
