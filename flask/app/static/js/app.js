"use strict";angular.module("myApp",["ngRoute","myApp.view1","myApp.services"]).config(["$locationProvider","$routeProvider",function(e,t){e.hashPrefix("!"),t.otherwise({redirectTo:"/view1"})}]).constant("ApiEndpoint",{HTTP_SERVER:""}),angular.module("myApp.view1",["ngRoute"]).config(["$routeProvider",function(e){e.when("/view1",{templateUrl:"static/views/view1.html",controller:"View1Ctrl"})}]).directive("dateKeys",["chatService",function(e){return{restrict:"A",link:function(t,n){n.on("keydown",function(t){switch(t.keyCode){case 13:var n=$("#btn-input"),i=n.val();e.chat(i),n.val("")}})}}}]).controller("View1Ctrl",["$scope","chatService",function(e,t){angular.element(document).ready(function(){t.hi()}),e.message="",e.send=function(){t.chat(e.message),e.message=""},e.getPlan=function(){}}]),angular.module("myApp.services",[]).factory("chatService",["$http","ApiEndpoint",function(e,t){console.log("ApiEndpoint",t);var n=function(n){var i=$.param({question:n}),a={headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8;"}};return console.log("Says: "+n),e.post(t.HTTP_SERVER+"/chat",i,a).then(function(e){return e.data})},i=function(){var e=$(".panel-body"),t=e.find("ul");n("[hi]").then(function(n){t.append(l(n.message)),e.scrollTop(e.prop("scrollHeight"))})},a=function(e){if(""!==e){var t=$(".panel-body"),i=t.find("ul");i.append(l(e,!0)),t.scrollTop(t.prop("scrollHeight")),n(e).then(function(e){i.append(l(e.message)),t.scrollTop(t.prop("scrollHeight"))})}},l=function(e,t){return t?'<li class="right clearfix"><span class="chat-img pull-right"><img src="static/img/me.png" alt="User Avatar" class="img-circle"></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+(new Date).toLocaleString()+'</small><strong class="pull-right primary-font">Anonymous</strong></div><p>'+e+" </p> </div></li>":'<li class="left clearfix"><span class="chat-img pull-left"><img src="static/img/bot.png" alt="User Avatar" class="img-circle"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">WSE Bots</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+(new Date).toLocaleString()+"</small></div><p>"+e+" </p> </div></li>"};return{send:n,buildHtml:l,chat:a,hi:i}}]);