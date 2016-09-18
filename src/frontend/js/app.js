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

  
