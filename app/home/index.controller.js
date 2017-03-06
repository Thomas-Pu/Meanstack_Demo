(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

 Controller.$inject = ['UserService', '$rootScope','$location','$state'];

    function Controller(UserService,$rootScope,$location,$state) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.user=user;
               console.log("ceshi");
               $state.go('home.account',{});
            });
        }

        
    }

})();