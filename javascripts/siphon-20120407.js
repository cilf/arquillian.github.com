/*
 * Optimized version of jQuery Templates, for rendering to string.
 * Does not require jQuery, or HTML DOM
 * Integrates with JsViews (http://github.com/BorisMoore/jsviews)
 * Copyright 2012, Boris Moore
 * Released under the MIT License.
 */
this.jsviews||this.jQuery&&jQuery.views||function(window,undefined){function setDelimiters(openChars,closeChars){var firstOpenChar="\\"+openChars.charAt(0),secondOpenChar="\\"+openChars.charAt(1),firstCloseChar="\\"+closeChars.charAt(0),secondCloseChar="\\"+closeChars.charAt(1);return jsv.rTag=rTag=secondOpenChar+"(?:(?:(\\w+(?=[\\/\\s"+firstCloseChar+"]))|(?:(\\w+)?(:)|(>)|(\\*)))\\s*((?:[^"+firstCloseChar+"]|"+firstCloseChar+"(?!"+secondCloseChar+"))*?)(\\/)?|(?:\\/(\\w+)))"+firstCloseChar,rTag=new RegExp(firstOpenChar+rTag+secondCloseChar,"g"),rTmplString=new RegExp("<.*>|"+openChars+".*"+closeChars),this}function getHelper(helper){var view=this,tmplHelpers=view.tmpl.helpers||{};return helper=(view.ctx[helper]!==undefined?view.ctx:tmplHelpers[helper]!==undefined?tmplHelpers:helpers[helper]!==undefined?helpers:{})[helper],"function"!=typeof helper?helper:function(){return helper.apply(view,arguments)}}function convert(converter,view,text){var tmplConverters=view.tmpl.converters;return converter=tmplConverters&&tmplConverters[converter]||converters[converter],converter?converter.call(view,text):text}function renderTag(tag,parentView,converter,content,tagObject){tagObject.props=tagObject.props||{};var ret,tmpl=tagObject.props.tmpl,tmplTags=parentView.tmpl.tags,nestedTemplates=parentView.tmpl.templates,args=arguments,tagFn=tmplTags&&tmplTags[tag]||tags[tag];return tagFn?(content=content&&parentView.tmpl.tmpls[content-1],tmpl=tmpl||content||undefined,tagObject.tmpl=""+tmpl===tmpl?nestedTemplates&&nestedTemplates[tmpl]||templates[tmpl]||templates(tmpl):tmpl,tagObject.isTag=TRUE,tagObject.converter=converter,tagObject.view=parentView,tagObject.renderContent=renderContent,parentView.ctx&&extend(tagObject.ctx,parentView.ctx),ret=tagFn.apply(tagObject,args.length>5?slice.call(args,5):[]),ret||(ret==undefined?"":ret.toString())):""}function View(context,path,parentView,data,template,index){var views=parentView.views,self={tmpl:template,path:path,parent:parentView,data:data,ctx:context,views:$.isArray(data)?[]:{},hlp:getHelper};return $.isArray(views)?views.splice(self.index=index!==undefined?index:views.length,0,self):views[self.index="_"+autoViewKey++]=self,self}function addToStore(self,store,name,item,process){var key,onStore;if(name&&"object"==typeof name&&!name.nodeType){for(key in name)store(key,name[key]);return self}return name&&item!==undefined?""+name===name&&(null===item?delete store[name]:(item=process?process(name,item):item)&&(store[name]=item)):process&&(item=process(undefined,item||name)),(onStore=sub.onStoreItem)&&onStore(store,name,item,process),item}function templates(name,tmpl){return addToStore(this,templates,name,tmpl,compile)}function tags(name,tagFn){return addToStore(this,tags,name,tagFn)}function helpers(name,helperFn){return addToStore(this,helpers,name,helperFn)}function converters(name,converterFn){return addToStore(this,converters,name,converterFn)}function renderContent(data,context,parentView,path,index){var i,l,dataItem,newView,itemWrap,itemsWrap,itemResult,parentContext,tmpl,layout,props={},swapContent=index===TRUE,self=this,result="";if(self.isTag?(tmpl=self.tmpl,context=context||self.ctx,parentView=parentView||self.view,path=path||self.path,index=index||self.index,props=self.props):tmpl=self.jquery&&self[0]||self,parentView=parentView||jsv.topView,parentContext=parentView.ctx,layout=tmpl.layout,data===parentView&&(data=parentView.data,layout=TRUE),context=context&&context===parentContext?parentContext:parentContext?(parentContext=extend({},parentContext),context?extend(parentContext,context):parentContext):context||{},props.link===FALSE&&(context.link=FALSE),tmpl.fn||(tmpl=templates[tmpl]||templates(tmpl)),itemWrap=context.link&&sub.onRenderItem,itemsWrap=context.link&&sub.onRenderItems,tmpl){if($.isArray(data)&&!layout)for(newView=swapContent?parentView:index!==undefined&&parentView||View(context,path,parentView,data,tmpl,index),i=0,l=data.length;l>i;i++)dataItem=data[i],itemResult=tmpl.fn(dataItem,View(context,path,newView,dataItem,tmpl,(index||0)+i),jsv),result+=itemWrap?itemWrap(itemResult,props):itemResult;else newView=swapContent?parentView:View(context,path,parentView,data,tmpl,index),result+=data||layout?tmpl.fn(data,newView,jsv):"";return parentView.topKey=newView.index,itemsWrap?itemsWrap(result,path,newView.index,tmpl,props):result}return""}function syntaxError(){throw"Syntax error"}function tmplFn(markup,tmpl,bind){function pushPreceedingContent(shift){shift-=loc,shift&&content.push(markup.substr(loc,shift).replace(rNewLine,"\\n"))}function parseTag(all,tagName,converter,colon,html,code,params,slash,closeBlock,index){html&&(colon=":",converter="html");var hash="",passedCtx="",block=!slash&&!colon;if(tagName=tagName||colon,pushPreceedingContent(index),loc=index+all.length,code?allowCode&&content.push(["*",params.replace(rUnescapeQuotes,"$1")]):tagName?("else"===tagName&&(current[5]=markup.substring(current[5],index),current=stack.pop(),content=current[3],block=TRUE),params=params?parseParams(params,bind).replace(rBuildHash,function(all,isCtx,keyValue){return isCtx?passedCtx+=keyValue+",":hash+=keyValue+",",""}):"",hash=hash.slice(0,-1),params=params.slice(0,-1),newNode=[tagName,converter||"",params,block&&[],"{"+(hash?"props:{"+hash+"},":"")+"path:'"+params+"'"+(passedCtx?",ctx:{"+passedCtx.slice(0,-1)+"}":"")+"}"],block&&(stack.push(current),current=newNode,current[5]=loc),content.push(newNode)):closeBlock&&(current[5]=markup.substring(current[5],index),current=stack.pop()),!current)throw"Expected block tag";content=current[3]}var newNode,node,i,l,code,hasTag,hasEncoder,getsValue,hasConverter,hasViewPath,tag,converter,params,hash,nestedTmpl,allowCode,tmplOptions=tmpl?{allowCode:allowCode=tmpl.allowCode,debug:tmpl.debug}:{},nested=tmpl&&tmpl.tmpls,astTop=[],loc=0,stack=[],content=astTop,current=[,,,astTop],nestedIndex=0;for(markup=markup.replace(rEscapeQuotes,"\\$1"),markup.replace(rTag,parseTag),pushPreceedingContent(markup.length),l=astTop.length,code=l?"":'"";',i=0;l>i;i++)node=astTop[i],""+node===node?code+='"'+node+'"+':"*"===node[0]?code=code.slice(0,i?-1:-3)+";"+node[1]+(l>i+1?"ret+=":""):(tag=node[0],converter=node[1],params=node[2],content=node[3],hash=node[4],markup=node[5],content&&(nestedTmpl=TmplObject(markup,tmplOptions,tmpl,nestedIndex++),tmplFn(markup,nestedTmpl),nested.push(nestedTmpl)),hasViewPath=hasViewPath||hash.indexOf("view")>-1,code+=(":"===tag?"html"===converter?(hasEncoder=TRUE,"e("+params):converter?(hasConverter=TRUE,'c("'+converter+'",view,'+params):(getsValue=TRUE,"((v="+params+')!=u?v:""'):(hasTag=TRUE,'t("'+tag+'",view,"'+(converter||"")+'",'+(content?nested.length:'""')+","+hash+(params?",":"")+params))+")+");return code=new Function("data, view, j, b, u",fnDeclStr+(getsValue?"v,":"")+(hasTag?"t=j.tag,":"")+(hasConverter?"c=j.convert,":"")+(hasEncoder?"e=j.converters.html,":"")+"ret; try{\n\n"+(tmplOptions.debug?"debugger;":"")+(allowCode?"ret=":"return ")+code.slice(0,-1)+";\n\n"+(allowCode?"return ret;":"")+"}catch(e){return j.err(e);}"),tmpl&&(tmpl.fn=code,tmpl.useVw=hasConverter||hasViewPath||hasTag),code}function parseParams(params,bind){function parseTokens(all,lftPrn0,lftPrn,path,operator,err,eq,path2,prn,comma,lftPrn2,apos,quot,rtPrn,prn2,space){function parsePath(all,object,helper,view,viewProperty,pathTokens,leafToken){if(object){var ret=(helper?'view.hlp("'+helper+'")':view?"view":"data")+(leafToken?(viewProperty?"."+viewProperty:helper?"":view?"":"."+object)+(pathTokens||""):(leafToken=helper?"":view?viewProperty||"":object,""));return bind&&"("!==prn&&(ret="b("+ret+',"'+leafToken+'")'),ret+(leafToken?"."+leafToken:"")}return all}return operator=operator||"",lftPrn=lftPrn||lftPrn0||lftPrn2,path=path||path2,prn=prn||prn2||"",operator=operator||"",err?(syntaxError(),void 0):aposed?(aposed=!apos,aposed?all:'"'):quoted?(quoted=!quot,quoted?all:'"'):(lftPrn?(parenDepth++,lftPrn):"")+(space?parenDepth?"":named?(named=FALSE,"\b"):",":eq?(parenDepth&&syntaxError(),named=TRUE,"\b"+path+":"):path?path.replace(rPath,parsePath)+(prn?(fnCall[++parenDepth]=TRUE,prn):operator):operator?all:rtPrn?(fnCall[parenDepth--]=FALSE,rtPrn+(prn?(fnCall[++parenDepth]=TRUE,prn):"")):comma?(fnCall[parenDepth]||syntaxError(),","):lftPrn0?"":(aposed=apos,quoted=quot,'"'))}var named,fnCall={},parenDepth=0,quoted=FALSE,aposed=FALSE;return params=(params+" ").replace(rParams,parseTokens)}function compile(name,tmpl,parent,options){function tmplOrMarkupFromStr(value){return""+value===value||value.nodeType>0?(elem=value.nodeType>0?value:!rTmplString.test(value)&&jQuery&&jQuery(value)[0],elem&&elem.type&&(value=templates[elem.getAttribute(tmplAttr)],value||(name=name||"_"+autoTmplName++,elem.setAttribute(tmplAttr,name),value=compile(name,elem.innerHTML,parent,options),templates[name]=value)),value):void 0}var tmplOrMarkup,elem,key,nested,nestedItem;if(tmplOrMarkup=tmplOrMarkupFromStr(tmpl),options=options||(tmpl.markup?tmpl:{}),options.name=name,nested=options.templates,!tmplOrMarkup&&tmpl.markup&&(tmplOrMarkup=tmplOrMarkupFromStr(tmpl.markup))&&(!tmplOrMarkup.fn||tmplOrMarkup.debug===tmpl.debug&&tmplOrMarkup.allowCode===tmpl.allowCode||(tmplOrMarkup=tmplOrMarkup.markup)),tmplOrMarkup!==undefined){name&&!parent&&(render[name]=function(){return tmpl.render.apply(tmpl,arguments)}),tmplOrMarkup.fn||tmpl.fn?tmplOrMarkup.fn&&(tmpl=name&&name!==tmplOrMarkup.name?extend(extend({},tmplOrMarkup),options):tmplOrMarkup):(tmpl=TmplObject(tmplOrMarkup,options,parent,0),tmplFn(tmplOrMarkup,tmpl));for(key in nested)nestedItem=nested[key],nestedItem.name!==key&&(nested[key]=compile(key,nestedItem,tmpl));return tmpl}}function TmplObject(markup,options,parent,index){function extendStore(storeName){parent[storeName]&&(tmpl[storeName]=extend(extend({},parent[storeName]),options[storeName]))}options=options||{};var tmpl={markup:markup,tmpls:[],links:[],render:renderContent};return parent&&(parent.templates&&(tmpl.templates=extend(extend({},parent.templates),options.templates)),tmpl.parent=parent,tmpl.name=parent.name+"["+index+"]",tmpl.index=index),extend(tmpl,options),parent&&(extendStore("templates"),extendStore("tags"),extendStore("helpers"),extendStore("converters")),tmpl}function replacerForHtml(ch){return escapeMapForHtml[ch]||(escapeMapForHtml[ch]="&#"+ch.charCodeAt(0)+";")}var $,rTag,rTmplString,extend,versionNumber="v1.0pre",sub={},FALSE=!1,TRUE=!0,jQuery=window.jQuery,rPath=/^(?:null|true|false|\d[\d.]*|([\w$]+|~([\w$]+)|#(view|([\w$]+))?)([\w$.]*?)(?:[.[]([\w$]+)\]?)?|(['"]).*\8)$/g,rParams=/(\()(?=|\s*\()|(?:([([])\s*)?(?:([#~]?[\w$.]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*([)\]])([([]?))|(\s+)/g,rNewLine=/\r?\n/g,rUnescapeQuotes=/\\(['"])/g,rEscapeQuotes=/\\?(['"])/g,rBuildHash=/\x08(~)?([^\x08]+)\x08/g,autoViewKey=0,autoTmplName=0,escapeMapForHtml={"&":"&amp;","<":"&lt;",">":"&gt;"},tmplAttr="data-jsv-tmpl",fnDeclStr="var j=j||"+(jQuery?"jQuery.":"js")+"views,",htmlSpecialChar=/[\x00"&'<>]/g,slice=Array.prototype.slice,render={},jsv={jsviews:versionNumber,sub:sub,debugMode:TRUE,err:function(e){return jsv.debugMode?"<br/><b>Error:</b> <em> "+(e.message||e)+". </em>":'""'},tmplFn:tmplFn,render:render,templates:templates,tags:tags,helpers:helpers,converters:converters,View:View,convert:convert,delimiters:setDelimiters,tag:renderTag};jQuery?($=jQuery,$.templates=templates,$.render=render,$.views=jsv,$.fn.render=renderContent):($=window.jsviews=jsv,$.extend=function(target,source){var name;target=target||{};for(name in source)target[name]=source[name];return target},$.isArray=Array&&Array.isArray||function(obj){return"[object Array]"===Object.prototype.toString.call(obj)}),extend=$.extend,jsv.topView={views:{},tmpl:{},hlp:getHelper,ctx:jsv.helpers},tags({"if":function(){var ifTag=this,view=ifTag.view;return view.onElse=function(tagObject,args){for(var i=0,l=args.length;l&&!args[i++];)if(i===l)return"";return view.onElse=undefined,tagObject.path="",tagObject.renderContent(view)},view.onElse(this,arguments)},"else":function(){var view=this.view;return view.onElse?view.onElse(this,arguments):""},"for":function(){var i,self=this,result="",args=arguments,l=args.length;for(self.props.layout&&(self.tmpl.layout=TRUE),i=0;l>i;i++)result+=self.renderContent(args[i]);return result},"=":function(value){return value},"*":function(value){return value}}),converters({html:function(text){return text!=undefined?String(text).replace(htmlSpecialChar,replacerForHtml):""}}),setDelimiters("{{","}}")}(this),/*
 * jGFeed 1.0 - Google Feed API abstraction plugin for jQuery
 *
 * Copyright (c) 2009 jQuery HowTo
 *
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * URL:
 *   http://jquery-howto.blogspot.com
 *
 * Author URL:
 *   http://me.boo.uz
 *
 */
function($){$.extend({jGFeed:function(url,fnk,num,key){if(null==url)return!1;var gurl="http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+url;null!=num&&(gurl+="&num="+num),null!=key&&(gurl+="&key="+key),$.getJSON(gurl,function(data){return"function"!=typeof fnk?!1:(fnk.call(this,data.responseData.feed),void 0)})}})}(jQuery);