(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

 Controller.$inject = ['UserService', '$rootScope','$location'];

    function Controller(UserService,$rootScope,$location) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                $rootScope.user=user;
               $location.path('/account');
            });
        }

        
    }

})();