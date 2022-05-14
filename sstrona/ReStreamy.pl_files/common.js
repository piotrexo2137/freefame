/* ajax */
$.ajaxSetup({success:ajax_result,error:ajax_error});function ajax_result(res,status,xhr,silent)
{if(typeof res=="string")return true;if(res)
{if(res.reload)
{location.reload();return false;}
if(res.error)
{if(!silent)
{setTimeout(function(){alert(res.error);},10);}
return false;}
if(res.info)
{if(!silent)
{setTimeout(function(){alert(res.info);},10);}}
return true;}
return false;}
function ajax_error(xhr,status,error)
{var res=$.parseJSON(xhr.responseText);if(ajax_result(res,status,xhr))alert(status);}
function ajax_error_silent(xhr,status,error)
{var res=$.parseJSON(xhr.responseText);ajax_result(res,status,xhr,true);}
function ajax_refresh_content(content,url,callback)
{var url_host=url.split(/\/+/g)[1];var flexcroll=null;if((window.fleXenv)&&(content.hasClass("flexcrollactive")))
{flexcroll=content;content=content.find(".contentwrapper");}
if((window.location.hostname!=url_host)&&(jQuery.browser.msie)&&(window.XDomainRequest))
{var xdr=new XDomainRequest();xdr.onload=function()
{var html=$.trim(xdr.responseText);if(html!="")
{content.html(html);if(flexcroll)fleXenv.fleXcrollMain(flexcroll.get(0));if(callback)callback();}}
xdr.timeout=1000;xdr.open("get",url);xdr.send();}
else
{$.ajax({url:url,dataType:"html",context:content,success:function(html){html=$.trim(html);if(html!="")
{this.html(html);if(flexcroll)fleXenv.fleXcrollMain(flexcroll.get(0));if(callback)callback();}}});}}
$("a.ajax").live("click",function(){var link=$(this);var url=link.attr("href");if((link.hasClass("destructive"))&&(!confirm("Are you sure?")))return false;if(link.hasClass("action"))
{if(link.hasClass("busy"))return false;link.addClass("busy");$.ajax({url:url,type:method,dataType:"json",data:link.serialize(),context:link,success:function(res){link.removeClass("busy");ajax_result(res);},error:function(xhr,status,error){link.removeClass("busy");ajax_error(xhr,status,error);}});return false;}
else if(link.hasClass("context"))
{if(link.hasClass("busy"))return false;link.addClass("busy");var context=link.parent().closest(".context");context.addClass("loading").removeClass("error");$.ajax({url:url,dataType:"html",context:context,success:function(html){this.removeClass("loading");this.html(html);if(window.FB)FB.XFBML.parse(this.get(0));update_scroll(context);},error:function(xhr,status,error){link.removeClass("busy");this.removeClass("loading");ajax_error(xhr,status,error);}})
return false;}
else if(link.hasClass("popup"))
{lightbox_init();$.ajax({url:url,dataType:"html",context:link,success:function(html){var popup_button=this;lightbox_show(html,$(this).attr("data-popup-width")).one("hide",function(){popup_button.trigger("popup_closed");});},error:function(xhr,status,error){lightbox_hide();ajax_error(xhr,status,error);}});return false;}
return true;});$("form.ajax").live("submit",function(){var form=$(this);var url=form.attr("action");var method=form.attr("method");var button=form.find("button[type=submit],input[type=submit]");if((form.hasClass("destructive"))&&(!confirm("Are you sure?")))return false;form.find(".hint").each(function(){$(this).val("").removeClass("hint");});if(form.triggerHandler("ajax_submit")===false)return false;if(form.hasClass("action"))
{if(button.hasClass("busy"))return false;button.addClass("busy");$.ajax({url:url,type:method,dataType:"json",data:form.serialize(),context:form,success:function(res){button.removeClass("busy");if(ajax_result(res))
{form.triggerHandler("ajax_submit_ok");}},error:function(xhr,status,error){button.removeClass("busy");ajax_error(xhr,status,error);}});return false;}
else if(form.hasClass("context"))
{if(button.hasClass("busy"))return false;button.addClass("busy");var context=form.parent().closest(".context");var data=form.serialize();context.addClass("loading").removeClass("error");$.ajax({url:url,dataType:"html",data:data,type:(method)?method:((data)?"POST":"GET"),context:context,success:function(html){this.removeClass("loading");this.html(html);if(window.FB)FB.XFBML.parse(this.get(0));update_scroll(context);},error:function(xhr,status,error){if(button)button.removeClass("busy");this.removeClass("loading");ajax_error(xhr,status,error);}})
return false;}
return true;});
/* ajax_scroller */
var main_ajax_scroller;$(document).ready(function(){update_ajax_scrollers();$(".ajax_scroller").each(function(){if($(this).find(".scroll").length==0)
{main_ajax_scroller=$(this);}});if(main_ajax_scroller)
{$(window).scroll(on_ajax_scroll);}});function update_ajax_scrollers(context)
{var scrollers;if(context)
{scrollers=context.find(".ajax_scroller .scroll");}
else
{scrollers=$(".ajax_scroller .scroll");}
scrollers.scroll(on_ajax_scroll);}
function on_ajax_scroll()
{var ajax_scroller,scroll_up,scroll_down,scroll_div;var y,h;var url,page;var area;var dest;var custom_page=false;area=$(this);ajax_scroller=area.closest(".ajax_scroller");if(this.fleXdata!=undefined)
{y=this.fleXdata.scrollPosition[1][0];h=this.fleXdata.scrollPosition[1][1];}
else if(this.scrollHeight)
{y=area.scrollTop();h=this.scrollHeight-this.clientHeight;}
else
{ajax_scroller=main_ajax_scroller;var offset=ajax_scroller.offset();y=area.scrollTop()-offset.top-ajax_scroller.find(".scroll_previous_content").outerHeight();h=ajax_scroller.outerHeight()-area.height()-ajax_scroller.find(".scroll_previous_content").outerHeight()-ajax_scroller.find(".scroll_next_content").outerHeight();}
if((ajax_scroller.attr("last_scroll_y")!=undefined)&&(ajax_scroller.attr("last_scroll_y")==y))return;ajax_scroller.attr("last_scroll_y",y);scroll_up=ajax_scroller.find(".scroll_up");scroll_down=ajax_scroller.find(".scroll_down");if(scroll_up.filter(":visible").length>0)
{if(y<=0)
{scroll_up.stop().fadeOut(500);}}
else
{if(y>0)
{scroll_up.stop().fadeTo(500,1.0);}}
if(scroll_down.filter(":visible").length>0)
{if(y>=h)
{scroll_down.stop().fadeOut(500);}}
else
{if(y<h)
{scroll_down.stop().fadeTo(500,1.0);}}
if((y<h)&&(y>0))return;if(ajax_scroller.hasClass("busy"))return;url=ajax_scroller.attr("data-url");if(y>=h)
{dest=ajax_scroller.find(".scroll_next_content");if(dest.length==0)return;page=dest.attr('data-page');if(page)
{page=dest.attr("data-page");custom_page=true;}
else
{page=parseInt(ajax_scroller.attr("data-page"))+1;}
url=url.replace("%d",page);scroll_div=scroll_down;}
else
{dest=ajax_scroller.find(".scroll_previous_content");if(dest.length==0)return;page=dest.attr('data-page');if(page)
{page=dest.attr("data-page");custom_page=true;}
else
{page=parseInt(ajax_scroller.attr("data-page"))-1;}
url=url.replace("%d",page);scroll_div=scroll_up;}
ajax_scroller.trigger("page_loading",[dest]);ajax_scroller.addClass("busy");$.ajax({url:url,dataType:"html",context:dest,success:function(res){var scroll=ajax_scroller.find(".scroll").get(0);if(ajax_result(res))
{var next=this.next();var prev_height=(next.length>0)?(next.offset().top-this.offset().top):0;if(custom_page)
{this.html(res).removeClass("scroll_previous_content scroll_next_content");}
else
{this.before(res);}
if(y<0)
{if(area.get(0)==window)area=$("html,body");area.scrollTop(area.scrollTop()-prev_height+this.next().offset().top-this.offset().top);}
if((scroll!=undefined)&&(scroll.fleXcroll!=undefined))
{scroll.fleXcroll.updateScrollBars();}
scroll_div.stop().fadeTo(500,1.0);ajax_scroller.attr("data-page",page).removeClass("busy");ajax_scroller.trigger("page_loaded",[this]);}
else
{this.remove();if((scroll!=undefined)&&(scroll.fleXcroll!=undefined))
{scroll.fleXcroll.updateScrollBars();}
ajax_scroller.attr("data-page",page).removeClass("busy");}}});}
/* comments */
$(document).ready(function(){comments_init();});function comments_init()
{$(".comments_box_container").each(function(){var comments_box=$(this);var comments=comments_box.find('.comments_container');var refresh=parseInt(comments_box.attr('data-refresh'))*1000;comments_box.bind("change_object",function(e,object,url){var comments_box=$(this);var form=comments_box.find("form");form.attr("action",form.attr("data-action-base")+object);comments_box.attr("data-object",object);comments_refresh(comments_box);if(url)
{social_refresh(comments_box,url);}});update_scroll(comments);comments_box.comments_timer=setTimeout(function(){comments_refresh(comments_box)},refresh);});}
function social_refresh(comments_box,url)
{var social_div=comments_box.find(".comments_social");if(social_div.length==0)return;var facebook_like_div=social_div.find(".facebook_like");if(facebook_like_div.length!=0)
{facebook_like_div.empty().append('<div class="fb-like" data-href="'+url+'" data-send="false" data-layout="button_count" data-show-faces="false"></div>');FB.XFBML.parse(facebook_like_div.get(0));}
var twitter_share_div=social_div.find(".twitter_share");if(twitter_share_div!=0)
{twitter_share_div.empty().append('<a href="http://twitter.com/share" class="twitter-share-button" data-url="'+url+'"  data-count="horizontal" data-via="'+twitter_account+'">Tweet</a>');twttr.widgets.load();}
var google_plus_div=social_div.find(".google_plus");if(google_plus_div!=0)
{var g_plusone=$('<div class="g-plusone"></div>');google_plus_div.empty().append(g_plusone);gapi.plusone.render(g_plusone.get(0),{href:url,size:"medium"});}}
function comments_refresh(comments_box)
{var comments=comments_box.find('.comments_container');var refresh=parseInt(comments_box.attr('data-refresh'))*1000;var refresh_url=comments_box.attr('data-refresh-url')+comments_box.attr('data-object');if(comments_box.comments_timer)clearTimeout(comments_box.comments_timer);ajax_refresh_content(comments,refresh_url,function(){comments_box.comments_timer=setTimeout(function(){comments_refresh(comments_box);},refresh);update_scroll(comments);});}
/* context_menu */
function init_context_menus(selector)
{var menus;if(selector)menus=$(selector).find(".context_menu");else menus=$(".context_menu");menus.each(function(){var menu=$(this).hide();var dropdown=menu.attr("data-dropdown");menu.find("a").attr("tabindex",0).filter(".action").attr("role","button");if(dropdown)
{if(dropdown[0]!=".")dropdown="#"+dropdown;$(dropdown).attr("tabindex",0).attr("role","button");$(document).on("click",dropdown,function(e){var dropdown=$(this);if(dropdown.hasClass("disabled"))return false;var o=dropdown[0].getBoundingClientRect();var menu_height=menu.outerHeight();var window_height=$(window).height();var window_width=$(window).width();var left=o.left;var top=o.top;if(top+o.height+menu_height>window_height)
{if(top-menu_height<0)
{top=Math.round((window_height-menu_height)/2);}
else
{top-=menu_height;}}
else
{top+=o.height;}
menu.css('minWidth',o.width);show_context_menu(menu,dropdown,left,top);var right_align=(left+menu.outerWidth()>window_width)||(dropdown.css("float")=="right")||(dropdown.parent().css("float")=="right")||(dropdown.parent().parent().css("float")=="right");if(right_align)
{menu.addClass("right");menu.css({'left':"auto",'right':(window_width-left-o.width)+"px"});}
dropdown.addClass("active");menu.bind("hide",function(){dropdown.removeClass("active");});return false;}).on("keydown",dropdown,function(e){switch(e.keyCode)
{case 27:this.blur();break;case 13:case 32:$(this).trigger("click");return false;}
return true;});}
else
{$(this).parent().bind("contextmenu",function(e){return!show_context_menu(menu,$(e.target),e.pageX,e.pageY);});}});}
function show_context_menu(menu,target,x,y)
{var context_class=menu.attr("data-context-class");var context_data=menu.attr("data-context-data");var target_data="";hide_context_menu(null,true);if(context_class)
{if((!target.hasClass(context_class))&&(!target.parent().hasClass(context_class)))return false;}
if(context_data)
{target_data=target.attr("data-"+context_data);if(!target_data)target_data=target.parent().attr("data-"+context_data);}
if(target_data)
{menu.find("a").each(function(){var a=$(this);var href;href=a.attr("data-href");if(!href)
{href=a.attr("href");a.attr("data-href",href);}
a.attr("href",href.replace("%data",target_data));});}
menu.trigger("show",[target,x,y]);if(menu.find("li:not(.hidden)").length==0)return false;$('<div class="context_menu_overlay"></div>').click(function(){hide_context_menu();}).bind('contextmenu',function(){return false;}).css({'height':"100%",'left':0,'position':"fixed",'top':0,'width':"100%",'zIndex':9998}).appendTo(document.body);menu.css({'left':x,'right':"auto",'top':y,'position':"fixed",'zIndex':9999}).removeClass("right").appendTo(document.body).show();menu.find("a").click(function(){var context_menu=$(this).closest(".context_menu");if($(this).hasClass("action"))
{$(this).one("done",function(){hide_context_menu(context_menu);});}
else
{hide_context_menu(context_menu);}});menu.find("input:first").focus();return true;}
function hide_context_menu(context_menu,immediate)
{var overlay=$(".context_menu_overlay");if(overlay.length==0)return;if(!context_menu)context_menu=$(".context_menu");if(immediate)
{context_menu.hide().trigger("hide");overlay.remove();}
else
{context_menu.fadeOut(100,function(){overlay.remove();$(this).trigger("hide");});}}
/* cookies */
function get_cookie(name)
{var cookies,key,val;cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++)
{key=cookies[i].substr(0,cookies[i].indexOf("="));val=cookies[i].substr(cookies[i].indexOf("=")+1);key=key.replace(/^\s+|\s+$/g,"");if(key==name)return decodeURIComponent(val);}
return null;}
function set_cookie(name,value,expire_seconds)
{value=encodeURIComponent(value);if(expire_seconds)
{var date=new Date();date.setTime(date.getTime()+expire_seconds*1000);value+="; expires="+date.toUTCString();}
value+="; path=/";document.cookie=name+"="+value;}
/* dragndrop */
$(function()
{$.event.props.push("dataTransfer");if(!can_drag_drop())return;$(".drag-container").addClass("active").live("drop",function(e){$(this).removeClass("dragover");var files=e.dataTransfer.files||e.target.files;on_drop($(this),files);return false;}).live("dragover",function(e){var files=e.dataTransfer.items||e.dataTransfer.files;var drag_type=$(this).attr("data-drag-type");if(!drag_type)drag_type=".*";var type_regex=new RegExp(drag_type);if((files)&&(files.length>0))
{if((files.length==1)&&(files[0].type.match(type_regex)))
{e.dataTransfer.dropEffect="copy";$(this).addClass("dragover");}
else
{e.dataTransfer.dropEffect="none";}}
else
{e.dataTransfer.dropEffect="copy";$(this).addClass("dragover");}
return false;}).live("dragleave",function(e){$(this).removeClass("dragover");}).live("click",function(){var drag_id=$(this).attr("data-drag-id");var drag_input=$(".drag-input[data-drag-id="+drag_id+"]");if(drag_input.length==1)
{drag_input.trigger("click");return false;}
return true;});$(".drag-input").live("change",function(e){var drag_id=$(this).attr("data-drag-id");on_drop($(".drag-container[data-drag-id="+drag_id+"]"),e.target.files);});});function on_drop(container,files)
{var drag_id=container.attr("data-drag-id");var drag_type=container.attr("data-drag-type");var drag_url=container.attr("data-drag-url");if(!drag_type)drag_type=".*";var type_regex=new RegExp(drag_type);if(files.length!=1)
{alert(container.attr("data-drag-select-message"));return;}
if(!files[0].type.match(type_regex))
{alert(container.attr("data-drag-type-message"));return;}
on_drag_load(container,true);var fileReader=new FileReader();fileReader.onload=function(e){var data={};data[drag_id]=e.target.result;if(drag_url)
{$.ajax({url:drag_url,type:"POST",data:data,dataType:"json",success:function(res){container.find("img.drag-content").attr("src",e.target.result);on_drag_load(container,false);if(ajax_result(res))
{container.trigger("dropped_ajax",[res]);}},error:function(xhr,status,error){on_drag_load(container,false);ajax_error(xhr,status,error);}});}
else
{container.find("img.drag-content").attr("src",e.target.result);on_drag_load(container,false);var input_data=$("input[type=hidden][data-drag-id="+drag_id+"]");if(input_data.length)
{input_data.val(e.target.result);}
container.trigger("dropped",[e.target.result]);}};fileReader.onerror=function(e){on_drag_load(container,false);};fileReader.readAsDataURL(files[0]);}
function on_drag_load(container,load)
{if(load)
{container.addClass("busy");container.find(".drag-message").hide();container.find(".drag-content").fadeTo(200,0.25);container.find(".drag-loader").show();}
else
{container.removeClass("busy");container.find(".drag-loader").hide();container.find(".drag-message").show();container.find(".drag-content").fadeTo(200,1.00);}}
function can_drag_drop()
{if(navigator.userAgent.match(/(ip(hone|ad|od))|android|windows phone/i))return false;var container=$(".drag-container").get(0);return(container&&window.File&&window.FileReader&&("draggable"in container));}
function update_html_dragdrop(context)
{var containers;if(!can_drag_drop())return;if((!context)||(!context.length))containers=$(".drag-container:not(.active)");else containers=context.find(".drag-container:not(.active)");containers.addClass("active");}
/* htmlentities */
function htmlentities(string)
{if(typeof(string)!='string')return"";string=string.split("<").join("&lt;");string=string.split(">").join("&gt;");string=string.split("&").join("&amp;");string=string.split("\"").join("&quot;");string=string.split("'").join("&#39;");return string;}
/* jquery.autosize */
;(function($){$.fn.autosize=function(options,callback){var defaults={minFontSize:12,maxFontSize:24,innerTag:"span"};var opts=jQuery.extend(defaults,options);return this.each(function(){var fontSize=opts.maxFontSize;var minFontSize=opts.minFontSize;var ourText=$(opts.innerTag+":visible:first",this);var maxHeight=$(this).height();var maxWidth=$(this).width();var textHeight,textWidth;do{ourText.css('font-size',fontSize+"px");textHeight=ourText.height();textWidth=ourText.width();fontSize--;}while((textHeight>maxHeight||textWidth>maxWidth)&&fontSize>minFontSize);if(callback)
{fontSize++;callback($(this),ourText,{fontSize:fontSize,textHeight:textHeight,textWidth:textWidth,maxHeight:maxHeight,maxWidth:maxWidth});}
$(this).removeClass("autosize");});};})(jQuery);
/* lightbox */
var lightbox_timer;$(".lightbox_close").live("click",function(){lightbox_hide();return false;});function lightbox_init()
{lightbox_mask().appendTo($("body").addClass("masked")).fadeIn(200);}
function lightbox_mask()
{var mask=$(".lightbox_mask");if(!mask.length)
{mask=$("<div></div>");mask.css({'height':'1000%','left':0,'position':'fixed','top':0,'width':'1000%','zIndex':10000}).attr("tabindex",-1).addClass("lightbox_mask loading").hide();}
return mask;}
function lightbox_show(content,width)
{var body=$("body");var mask=lightbox_mask();var lightbox;if(typeof content=="string")
{lightbox=$("<div></div>").html(content);}
else
{if(content.prop("tagName")=="IFRAME")
{content.on((window.on_iframe_loaded)?"iframe_loaded":"ready",function(){lightbox_show(lightbox,width);});lightbox=$("<div></div>").addClass("lightbox has_iframe").css({'left':0,'position':"fixed",'top':"-10000px",'zIndex':11000}).append(content).appendTo(body);lightbox_init();return lightbox;}
else
{lightbox=content;if((!lightbox.hasClass("has_iframe"))&&($.contains(document.body,lightbox.get(0))))
{lightbox.addClass("fromdom");}}
if(!width)width=content.width();}
if(!width)width=Math.round($(window).width()*0.62);else if(/^\d+$/.test(width))width+="px";lightbox.css({'maxHeight':"90%",'overflow':"auto",'position':"fixed",'width':width,'zIndex':11000}).addClass("lightbox");$("<div class=\"lightbox_keytrap\" tabindex=\"0\"></div>").appendTo(body);if(!lightbox.hasClass("has_iframe"))
{lightbox.appendTo(body).css('opacity',0);}
$("<div class=\"lightbox_keytrap\" tabindex=\"0\"></div>").appendTo(body);$(".lightbox_keytrap").focus(function(){mask.focus();});mask.removeClass("loading").appendTo(body).fadeIn(200,function(){setTimeout(function(){lightbox_resize(lightbox);lightbox.css('opacity',1).addClass("visible").show();lightbox.find(".lightbox_close.focus").focus();lightbox_timer=setInterval(function(){lightbox_resize(lightbox,true);},1000);},0);});lightbox_resize(lightbox);body.bind("keydown",lightbox_keydown);mask.click(lightbox_hide).focus();return lightbox;}
function lightbox_hide()
{var lightbox=$(".lightbox");var warn=lightbox.attr("data-warn");if(warn)
{if(!confirm(warn))return;}
if(lightbox_timer)
{window.clearInterval(lightbox_timer);lightbox_timer=null;}
$("body").removeClass("masked").unbind("keydown",lightbox_keydown);var param={visible:true};lightbox.trigger("hide",[param]);if(param.visible)
{if(lightbox.hasClass("fromdom"))
{lightbox.hide().removeClass("lightbox");}
else
{lightbox.remove();}}
$(".lightbox_mask").fadeOut(200,function(){$(this).remove();});$(".lightbox_keytrap").remove();}
function lightbox_resize(lightbox,animate)
{var height=lightbox.height();var css={};if(lightbox.hasClass("has_iframe"))
{var iframe=lightbox.find("iframe").get(0);if((iframe)&&(iframe.contentWindow)&&(iframe.contentWindow.document.body))
{var iframe_height=iframe.contentWindow.document.body.offsetHeight;if((iframe_height>0)&&(iframe_height!=height))
{$(iframe).attr("height",iframe_height);height=iframe_height;css.height=iframe_height+"px";}}}
css.left=Math.round(($(window).width()-lightbox.width())/2)+"px";css.top=Math.round(($(window).height()-height)*0.38)+"px";if(animate)
{lightbox.stop(true,false).animate(css);}
else
{lightbox.css(css);}}
function lightbox_keydown(e)
{if(e.keyCode==27)
{lightbox_hide();}}
function lightbox_warn(message)
{$(".lightbox").attr("data-warn",message);}
$(window).resize(function(){$(".lightbox").each(function(){lightbox_resize($(this),true);});});
/* lightgallery */
var pictures;var picture_id;var img;var caption;var lb_close;var panel_left;var panel_right;$(document).ready(function(){init_gallery();});function init_gallery(){$(".thumbnail.gallery").css({cursor:"pointer"}).each(function(){var pictures=$(this).attr("data-pictures");if(!pictures)return;pictures=eval(pictures);var l=pictures.length;for(var i=0;i<l;i++)
{var img=$("<img />").attr("src",pictures[i].picture);}}).click(function(e){var mask=$("<div></div>");lb_close=$("<img />");lb_close.attr("src",lb_close_url).css({'cursor':"pointer",'display':"none",'left':0,'position':"fixed",'zIndex':12000}).addClass("lb_close");var rel=$(this).attr("data-rel");if(rel)
{pictures=$("#"+rel).data("pictures");}
else
{pictures=$(this).data("pictures");}
picture_id=parseInt($(this).attr("data-picture-id"));if(!picture_id)picture_id=0;img=$("<img class='lb_image' />");mask.css({'display':"none",'height':"1000%",'left':0,'position':"fixed",'top':0,'width':"1000%",'zIndex':10000}).addClass("lb_mask");img.css({'display':"none",'left':0,'position':"fixed",'top':0,'zIndex':11000});mask.appendTo(document.body).click(close_gallery).fadeTo(200,0.75);var gallery_container=$("<div id='gallery_container'></div>");gallery_container.css({'position':"fixed",'zIndex':10500}).appendTo(document.body);panel_left=$("<div></div>");panel_right=$("<div></div>");panel_left.css({'cursor':"pointer",'position':'fixed','zIndex':12000,'margin-left':10}).addClass("lb_left").appendTo(gallery_container);panel_right.css({'cursor':"pointer",'position':'fixed','zIndex':12000}).addClass("lb_right").appendTo(gallery_container);var arrow_left=$("<div></div>");var arrow_right=$("<div></div>");arrow_left.css({'display':"none",'height':"100%",'width':"100%"}).addClass("lb_arrow").appendTo(panel_left);arrow_right.css({'display':"none",'height':"100%",'width':"100%"}).addClass("lb_arrow").appendTo(panel_right);panel_left.mouseenter(function(){$(this).find(".lb_arrow").stop(true,false).fadeTo(200,1.0);}).mouseleave(function(){$(this).find(".lb_arrow").stop(true,false).fadeTo(200,0.0);});panel_right.mouseenter(function(){$(this).find(".lb_arrow").stop(true,false).fadeTo(200,1.0);}).mouseleave(function(){$(this).find(".lb_arrow").stop(true,false).fadeTo(200,0.0);});panel_left.click(function(){swap_picture(-1);});panel_right.click(function(){swap_picture(1);});img.attr("src",pictures[picture_id].picture).attr("title",pictures[picture_id].name).load(function(){img.appendTo(gallery_container);place_picture(img,false);lb_close.appendTo(gallery_container).click(close_gallery).fadeIn(200);img.fadeIn(200,function(){if(pictures[picture_id].caption)
{caption=$("<div></div>").addClass("lb_caption").css({'display':"none",'position':"fixed",'left':img.css("left"),'top':parseInt(img.css("top"))+img.height()+"px",'width':img.width(),'zIndex':12000}).html(pictures[picture_id].caption).appendTo(gallery_container).fadeIn(200);}});});return false;});}
function close_gallery()
{$("#gallery_container").fadeOut(200,function(){$(this).remove();lb_close=null;img=null;});$(".lb_mask").fadeOut(200,function(){$(this).remove();});}
function place_picture(img,animate)
{var wx=$(window).width();var x=Math.round((wx-img.width())/2);var y=Math.round(($(window).height()-img.height())*0.38);if(animate)
{img.animate({'left':x+"px",'top':y+"px"});lb_close.animate({'left':Math.min(wx-lb_close.width(),(x+img.width()))+"px",'top':Math.max(y,0)+"px"});panel_left.animate({'left':x+"px",'top':y+"px",'width':(img.width()/2)+"px",'height':img.height()+"px"});panel_right.animate({'left':(x+img.width()/2)+"px",'top':y+"px",'width':(img.width()/2)+"px",'height':img.height()+"px"});}
else
{img.css({'left':x+'px','top':y+'px'});lb_close.css({'left':Math.min(wx-lb_close.width(),(x+img.width()))+"px",'top':Math.max(y,0)+"px"});panel_left.css({'left':x+"px",'top':y+"px",'width':(img.width()/2)+"px",'height':img.height()+"px"});panel_right.css({'left':(x+img.width()/2)+"px",'top':y+"px",'width':(img.width()/2)+"px",'height':img.height()+"px"});}}
function swap_picture(step)
{picture_id+=step;if(picture_id>=pictures.length)picture_id=0;else if(picture_id<0)picture_id=pictures.length-1;var img2=$("<img class='lb_image' />");img.css("cursor","wait");img2.css({'display':"none",'left':img.css("left"),'position':"fixed",'top':img.css("top"),'zIndex':11000});img2.attr("src",pictures[picture_id].picture).attr("title",pictures[picture_id].name).load(function(){img2.appendTo($("#gallery_container"));if(caption)caption.fadeOut(200);$(".lb_left").fadeOut(200);$(".lb_right").fadeOut(200);place_picture(img2,true);img.fadeOut(200,function(){if(caption)
{caption.remove();caption=null;}
img.remove();img=img2;img.fadeIn(200,function(){if(pictures[picture_id].caption)
{caption=$("<div></div>").addClass("lb_caption").css({'display':"none",'position':"fixed",'left':img.css("left"),'top':parseInt(img.css("top"))+img.height()+"px",'width':img.width(),'zIndex':12000}).html(pictures[picture_id].caption).appendTo($("#gallery_container")).fadeIn(200);}
$(".lb_left").fadeIn(200);$(".lb_right").fadeIn(200);});})});}
/* live */
var time_offset=parseInt(get_cookie("to"));var countdown_timer;window.fcTimeSet=function(){set_time_offset((time_server>0)?(time_server-new Date().getTime()):0);};if(time_offset)set_time_offset();else time_offset=0;if((typeof timezone_offset!="undefined")&&(timezone_offset==true))
{timezone_offset=new Date().getTimezoneOffset();set_cookie("tzo",timezone_offset,30*86400);if(window.console!=undefined)console.log("Timezone offset: "+timezone_offset);}
jQuery(init_countdowns);function init_countdowns()
{(function($){$(".countdown_livedate").each(function(){var template=$(this).attr("data-livedate-template");if(template)
{$(this).html(strftime(template,$(this).attr("data-countdown-date")));}});})(jQuery);update_countdowns();start_countdown();}
function set_time_offset(to)
{if(to)
{time_offset=to;set_cookie("to",time_offset,1800);if(window.console!=undefined)
{console.log("Setting time offset: "+time_offset);}}
else if((time_offset)&&(window.console!=undefined))
{console.log("Time offset: "+time_offset);}
window.setTimeout(start_countdown,1100-(new Date().getTime()%1000));}
function start_countdown()
{if(countdown_timer)window.clearInterval(countdown_timer);countdown_timer=window.setInterval(update_countdowns,1000);}
function update_countdowns()
{(function($){$(".countdown_date").each(function(){var cd=$(this);var date=cd.attr("data-countdown-date")*1000;if((!time_offset)&&(window.time_server==undefined)&&(window.time_server_url!=undefined))
{time_server=0;var js,id='fctimeserver';if(!document.getElementById(id))
{js=document.createElement('script');js.id=id;js.async=true;js.src=time_server_url;document.getElementsByTagName('head')[0].appendChild(js);}}
if(date)
{var d=new Date();var left=Math.round((date-(d.getTime()+time_offset))/1000);if(left<0)left=0;var countdown;var remaining=left;var seconds=remaining%60;remaining=Math.floor(remaining/60);var minutes=remaining%60;remaining=Math.floor(remaining/60);var hours=remaining%24;var days=Math.floor(remaining/24);if(hours<10)hours="0"+hours;if(minutes<10)minutes="0"+minutes;if(seconds<10)seconds="0"+seconds;if((left>0)&&(cd.hasClass("live_now")))
{cd.removeClass("live_now");cd.attr("data-countdown-now",cd.html());}
if(!cd.hasClass("live_now"))
{var part_days=cd.find(".countdown_days");if(part_days.length>0)
{if(days<10)days="0"+days;part_days.text(days);cd.find(".countdown_hours").text(hours);cd.find(".countdown_minutes").text(minutes);cd.find(".countdown_seconds").text(seconds);}
else
{if(days>0)countdown=days+" days "+hours+":"+minutes+":"+seconds;else countdown=hours+":"+minutes+":"+seconds;var template;if(window.fcplayerCountdownTemplate)
{template=fcplayerCountdownTemplate(left,parseInt(days),parseInt(hours),parseInt(minutes),parseInt(seconds));}
if(!template)
{template=cd.attr("data-countdown-template");}
if(template)
{if(template.indexOf("%minutes")>=0)
{if(!days)template=template.replace(/^.*%hours/,"%hours");countdown=template.replace("%days",days).replace("%hours",hours).replace("%minutes",minutes).replace("%seconds",seconds);}
else if(template.indexOf("%MM")>=0)
{if(days<10)days="0"+days;countdown=template.replace("%DD",days).replace("%HH",hours).replace("%MM",minutes).replace("%SS",seconds);}
else
{countdown=template.replace("%s",countdown);}}
cd.html(countdown);}}
if(left>0)
{cd.removeClass("live_now").trigger("countdowntick",[left,new Date(date),days,hours,minutes,seconds]);}
else if(!cd.hasClass("live_now"))
{var countdown_now=cd.attr("data-countdown-now");if(countdown_now!="on")
{if(countdown_now)cd.html(countdown_now);cd.addClass("live_now").attr("data-countdown-now","on").trigger("livenow");}}}});})(jQuery);}
/* player */
if(typeof window.onPlayerReady=="undefined")
{window._fcpr=window._fcpr||[];var fcpr_playerready=(typeof playerReady=='function')?playerReady:undefined;var fcpr_instances=[];try
{Object.defineProperty(_fcpr,"push",{configurable:false,enumerable:false,writable:false,value:function(){for(var i=0,n=this.length,l=arguments.length;i<l;i++,n++)
{var callback=arguments[i];this[n]=callback;for(var j=0;j<fcpr_instances.length;j++)
{try
{callback(fcpr_instances[j]);}
catch(e){}}}
return n;}});}
catch(e)
{var _l=_fcpr.length;setInterval(function(){for(;_l<_fcpr.length;_l++)
{var callback=_fcpr[_l];for(var j=0;j<fcpr_instances.length;j++)
{try
{callback(fcpr_instances[j]);}
catch(e){}}}},100);}
window.playerReady=function(obj,no_add)
{if(fcpr_playerready)fcpr_playerready.call(this,obj);if(!no_add)addPlayer(fcplayer(obj.id));};window.onPlayerReady=function(callback)
{_fcpr.push(callback);};window.addPlayer=function(player)
{fcpr_instances.push(player);for(var i=0;i<_fcpr.length;i++)
{try
{_fcpr[i].call(this,player);}
catch(e)
{if(window.console)console.log('FCPlayer PlayerReady callback exception',e);}}};}
/* player_utils */
$(".player_play").live("click",function(){var id=$(this).attr("data-player-id");if(id)
{fcplayer().load(id);return false;}});
/* script_loader */
if(FCJSLoader===undefined){var FCJSLoader=function(){};function is_defined(p)
{if(eval("typeof "+p)=="undefined")return false;if(p.indexOf(".")>0)return true;return typeof window[p].tagName!="string";}
(function(FCJSLoader,w,d){var _jsi=0;var _jsd=0;var _jsl=[];var _jsc=[];var _jsp=[];var _js=[];FCJSLoader.load=function(src,callback,provides){var i,j,scripts;if(typeof src=="string")src=[src];if(!provides)provides="";_jsl[_jsi]=[];_jsc[_jsi]=callback;_jsp[_jsi]=[provides];for(i=0;i<src.length;i++)
{var s=src[i];var p=s.split("#");s=p[0];if(p.length>2)
{var b=false;if(p[2].charAt(0)=='!')
{p[2]=p[2].substr(1);b=true;}
var r=new RegExp(p[2]);if(r.test(navigator.userAgent)==b)
{continue;}}
if(!_jsp[_jsi][i])_jsp[_jsi][i]=(p.length>1)?p[1]:"";var ok=true;for(j=0;j<_js.length;j++)
{if(_js[j]==s)
{ok=false;break;}}
if(ok)
{var full_src=s;if(full_src.indexOf("://")<0)
{if(full_src.indexOf("//")===0)
{full_src=location.protocol+full_src;}
else if(full_src[0]=="/")
{full_src=location.protocol+"//"+location.host+full_src;}}
if(scripts===undefined)scripts=d.getElementsByTagName("script");for(j=0;j<scripts.length;j++)
{if(scripts[j].src==full_src)
{ok=false;break;}}}
if(ok)
{_jsl[_jsi][i]=s;_js.push(s);}
else
{_jsl[_jsi][i]="";}}
if(_jsi==_jsd)
{_loadJS(_jsi++);}
else
{_jsi++;}};function _loadJS(i)
{if(_jsl[i].length==0)
{var callback=_jsc[i];_jsc[i]=undefined;if(callback)
{callback();}
if(i==_jsd)
{_jsd++;if(_jsl.length>i+1)
{_loadJS(_jsd)}}
return;}
var src=_jsl[i].shift();var p=_jsp[i].shift();if((p)&&(is_defined(p)))
{_loadJS(i);return;}
if(!src)
{var n=0;var t=setInterval(function(){if((!p)||(is_defined(p))||(++n>200))
{clearInterval(t);_loadJS(i);}},50);return;}
var s=d.createElement("script");s.type="text/javascript";s.onload=s.onreadystatechange=function(){if((s.readyState)&&(!/loaded|complete/.test(s.readyState)))return;s.onload=s.onreadystatechange=null;var n=0;var t=setInterval(function(){if((!p)||(is_defined(p))||(++n>200))
{clearInterval(t);_loadJS(i);}},50);};d.getElementsByTagName('head')[0].appendChild(s);s.src=src;}})(FCJSLoader,window,document);}
/* strftime */
var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var days_short=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];var months=['January','February','March','April','May','June','July','August','September','October','November','December'];var months_short=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];function strftime(format,timestamp)
{var date=new Date(timestamp*1000);var parts=format.split('%');var l=parts.length;var result=parts[0];var i,x,y;for(i=1;i<parts.length;i++)
{var part=parts[i];var option=part.charAt(0);part=part.substr(1);switch(option)
{case'a':result+=days_short[date.getDay()];break;case'A':result+=days[date.getDay()];break;case'd':x=date.getDate();if(x<10)result+='0';result+=x;break;case'e':x=date.getDate();if(x<10)result+=' ';result+=x;break;case'u':x=date.getDay();if(x==0)x=7;result+=x;break;case'w':result+=date.getDay();break;case'b':case'h':result+=months_short[date.getMonth()];break;case'B':result+=months[date.getMonth()];break;case'm':x=date.getMonth()+1;if(x<10)result+='0';result+=x;break;case'C':result+=Math.floor(date.getFullYear()/100);break;case'y':x=date.getFullYear()%100;if(x<10)result+='0';result+=x;break;case'Y':result+=date.getFullYear();break;case'H':x=date.getHours();if(x<10)result+='0';result+=x;break;case'I':x=date.getHours()%12;if(x<10)result+='0';result+=x;break;case'l':x=(date.getHours()+11)%12+1;if(x<10)result+=' ';result+=x;break;case'M':x=date.getMinutes();if(x<10)result+='0';result+=x;break;case'p':if(date.getHours()<12)result+='AM';else result+='PM';break;case'P':if(date.getHours()<12)result+='am';else result+='pm';break;case'r':y=date.getHours();x=y%12;if(x<10)result+='0';result+=x+':';x=date.getMinutes();if(x<10)result+='0';result+=x+':';x=date.getSeconds();if(x<10)result+='0';result+=x+' ';if(y<12)result+='AM';else result+='PM';break;case'R':x=date.getHours();if(x<10)result+='0';result+=x+':';x=date.getMinutes();if(x<10)result+='0';result+=x;break;case'S':x=date.getSeconds();if(x<10)result+='0';result+=x;break;case'T':x=date.getHours();if(x<10)result+='0';result+=x+':';x=date.getMinutes();if(x<10)result+='0';result+=x+':';x=date.getSeconds();if(x<10)result+='0';result+=x;break;case'X':result+=date.toLocaleTimeString();break;case'z':x=date.getTimezoneOffset();if(x<0)
{x=-x;result+='-';}
else
{result+='+';}
y=Math.floor(x/60);if(y<10)result+='0';result+=y;x=x%60;if(x<10)result+='0';result+=x;break;case'Z':x=date.toString();result+=x.replace(/^.*\((.*?)\)$/,'$1');break;case'c':result+=date.toLocaleString();break;case'D':x=date.getMonth()+1;if(x<10)result+='0';result+=x+'/';x=date.getDate();if(x<10)result+='0';result+=x+'/';x=date.getFullYear()%100;if(x<10)result+='0';result+=x;break;case'F':x=date.getFullYear()%100;if(x<10)result+='0';result+=x+'-';x=date.getMonth()+1;if(x<10)result+='0';result+=x+'-';x=date.getDate();if(x<10)result+='0';result+=x;break;case's':result+=Math.floor(date.getTime()/1000);break;case'x':result+=date.toLocaleDateString();break;}
result+=part;}
return result;}
/* ui */
$(document).ready(function(){$("li.tab a").live("click",function(){var tab_context=$(this).closest(".tab_context");if(tab_context.hasClass("busy"))return false;var tab=$(this);var tab_id=tab.closest(".tab").attr("data-tab-id");var content=tab_context.find(".tab_content[data-tab-id="+tab_id+"]");if(content.length==0)
{content=$("<div class=\"tab_content\" data-tab-id=\""+tab_id+"\" />");content.appendTo(tab_context.find(".tab_content").parent());}
else
{tab_context.find(".tab_content").hide();content.show();update_scroll(content);tab.closest("li.tab").addClass("active").siblings("li.tab.active").removeClass("active");return false;}
load_tab(tab_context,content,this.href,function(){tab_context.find(".tab_content").hide();content.show();tab.closest("li.tab").addClass("active").siblings("li.tab.active").removeClass("active");});return false;});$("li.side_tab a").live("click",function(){var tab_context=$(this).closest(".tab_context");if(tab_context.hasClass("busy"))return false;var tab=$(this);var tab_id=tab.closest(".side_tab").attr("data-tab-id");var content;if(tab_id)
{content=tab_context.find(".tab_content[data-tab-id="+tab_id+"]");if(content.length==0)
{content=$("<div class=\"tab_content\" data-tab-id=\""+tab_id+"\" />");content.appendTo(tab_context.find(".tab_content").parent());}
else
{tab_context.find(".tab_content").hide();content.show();update_scroll(content);tab.closest("li.side_tab").addClass("active").siblings("li.side_tab.active").removeClass("active");return false;}}
else
{content=tab.closest(".tab_content");}
load_tab(tab_context,content,this.href,function(){tab.closest("li.side_tab").addClass("active").siblings("li.side_tab.active").removeClass("active");});return false;});$(".tab_content .pagination a").live("click",function(){var tab_context=$(this).closest(".tab_context");if(tab_context.hasClass("busy"))return false;var content=$(this).closest(".tab_content");load_tab(tab_context,content,this.href);return false;});$(".tab_context").each(function(){var tab=$(this);var pages=tab.find(".tab_content.fixed");if(pages.length>0)
{var height=0;pages.each(function(){var page=$(this);if(page.is(":visible"))
{if(page.outerHeight()>height)height=page.outerHeight();}
else
{page.css({'position':"absolute",'visibility':"hidden",'display':"block",'width':tab.width()+"px"});if(page.outerHeight()>height)height=page.outerHeight();page.css({'position':"static",'visibility':"visible",'display':"none",'width':"auto"});}});pages.each(function(){$(this).height(height);});}});$("input[type=text].hint-title").each(function(){var field=$(this);var title=field.attr("title");if(title)
{if(!field.val())field.val(title);field.addClass("hint").focus(function(){if(field.hasClass("hint"))
{field.removeClass("hint");field.val("");}}).blur(function(){if(!field.val())
{field.val(title);field.addClass("hint");}});}});$("input.auto_select,textarea.auto_select").live("mouseup",function(){$(this).select();});update_scroll();});function load_tab(tab_context,content,url,callback)
{tab_context.addClass("busy");if(url.indexOf("?")==-1)
{url+="?ajax=1";}
else
{url+="&ajax=1";}
$.ajax({url:url,dataType:"html",context:content,success:function(html){this.get(0).innerHTML=html;tab_context.removeClass("busy");if(callback)callback();if(typeof ga_ajax_tracking=="function")
{ga_ajax_tracking(url);}},error:function(xhr,status,error){tab_context.removeClass("busy");ajax_error(xhr,status,error);}});}
function update_scroll(context)
{if(window.fleXenv==undefined)return;if(navigator.userAgent.match(/(ip(hone|ad|od))|android|windows phone/i))return;if(context)
{if(context.hasClass('scroll'))
{context.each(function(){fleXenv.fleXcrollMain(this);});return;}
context=context.find(".scroll");}
else
{context=$(".scroll");}
context.each(function(){fleXenv.fleXcrollMain(this);this.onfleXcroll=on_flexcroll;});context.filter(".auto_hide").unbind(".scroll").bind("mouseenter.scroll",scroll_in).bind("mouseleave.scroll",scroll_out).bind("scroll.scroll",scroll_in).find(".scrollwrapper").fadeTo(0,0.25);}
function on_flexcroll()
{$(this).scroll();}
function scroll_in()
{var scrollwrapper=$(this).find(".scrollwrapper");if(this._scroll_timer!=undefined)
{window.clearTimeout(this._scroll_timer);}
this._scroll_timer=window.setTimeout(function(){scrollwrapper.stop().fadeTo(250,0.25);},750);scrollwrapper.stop().fadeTo(100,1.0);}
function scroll_out()
{$(this).find(".scrollwrapper").stop().fadeTo(250,0.25);}
function show_element(el,speed)
{var y=window.scrollY;var h=$(window).height();var ey=el.offset().top;var eh=el.outerHeight();if(!speed)speed=500;if(ey<y)
{$("html,body").animate({scrollTop:ey},speed);}
else if(ey+eh>y+h)
{$("html,body").animate({scrollTop:ey+eh-h},speed)}}
