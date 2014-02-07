"use strict";angular.module("linkedoutApp",["ngRoute","ngSanitize"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("linkedoutApp").controller("MainCtrl",["$scope","Session",function(a,b){a.isLoggedIn=!1,b.then(function(b){function c(c,d){b[c](function(){a.$apply(function(){a.isLoggedIn=d})})}a.login=b.login,c("onLogin",!0),c("onLogout",!1)})}]),angular.module("linkedoutApp").controller("ProfileCtrl",["$scope","Profile",function(a,b){function c(a,b){a[b]=(a[b]||"").split("\n").join("<br>")}function d(a,b){a._total>0&&a.values.forEach(function(a){c(a,b)})}function e(a){return a.lastModifiedTimestamp&&(a.lastModifiedTimestamp=new Date(a.lastModifiedTimestamp)),c(a,"summary"),d(a.recommendationsReceived,"recommendationText"),d(a.positions,"summary"),a}a.me=null,a.hasProfile=!1,a.profileError=!1;var f={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};a.formatDate=function(a,b){var c="";return a?("day"in a&&(c+=a.day+" "),"month"in a&&(c+=f[a.month]+" "),c+a.year):b||c},b.then(function(b){b.get().then(function(b){a.me=e(b),a.hasProfile=!0},function(){a.profileError=!0})})}]),angular.module("linkedoutApp").factory("LinkedIn",["$q","$window",function(a,b){var c=b.document,d=c.createElement("script"),e=a.defer();return d.src="http://platform.linkedin.com/in.js",d.innerHTML=["api_key: zxqfbiusbj96","authorize: true","lang: en_GB","onLoad: onLinkedInApiLoad","scope: r_basicprofile r_emailaddress r_fullprofile r_network rw_groups"].join("\n"),b.onLinkedInApiLoad=function(){e.resolve(b.IN)},c.body.appendChild(d),e.promise}]),angular.module("linkedoutApp").factory("Profile",["$q","LinkedIn","Session",function(a,b,c){return a.all([b,c]).then(function(b){var c=b[0],d=(b[1],["distance","first-name","formatted-name","formatted-phonetic-name","headline","id","industry","last-name","location","maiden-name","num-connections","num-connections-capped","phonetic-first-name","phonetic-last-name","picture-url","positions","public-profile-url","site-standard-profile-request","specialties","summary","email-address","bound-account-types","im-accounts","main-address","phone-numbers","primary-twitter-account","twitter-accounts","associations","certifications","courses","date-of-birth","educations","honors-awards","interests","languages","last-modified-timestamp","member-url-resources","mfeed-rss-url","num-recommenders","patents","proposal-comments","publications","recommendations-received","skills","volunteer"]);return{get:function(){var b=a.defer(),e="/people/~:("+d.join(",")+")";return c.User.isAuthorized()?c.API.Raw(e).result(function(a){a&&b.resolve(a)}).error(function(a){b.reject(a)}):b.reject(new Error("current user is not authorised")),b.promise}}})}]),angular.module("linkedoutApp").factory("Session",["LinkedIn",function(a){return a.then(function(a){return{login:function(b){a.User.authorize(b||angular.noop)},logout:function(b){a.User.logout(b||angular.noop)},isLoggedIn:function(){return a.User.isAuthorized()},onLogin:function(b){a.Event.on(a,"auth",b)},onLogout:function(b){a.Event.on(a,"logout",b)}}})}]);