import angular from 'angular';

require('angular-route');
require('angular-cookies');
var io = require('socket.io-client');
console.log(io);

angular.module('dashboard', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {templateUrl: 'partials/entry/_index.html'})
            .when('/login', {templateUrl: 'partials/entry/_login.html'})
            .when('/register', {templateUrl: 'partials/entry/_register.html'})
            .when('/dashboard', {templateUrl: 'partials/dashboard/_index.html'})
            .when('/users/:id/edit', {templateUrl: 'partials/dashboard/_edit.html'})
            .when('/users/:id', {templateUrl: 'partials/dashboard/_user.html'})
			.when('/chat', {templateUrl : 'partials/dashboard/_chatroom.html'})
			.otherwise('/');
    }]);

const serviceContext = require.context('./services', true, /\.js$/);
const factoryContext = require.context('./factories', true, /\.js$/);
const controllerContext = require.context('./controllers', true, /\.js$/);

serviceContext.keys().forEach(function(file){
    serviceContext(file);
});
factoryContext.keys().forEach(function(file){
    factoryContext(file);
});
controllerContext.keys().forEach(function(file){
    controllerContext(file);
});
