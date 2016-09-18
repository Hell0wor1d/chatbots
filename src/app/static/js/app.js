'use strict';
//
//  Author:
//       Kev7n <root@kev7n.com>
//
//  Copyright (c) 2016 kev7n.com
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with this program.  If not, see <http:#www.gnu.org/licenses/>.


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.services'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])

//NOTE: We are including the constant `ApiEndpoint` to be used here.
  .constant('ApiEndpoint', {
    // Remote server ip address. usually if you call api locally, just keep it empty is ok.
    // e.g. remote server : http://kev7n.com:5000 or http://127.0.0.1:5000
    HTTP_SERVER: ''
  });

  

'use strict';
// 
//  Author:
//       Kev7n <root@kev7n.com>
//
//  Copyright (c) 2016 kev7n.com
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with this program.  If not, see <http:#www.gnu.org/licenses/>.

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'static/views/view1.html',
            controller: 'View1Ctrl'
        });
    }])
    .directive('dateKeys', ["chatService", function (chatService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // debugger;
                element.on('keydown', function (event) {
                    switch (event.keyCode) {
                        case 13: //enter
                            var input = $("#btn-input");
                            var msg = input.val();
                            chatService.chat(msg);

                            input.val("");
                            break;
                        default:
                            break;
                    }
                });
            }
        };
    }])

    .controller('View1Ctrl', ['$scope', 'chatService', function ($scope, chatService) {

        angular.element(document).ready(function () {

            chatService.hi();
        });

        $scope.message = "";
        $scope.send = function () {
            chatService.chat($scope.message);

            $scope.message = "";
        };

        $scope.getPlan = function () {

        }
    }]);

angular.module('myApp.services', [])

    .factory('chatService', ["$http", "ApiEndpoint", function ($http, ApiEndpoint) {

        console.log('ApiEndpoint', ApiEndpoint);

        var send = function (msg) {

            // use $.param jQuery function to serialize data from JSON
            var data = $.param({
                question: msg
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            console.log("Says: " + msg);
            return $http.post(ApiEndpoint.HTTP_SERVER + '/chat', data, config).then(function (result) {

                // What we return here is the data that will be accessible
                // to us after the promise resolves
                return result.data;
            });
        };

        var hi = function () {
            var panel = $(".panel-body");
            var panelUl = panel.find("ul");
            send('[hi]').then(function (result) {

                // this is only run after send() resolves
                panelUl.append(buildHtml(result.message));
                panel.scrollTop(panel.prop('scrollHeight'));
            });
        };

        var chat = function (msg) {
            if (msg === '') {
                return;
            }
            var panel = $(".panel-body");
            var panelUl = panel.find("ul");
            panelUl.append(buildHtml(msg, true));
            panel.scrollTop(panel.prop('scrollHeight'));

            send(msg).then(function (result) {

                // this is only run after send() resolves
                panelUl.append(buildHtml(result.message));
                panel.scrollTop(panel.prop('scrollHeight'));
            });
        };

        var buildHtml = function (msg, isFromMe) {
            if (isFromMe) {
                return '<li class="right clearfix"><span class="chat-img pull-right">' +
                    '<img src="static/img/me.png" alt="User Avatar" class="img-circle">' +
                    '</span>' +
                    '<div class="chat-body clearfix">' +
                    '<div class="header">' +
                    '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + new Date().toLocaleString() + '</small>' +
                    '<strong class="pull-right primary-font">Anonymous</strong>' +
                    '</div>' +
                    '<p>' +
                    msg +
                    ' </p>' +
                    ' </div>' +
                    '</li>';
            }
            return '<li class="left clearfix"><span class="chat-img pull-left">' +
                '<img src="static/img/bot.png" alt="User Avatar" class="img-circle">' +
                '</span>' +
                '<div class="chat-body clearfix">' +
                '<div class="header">' +
                '<strong class="primary-font">WSE Bots</strong> <small class="pull-right text-muted">' +
                '<span class="glyphicon glyphicon-time"></span>' + new Date().toLocaleString() + '</small>' +
                '</div>' +
                '<p>' +
                msg +
                ' </p>' +
                ' </div>' +
                '</li>';
        };

        return {
            send: send,
            buildHtml: buildHtml,
            chat: chat,
            hi: hi
        };
    }])
;

