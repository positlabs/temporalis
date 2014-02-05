// COMPILED TEMPLATES

// Original file: _FJ.js
var FJ=FJ||{};FJ.NOTIF_EVENT="fjEvent",FJ.NOTIF_NAVIGATION="fjNavigation",FJ.MSG_NAVIGATE="fjNavigate",FJ.MSG_NAVIGATE_UNDO="fjNavigateUndo",FJ.MSG_NAVIGATE_REDO="fjNavigateRedo",FJ.SHOW="SHOW",FJ.HIDE="HIDE";
// Original file: Application.js
/**
 * 1. Mediators dispatch notifications coming from views or services (not part of FJ)
 * 2. Models are accessible to Mediators directly (Mediators are created by the Controller)
 * 3. Controller receives notifications and broadcasts them to services and views
 * 4. Each view or service is free to act or ignore a notification
 * 5. Notification contain a message and some arbitrary variables on which the Mediator can rely as well
 * 6. Notifications however should not carry data (assets). Those are stored in the Model
 */FJ.Application=new function(){var e=this,t=[],n=[];this.model={},this.slug="",this.init=function(t){FJ.Router.init(),FJ.Router.start(t),e.broadcast(FJ.Router.navigateBySlug)},this.createMediator=function(e){e=e||"mediator"+t.length;var n=new FJ.Mediator(e,this);return t.push(n),n},this.destroyMediator=function(e){var n=t.indexOf(e);if(n<0)return;t.splice(n,1)},this.broadcast=function(e){n.push(e);if(n.length>1)return;while(n.length){var r=t.length;for(var i=0;i<r;i++)t[i].notify(n[0]);n.shift()}}};
// Original file: DOM_Minions.js
/**
 *
 *  Makes minions from ordinary DOM elements. Good for conquering the internet.
 *
 *  @see: Node object documentation - http://www.w3schools.com/jsref/dom_obj_node.asp
 *
 *//**
 *  @arg selector: selector string
 *  @arg optInNode: optional Node to search in. defaults to document.body
 *  @return: Node or NodeList
 */dom=function(e,t){var n;typeof t=="string"?n=document.querySelectorAll(t):n=t||document;var r=n.querySelectorAll(e),i;return r.length>1?i=r:i=r[0],typeof i=="undefined"&&console.warn(e,"not found in document"),i},dom.tag=function(e,t,n){var r=document.createElement(e);t&&(typeof t=="string"?r.innerHTML=t:r.appendChild(t));if(n)for(var i in n)r.setAttribute(i,n[i]);return r},dom.rm=function(e,t){function i(e){n.contains(e)&&e.parentElement.removeChild(e)}var n=t||document.body,r=typeof e=="string"?dom(e,t):e;typeof n=="string"&&(n=dom(n));if(r instanceof Node)return i(r),r;if(r instanceof NodeList||r instanceof Array){var s=r.length;while(s--)i(r[s]);return r}if(r==undefined)return;throw new TypeError("node argument needs to be a Node, String, Array, or NodeList!")},dom.add=function(e,t,n){function s(e){r.appendChild(e)}function o(e){if(n)for(var t in n)e.setAttribute(t,n[t])}var r=t||document.body,i=e;typeof r=="string"&&(r=dom(r));if(i instanceof Node)return s(i),o(i),i;if(typeof e=="string")return i=document.createElement(i),s(i),o(i),i;if(i instanceof NodeList||i instanceof Array){var u=document.createDocumentFragment(),a=i.length;while(a--)o(i[a]),u.appendChild(i[a].clone(!0));return s(u),u.childNodes}throw new TypeError("node argument needs to be a Node, String, Array, or NodeList!")},dom.insert=function(e,t,n){var r=n||document.body,i;return typeof r=="string"?r=dom(r):!1,typeof e=="string"?i=dom.tag(e):i=e,r.insertBefore(i,r.childNodes[t])},dom.clone=function(e,t){t==undefined&&(t=!0),typeof e=="string"?e=dom(e):!1;if(e instanceof Node)return e.cloneNode(t);if(e instanceof NodeList){var n=document.createDocumentFragment(),r=e.length;while(r--)n.appendChild(e[r].cloneNode(t));return n.childNodes}throw new TypeError("node argument should be a Node or NodeList!")},dom.Fragment=function(e){var t=document.createDocumentFragment();if(e){if(typeof e=="string"){var n=dom.tag("div",e);e=n.childNodes}for(var r=0,i=e.length;r<i;r++)t.appendChild(e[r])}return t};
// Original file: BootCamp.js
/**
 *
 *   Trains existing Nodes / NodeLists to become DOM minions
 *   (extends Node / NodeList prototypes with dom.* methods)
 *
 */(function(){var e=Node.prototype,t=NodeList.prototype;e.add=t.add=function(e,t){return dom.add(e,this,t)},e.rm=t.rm=function(e){return e?dom.rm(e,this):dom.rm(this)},e.insert=function(e,t){return dom.insert(e,t,this)},e.clone=t.clone=function(e){return dom.clone(this,e)},e.find=function(e){return dom(e,this)},e.on=function(e,t){var n=e.split(" "),r=n.length;while(r--)this.addEventListener(n[r],t)},t.on=function(e,t){var n=this.length;while(n--)this[n].on(e,t)},e.tap=function(e,t){t=t||300;var n;this.addEventListener(Mouse.DOWN,function(r){n=setTimeout(function(){e(r)},t)}),this.addEventListener(Mouse.MOVE,function(){clearTimeout(n)})},t.tap=function(e){for(var t=0,n=this.length;t<n;t++)this[t].tap(e)},e.once=t.one=function(e,t){function r(){n.off(e,r),t()}var n=this;this.on(e,r)},e.off=function(e,t){var n=e.split(" "),r=n.length;while(r--)this.removeEventListener(n[r],t)},t.off=function(e,t){var n=this.length;while(n--)this[n].off(e,t)},e.css=function(e){for(var t in e)this.style[t]=e[t]},t.css=function(e){for(var t=0,n=this.length;t<n;t++)for(var r in e)this[t].style[r]=e[r]},t.contains=function(e){for(var t=0,n=this.length;t<n;t++)if(e==this[t])return!0;return!1}})();
// Original file: Capabilities.js
/*

 FJ.Capabilities extends Modernizr.

 */FJ.Capabilities=function(){if(Modernizr==undefined)throw Error("Modernizr is required");var e=Modernizr,t="",n=["o","webkit","moz","ms"],r=(Modernizr.prefixed("transform")||"").toLowerCase();for(var i=0;i<n.length;i++)r.split("transform")[0]==n[i]&&(t="-"+n[i]+"-");return e.vendor=t,e.isMobile=e.touch||window.navigator.msPointerEnabled,e}();
// Original file: CSSAnimationBehavior.js
FJ.CSSAnimationBehavior=function(e,t){e.animation={};var n=e.animation,r=e.style,i=FJ.Capabilities.vendor;return n.set=function(e,o,u,f,l,c){f=f||0;var h=(o+f)*1e3;r[i+"animation"]=e+" "+o+"s "+u+" "+f+"s",c&&(r[i+"animationFillMode"]=c),(l||t)&&setTimeout(function(){t&&n.reset(),l&&l()},h)},n.reset=function(){r[i+"animation"]="",r[i+"animationFillMode"]=""},n};
// Original file: CSSTransformBehavior.js
(function(){FJ.CSSTransformBehavior=function(e,t){function a(){e.style[i+"transform"]=s.toString()}t=t||{},t.transform={};var n=t.transform,r=FJ.Capabilities.csstransforms,i=FJ.Capabilities.vendor||"",s={translateZ:undefined,translateX:undefined,translateY:undefined,skewX:undefined,skewY:undefined,scaleX:undefined,scaleY:undefined,rotate:undefined,rotateX:undefined,rotateY:undefined,rotateZ:undefined,toString:function(){var e="";for(var t in this)this[t]!=undefined&&typeof this[t]!="function"&&(e+=t+"("+this[t]+") ");return e}};n.transforms=function(){return s},FJ.Capabilities.csstransforms3d&&(s.translateZ=0);var o="50%",u="50%";return define(n,"origin",function(){return{x:o,y:u}},function(t,n){o=t,u=n,e.style[i+"transform-origin"]=o+" "+u}),r?(n.translate=function(e,t,n){s.translateX=e+"px",s.translateY=t+"px",s.translateZ=n+"px",a()},define(n,"x",function(){return s.translateX=s.translateX||"0",parseFloat(s.translateX)},function(e){s.translateX=e+"px",a()}),define(n,"y",function(){return s.translateY=s.translateY||"0",parseFloat(s.translateY)},function(e){s.translateY=e+"px",a()}),define(n,"z",function(){return s.translateZ=s.translateZ||"0",parseFloat(s.translateZ)},function(e){s.translateZ=e+"px",a()})):(n.translate=function(t,n){e.style.left=t+"px",e.style.top=n+"px"},define(n,"x",function(){return parseFloat(e.style.left)},function(t){e.style.left=t+"px"}),define(n,"y",function(){return parseFloat(e.style.top)},function(t){e.style.top=t+"px"})),define(n,"rotate",function(){s.rotate=s.rotate||"0";var e=/([a-z].*)/g;return parseFloat(s.rotate)},function(e,t){t=t||"deg",s.rotate=e+t,a()}),n.scale=function(e,t){s.scaleX=e,s.scaleY=t,a()},define(n,"scaleX",function(){return s.scaleX=s.scaleX||"1",parseFloat(s.scaleX)},function(e){s.scaleX=e,a()}),define(n,"scaleY",function(){return s.scaleY=s.scaleY||"1",parseFloat(s.scaleY)},function(e){s.scaleY=e,a()}),n.skew=function(e,t,n){n=n||"deg",s.skewX=e+n,s.skewY=t+n,a()},n.rotate3D=function(e,t,n,r){r=r||"deg",s.rotateX=e+r,s.rotateY=t+r,s.rotateZ=n+r,a()},define(n,"skewX",function(){return parseFloat(s.skewX)},function(e,t){t=t||"deg",s.skewX=e+t,a()}),define(n,"skewY",function(){return parseFloat(s.skewY)},function(e){var t=t||"deg";s.skewY=e+t,a()}),t},define=function(e,t,n,r){e[t]=function(){if(arguments.length<1)return n();r&&r.apply(this,arguments)}}})();
// Original file: CSSTransitionBehavior.js
/*
 This behavior (optionally) extends an existing object (reverse inheritance) so it will be able to control a dom element.

 To access these methods, use controller.transition.*

 @author josh.beckwith@toolofna.com

 @param element - the DOM element to be affected
 @param controller - object used to make calls
 @param opt_vendor - optional vendor prefix. Defaults to FJ.Capabilities.vendor if it exists, else uses no prefix

 @return - the controller object

 */FJ.CSSTransitionBehavior=function(e,t,n){function o(){var t=[];for(var n in s){var r="";r+=n+" ",r+=s[n].duration+"ms ",r+=s[n].delay+"ms ",r+=s[n].ease,t.push(r)}e.style[i+"transition"]=t.join(",")}t=t||{};var r=t.transition={},i="",s={};return n!=undefined?i="-"+n+"-":FJ.Capabilities.vendor!=undefined&&(i=FJ.Capabilities.vendor),r.set=function(e,t,n,r,i){var u=t||300,a=n||0;s[e]={},s[e].duration=u,s[e].delay=a,s[e].ease=r||FJ.ANIM.EASE,o(),i&&setTimeout(function(){i()},u+a)},r.setPrefixed=function(e,t,n,s){r.set(i+e,t,n,s)},r.properties=function(){return s},t},FJ.ANIM={};var cb="cubic-bezier(";FJ.ANIM.cubicBezier=function(e,t,n,r){return cb+e+", "+t+", "+n+", "+r+")"},FJ.ANIM.EASE_IN_OUT="ease-in-out",FJ.ANIM.EASE_OUT="ease-out",FJ.ANIM.EASE_IN="ease-in",FJ.ANIM.EASE="ease",FJ.ANIM.LINEAR="linear",FJ.ANIM.BACK_IN=cb+"1, -1, .25, 1.25)",FJ.ANIM.BACK_OUT=cb+".75, -0.25, 0, 2)",FJ.ANIM.STUTTER_IN=cb+"0, .29, 1, -0.36)";
// Original file: DataService.js
/**
 *
 *  Data retrieval service that automatically stores data in FJ.Application.model
 *
 *  Must assign a data map!!! For default FJ.View to work, use view id keys with data and template
 *  FJ.DataService.map = {
 *                          "home":{
 *                              "data":"data/json/home.json",
 *                              "template":"data/templates/home.html"
 *                              }
 *                          "page_two":{
 *                              "data":"data.json",
 *                              "recipe":"tuna_casserole.txt"
 *                          },
 *                          a_list:[
 *                              "path.xml",
 *                              "path/to/whatever.html"
 *                          ]
 *                       };
 *
 *
 *  Requesting an object with paths in it will result in data being stored by the individual path keys.
 *  e.g. - FJ.Application.model.home.json
 *
 *  Requesting arrays of paths will store results by numeric key
 *  e.g. - FJ.Application.model.a_list[0]
 *
 */FJ.DataService=new function(){function n(n,r,i){t[n]==undefined||i?FJ.Loader.load(e.map[n],function(e){t[n]=e,r(e)}):r(t[n])}function r(e,n,r){t[e]==undefined||r?FJ.Loader.load(e,function(r){t[e]=r,n(r)}):n(t[e])}function i(t,n,r){var i=t.length,s=[];for(var o=0,u=t.length;o<u;o++)e.map[t[o]]==undefined?console.warn("no path at: ",o," in ",t):e.request(t[o],function(e){i--,s.push(e),i||n(s)},r)}function s(n,r,i){var s=0,o=e.map[n];for(var u in o)s++;for(var a in o){t[n]=t[n]||{},t[n][a]==undefined||i?function(){var r=a;FJ.Loader.load(e.map[n][r],function(e){t[n][r]=e,f()})}():f();function f(){s--,s||r(t[n])}}}var e=this,t=FJ.Application.model;this.map={},this.request=function(t,o,u){typeof e.map[t]=="string"?n(t,o,u):t instanceof Array?i(t,o,u):typeof e.map[t]=="object"?s(t,o,u):typeof t=="string"&&r(t,o,u)}};
// Original file: DOM_FJ.js
// IE 8 Node fix. Might need a better polyfill if we are going to use Node-specific methods
typeof window.Node=="undefined"&&(window.Node=Element),dom.getWidth=function(e){return e.offsetWidth},dom.getHeight=function(e){return e.offsetHeight},function(){var e=Node.prototype;e.getWidth=function(){return dom.getWidth(this)},e.getHeight=function(){return dom.getHeight(this)},e.transform=function(t,n){n=FJ.Capabilities.vendor||n,e.transform=function(e){this.style[n+"transform"]=e},e.transform(t)},e.transformGPU=function(t,n){n=FJ.Capabilities.vendor||n,e.transformGPU=function(e){this.style[n+"transform"]="translateZ(0) "+e},e.transformGPU(t)};var t=new XMLSerializer;DocumentFragment.prototype.asString=function(){return t.serializeToString(this)}}();

// Original file: EventDispatcher.js
/**
 * The EventDispatcher is typically used as a property of an object (i.e. by composition)
 *
 * @param masterFunc this function will be invoked each time a listener is added or removed.
 * Thanks to this the parent object can be notified if it has any listeners.
 */FJ.EventDispatcher=function(e){var t=[];this.addEventListener=function(n){if(t.indexOf(n)>-1)return;t.push(n),e&&e(t.length)},this.removeEventListener=function(n){var r=t.indexOf(n);return r<0?null:(e&&e(t.length-1),t.splice(r,1))},this.dispatch=function(e){var n=t.length;for(var r=0;r<n;r++)t[r](e)}};
// Original file: Extensions.js
// Code from https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel
// Creates a global "addwheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(e,t){var n="",r,i,s;e.addEventListener?(r="addEventListener",i="removeEventListener"):(r="attachEvent",i="detachEvent",n="on"),t.onmousewheel!==undefined&&(s="mousewheel");try{WheelEvent("wheel"),s="wheel"}catch(o){}s||(s="DOMMouseScroll"),e.addWheelListener=function(e,t,i){var o=s=="wheel"?t:u(t);return e[r](n+s,o,i||!1),s=="DOMMouseScroll"&&e[r]("MozMousePixelScroll",o,i||!1),o},e.removeWheelListener=function(e,t){e[i](n+s,t),s=="DOMMouseScroll"&&e[i]("MozMousePixelScroll",t)};var u=function(t){return function(n){!n&&(n=e.event);var r={originalEvent:n,target:n.target||n.srcElement,type:"wheel",deltaMode:n.type=="MozMousePixelScroll"?0:1,deltaX:0,deltaY:0,preventDefault:function(){n.preventDefault?n.preventDefault():n.returnValue=!1}};return s=="mousewheel"?(r.deltaY=-n.wheelDelta/10,n.wheelDeltaX&&(r.deltaX=-n.wheelDeltaX/10)):r.deltaY=n.detail,r.deltaX=r.deltaX|0,r.deltaY=r.deltaY|0,t(r)}}})(window,document),function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var r=(new Date).getTime(),i=Math.max(0,16-(r-e)),s=window.setTimeout(function(){t(r+i)},i);return e=r+i,s}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}(),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){for(var n=t||0,r=this.length;n<r;n++)if(this[n]===e)return n;return-1}),(!window.console||!console.log)&&function(){var e=function(){},t=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","markTimeline","table","time","timeEnd","timeStamp","trace","warn"],n=t.length,r=window.console={};while(n--)r[t[n]]=e}(),function(){function s(e){this._element=e;if(e.className!=this.classCache){this._classCache=e.className;var t=this._classCache.split(" "),r;for(r=0;r<t.length;r++)n.call(this,t[r])}}function o(e,t){e.className=t.join(" ")}function u(e,t,n){Object.defineProperty?Object.defineProperty(e,t,{get:n}):e.__defineGetter__(t,n)}if(typeof Element=="undefined"||"classList"in document.documentElement)return;var e=[].indexOf,t=[].slice,n=[].push,r=[].splice,i=[].join;s.prototype={add:function(e){n.call(this,e),o(this._element,t.call(this,0))},contains:function(t){return e.call(this,t)!==-1},item:function(e){return this[e]||null},remove:function(n){var i=e.call(this,n);if(i===-1)return;r.call(this,i,1),o(this._element,t.call(this,0))},toString:function(){return i.call(this," ")},toggle:function(t){e.call(this,t)===-1?this.add(t):this.remove(t)}},window.DOMTokenList=s,u(Element.prototype,"classList",function(){return new s(this)})}(),function(){if(typeof window.addEventListener!="undefined")return;var e=document.createEventObject().constructor.prototype;Object.defineProperty(e,"bubbles",{get:function(){var e=["select","scroll","click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup","wheel","textinput","keydown","keypress","keyup"],t=this.type;for(var n=0,r=e.length;n<r;n++)if(t===e[n])return!0;return!1}}),Object.defineProperty(e,"defaultPrevented",{get:function(){var e=this.returnValue,t;return e!==t&&!e}}),Object.defineProperty(e,"relatedTarget",{get:function(){var e=this.type;return e==="mouseover"||e==="mouseout"?e==="mouseover"?this.fromElement:this.toElement:null}}),Object.defineProperty(e,"target",{get:function(){return this.srcElement}}),e.preventDefault=function(){this.returnValue=!1},e.stopPropagation=function(){this.cancelBubble=!0};var t=function(e){return typeof e!="function"&&typeof e.handleEvent=="function"},n="__eventShim__",r=function(e,r,i){var s=r;t(r)&&(typeof r[n]!="function"&&(r[n]=function(e){r.handleEvent(e)}),s=r[n]),this.attachEvent("on"+e,s)},i=function(e,r,i){var s=r;t(r)&&(s=r[n]),this.detachEvent("on"+e,s)};HTMLDocument.prototype.addEventListener=r,HTMLDocument.prototype.removeEventListener=i,Element.prototype.addEventListener=r,Element.prototype.removeEventListener=i,window.addEventListener=r,window.removeEventListener=i}();
// Original file: FrameImpulse.js
FJ.FrameImpulse=function(){window.requestAnimFrame=window.requestAnimFrame||function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();var e=new FJ.EventDispatcher,t={};t.frameNum=0;var n=function(){requestAnimFrame(n),t.frameNum++,e.dispatch(t)};return n(),e}();
// Original file: Loader.js
// used for anonymous jsonp callbacks
window.__loadCount=0,FJ.Loader={loadJSON:function(e,t,n,r){n=n||"GET";var i=new XMLHttpRequest;i.open(n,e),i.onreadystatechange=function(){i.readyState==4&&t(JSON.parse(i.responseText))},i.send(r)},loadJSONP:function(e,t){var n=document.createElement("script"),r=e.split("?"),i=r[0]+"?callback=__loaded"+window.__loadCount;r.length>1&&(i+="&"+r.pop()),n.src=i,document.getElementsByTagName("head")[0].appendChild(n),t!=undefined&&(window["__loaded"+window.__loadCount]=function(n){try{t(n)}catch(r){console.warn("error loading",e,r)}},window.__loadCount++)},loadPlainText:function(e,t){var n=new XMLHttpRequest;n.open("GET",e),n.onreadystatechange=function(){n.readyState==4&&t(n.responseText)},n.send()},loadScript:function(e,t){var n=document.createElement("script");n.onload=t,n.type="text/javascript",n.src=e,document.getElementsByTagName("head")[0].appendChild(n)},loadStyle:function(e,t){var n=document.createElement("link");n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/"+e.split(".")[1]),n.setAttribute("href",e),document.getElementsByTagName("head")[0].appendChild(n),setTimeout(t,50)},loadImg:function(e,t){var n=new Image;n.onload=function(){t(n)},n.src=e},load:function(e,t,n,r){function s(e,t,n,r){e.match("http")!=undefined?FJ.Loader.loadJSONP(e,t):FJ.Loader.loadJSON(e,t,n,r)}var i=FJ.Loader.load.extensionMap={css:FJ.Loader.loadStyle,less:FJ.Loader.loadStyle,js:FJ.Loader.loadScript,json:s,jpg:FJ.Loader.loadImg,jpeg:FJ.Loader.loadImg,png:FJ.Loader.loadImg,gif:FJ.Loader.loadImg,"*":FJ.Loader.loadPlainText};FJ.Loader.load=function(e,t,n,r){function l(e){e&&f.push(e),a--,a||(f.length==1&&(f=f[0]),t(f))}var s=e.split("."),o=s.pop(),u=[];typeof e=="string"&&u.push(e);var a=u.length,f=[];for(var c=0,h=u.length;c<h;c++)i[o]?i[o](e,l,n,r):o.length>4?FJ.Loader.loadJSONP(e,l):i["*"](e,l)},FJ.Loader.load(e,t,n,r)}};
// Original file: MathUtil.js
FJ.MathUtil={step:function(e,t){return t>=e?1:0},minWithSign:function(e,t){var n=e<0?-1:1,r=Math.min(Math.abs(e),t);return r*n},maxWithSign:function(e,t){var n=e<0?-1:1,r=Math.max(Math.abs(e),t);return r*n},clamp:function(e,t,n){return n<e?e:n>t?t:n},smoothStep:function(e,t,n){return n<=e?e:n>=t?t:(n=(n-e)/(t-e),e+(t-e)*(3*n*n-2*n*n*n))},easeQuadInOut:function(e,t,n){return(n*=2)<1?e+(t-e)*.5*n*n:e+(t-e)*-0.5*(--n*(n-2)-1)}},FJ.V2=function(e,t){return{x:e,y:t}};
// Original file: Mediator.js
FJ.Mediator=function(e){this.name=e,this.notify=function(e){this.update&&this.update(e)}};
// Original file: Messager.js
FJ.Messager=new function(){var e={},t=[];return{subscribe:function(t,n){e[t]=e[t]||[],e[t].push(n)},unsubscribe:function(t,n){try{var r=e[t].indexOf(n);e[t].splice(r,1)}catch(i){}},publish:function(n){t.push(n);if(t.length>1)return;while(t.length){var r=e[t[0].message]||[],i=r.length;while(i--)r[i](t[0]);t.shift()}}}};
// Original file: Mouse.js
dom=dom||{},dom.Mouse=new function(){window.navigator.msPointerEnabled?(this.DOWN="MSPointerDown",this.UP="MSPointerUp",this.MOVE="MSPointerMove",this.OVER="MSPointerOver",this.OUT="MSPointerOut",this.CANCEL="MSPointerCancel"):"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch?(this.DOWN="touchstart",this.UP="touchend",this.MOVE="touchmove",this.OVER="mouseover",this.OUT="touchleave",this.CANCEL="touchcancel"):(this.DOWN="mousedown",this.UP="mouseup",this.MOVE="mousemove",this.OVER="mouseover",this.OUT="mouseout",this.CANCEL="mousecancel")};
// Original file: Notification.js
FJ.Notification=function(e,t,n){if(!e)throw"NOTIFICATION ERROR. Message cannot be null";if(t==FJ.NOTIF_NAVIGATION&&!n)throw"NOTIFICATION ERROR. Navigation type notifications require a slug";this.message=e,this.vars=null,this.type=t||FJ.NOTIF_EVENT,this.slug=n||"",this.action=null,this.postAction=null},FJ.Notification.prototype.publish=function(){FJ.Messager.publish(this)},FJ.Notification.prototype.broadcast=function(){FJ.Application.broadcast(this)};
// Original file: Router.js
FJ.Router=new function(){"use strict";var e=this,t=" ",n=100,r=document.location.href,i=r.indexOf("#"),s=i>0?r.substring(0,i):r,o=function(){var e=r.indexOf("#"),n=r.substring(e+2);return e>0&&e!=r.length-1?n:t},u=function(e){FJ.Application.slug=e,r=s+"#/"+e,document.location.href=r,a[a.length-2]==e?a.pop():a.push(e)},a=[];this.getHistory=function(){return a},this.start=function(i){t=i;var s=o();e.navigateBySlug=new FJ.Notification(FJ.MSG_NAVIGATE,FJ.NOTIF_NAVIGATION,s),a.push(s),setInterval(function(){document.location.href!=r&&(document.location.hash==""&&a.go(-1),r=document.location.href,e.navigateBySlug.slug=o(),FJ.Application.broadcast(e.navigateBySlug))},n)},this.init=function(){FJ.Application.createMediator("router").update=function(e){e.type==FJ.NOTIF_NAVIGATION&&u(e.slug)}},this.getSlug=function(){return new FJ.Slug(o())}};
// Original file: Slug.js
/**
 * A small utility to work with slugs.
 *
 * It will parse the current slug and return some information about it.
 *
 * A slug is considered to be composed of any number of parts separated by a slash (/)
 *
 * The first element in a slug is called head.
 * All the parts, including the head, can be accessed in form of array (parts).
 *
 * The parts can also be accessed as key/value pairs.
 * In this case, the first 'key' is the 2nd part, the first 'value' is the 3rd.
 * The 1st part, the head, is not considered part of the key/value chain.
 * If the number of parts if even (i.e. odd, if we take the first one out) the last part will be omitted.
 */FJ.Slug=function(e){var t="/";this.parts=e.split("?")[0].split(t);while(this.parts[this.parts.length-1]=="")this.parts.pop();var n=this.parts.length;n>1&&this.parts[0]==""&&this.parts.shift(),this.head=this.parts[0],this.values={};if(n>1){var r=(n-1)/2|0;for(var i=0;i<r;i++){var s=this.parts[1+i*2],o=this.parts[1+i*2+1];this.values[s]=o}}this.isHeadOnly=function(){return n==1}};
// Original file: Template.js
function each(e,t){if(e==undefined)return;for(var n in e)t(e[n])}function fori(e,t){if(e==undefined)return;for(var n=0,r=e.length||0;n<r;n++)t(e,n)}(function(){var e=/(.)^/,t={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},n=/\\|'|\r|\n|\t|\u2028|\u2029/g;window._Template=function(r,i,s){var o,u=_Template.settings;if(s)for(var a in s)i[a]==undefined&&(i[a]=s[a]);var f=new RegExp([(u.escape||e).source,(u.interpolate||e).source,(u.evaluate||e).source].join("|")+"|$","g"),l=0,c="__p+='";r.replace(f,function(e,i,s,o,u){return c+=r.slice(l,u).replace(n,function(e){return"\\"+t[e]}),i&&(c+="'+\n((__t=("+i+"))==null?'':_.escape(__t))+\n'"),s&&(c+="'+\n((__t=("+s+"))==null?'':__t)+\n'"),o&&(c+="';\n"+o+"\n__p+='"),l=u+e.length,e}),c+="';\n",c="with(obj||{}){\n"+c+"}\n",c="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+c+"return __p;\n";try{o=new Function("obj","_",c)}catch(h){throw h.source=c,h}if(i){var p="";try{p=o(i)}catch(h){var d=["Can't find variable: "," is not defined"," is undefined","'"],v=h.message;for(var m=0,g=d.length;m<g;m++)v=v.replace(d[m],"");i[v]=!1,p=o(i)}return p}var y=function(e){return o.call(this,e)};return y.source="function("+(u.variable||"obj")+"){\n"+c+"}",y},window._Template.settings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g}})(),FJ.Template=_Template;
// Original file: View.js
/**
 *
 * FJ.View comes with some functionality for free. By default, it will listen to navigation events and show / hide based
 * on if the current slug matches the view's ID. To override the default functionality, just rewrite the function on the
 * view instance.
 *

 @method show(): adds this view to its root
 @method hide(): removes this view from the dom
 @method onshow(): fires immediately after show() no default functionality.
 @method onhide(): fires immediately after hide(). no default functionality
 @method isVisible(): @return value determines the visibility state for this view

 @method template(tmplString, data)
 @method setData(data)

 @property id: view id
 @property node: view's element
 @property root: container element to put this view into
 @property templateData: json data used for templating
 @property templateString: un-parsed template string

 */FJ.View=function(e,t){"use strict";this.root=t||document.body;var n=this;this.node=dom.create("div"),this.id=e,this.templateData={},this.templateString="",this.onshow=function(){},this.onhide=function(){},FJ.Application.createMediator().update=function(e){switch(e.message){case FJ.MSG_NAVIGATE:var t=n.isVisible();t&&!n.root.contains(n.node)?n.show():!t&&n.root.contains(n.node)&&n.hide()}},this.isVisible=function(){return FJ.Router.getSlug().head==n.id},this.show=function(){try{FJ.DataService.request(n.id,function(){n.template(FJ.Application.model[n.id].template,FJ.Application.model[n.id].data),n.root.add(n.node),n.onshow()})}catch(e){console.warn("missing data in FJ.DataService.map for ",n.id),n.root.add(n.node),n.onshow()}},this.hide=function(){n.root.contains(n.node)&&(n.node.remove(),n.onhide())},this.template=function(e,t){e&&(n.templateString=e,t&&n.setData(t))},this.setData=function(e){if(!e)return n.templateData;n.templateData=e,n.node.innerHTML=FJ.Template(n.templateString,n.templateData)}};
// Original file: VirtualScroll.js
FJ.VirtualScroll=function(e){e=e||1;var t=2,n=this;this.event={scrollX:0,scrollY:0,targetScrollX:0,targetScrollY:0,deltaX:0,deltaY:0,maxDeltaX:0,maxDeltaY:0};var r=0,i=0,s=!1,o=!1,u,a,f,l,c,h,p=new FJ.EventDispatcher(function(e){e>0&&!s?(x(),s=!0):e==0&&s&&(T(),s=!1)});this.listen=function(e){p.addEventListener(e)},this.unlisten=function(e){p.removeEventListener(e)},this.onElement=function(e,t,r){function i(n){e.style[FJ.Capabilities.vendor+"transform"]="translateZ(0) translateX("+ -n.scrollY*t+"px)"}function s(n){e.style[FJ.Capabilities.vendor+"transform"]="translateZ(0) translateY("+ -n.scrollY*t+"px)"}t=t||1,d.push(e),r?n.listen(i):n.listen(s)};var d=[],v=null,m=null,g=null,y=null;this.limitX=function(e,t){v=e,m=t},this.limitY=function(e,t){g=e,y=t},this.reset=function(){n.setValue(0,0)},this.setValue=function(e,t){n.event.scrollX=e,n.event.scrollY=t,n.event.targetScrollX=e,n.event.targetScrollY=t,o=!1},this.scrollTo=function(e,t,r){o=!0,u=n.event.scrollX,a=n.event.scrollY,n.event.targetScrollX=e,n.event.targetScrollY=t,c=r||30,h=0};var b=function(){h++;var e=FJ.MathUtil.easeQuadInOut(u,n.event.targetScrollX,h/c),t=FJ.MathUtil.easeQuadInOut(a,n.event.targetScrollY,h/c);w(e-n.event.scrollX,t-n.event.scrollY),h>=c&&(o=!1)},w=function(t,r){e&&!o?(n.event.targetScrollX+=t,n.event.targetScrollY+=r):(n.event.scrollX+=t,n.event.scrollY+=r),n.event.maxDeltaX=Math.max(n.event.maxDeltaX,Math.abs(t)),n.event.maxDeltaY=Math.max(n.event.maxDeltaY,Math.abs(r)),n.event.deltaX=t,n.event.deltaY=r},E,S=function(){v!=null&&(n.event.scrollX=FJ.MathUtil.clamp(v,m,n.event.scrollX),n.event.targetScrollX=FJ.MathUtil.clamp(v,m,n.event.targetScrollX)),g!=null&&(n.event.scrollY=FJ.MathUtil.clamp(g,y,n.event.scrollY),n.event.targetScrollY=FJ.MathUtil.clamp(g,y,n.event.targetScrollY)),p.dispatch(n.event)},x=function(){FJ.Capabilities.touch?(document.addEventListener("touchstart",k,!1),document.addEventListener("touchmove",L,!1)):E=addWheelListener(document,C,!1),FJ.FrameImpulse.addEventListener(N)},T=function(){removeWheelListener(document,E),document.removeEventListener("touchstart",k),document.removeEventListener("touchmove",L)},N=function(){o?b():e&&(n.event.scrollX+=(n.event.targetScrollX-n.event.scrollX)*e,n.event.scrollY+=(n.event.targetScrollY-n.event.scrollY)*e),S()},C=function(e){o=!1;var n=e.deltaY==e.deltaY>>0?e.deltaY:e.deltaY*e.deltaY*e.deltaY,r=e.deltaX==e.deltaX>>0?e.deltaX:e.deltaX*e.deltaX*e.deltaX;w(r*t,n*t)},k=function(e){r=0,i=0},L=function(e){e.preventDefault(),o=!1,r!=0&&w(-(e.targetTouches[0].pageX-r)*t,-(e.targetTouches[0].pageY-i)*t),r=e.targetTouches[0].pageX,i=e.targetTouches[0].pageY}};
