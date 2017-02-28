(function () {
    'use strict';
    angular
        .module('app')
        .controller('message', message);

    message.$inject = ['$scope', 'MessageService', '$http', '$rootScope', '$state'];


  function message($scope, MessageService, $http, $rootScope, $state) {
    $rootScope.messages = [];
    
    MessageService.initial().then(function(data){
    })

    MessageService.GetMessages().then(function(data) {
      $rootScope.messages = data;
    })


    $scope.isImportant = function(message) {
      if(message.important == '1')
        return true;
      else
        return false;
    }

    $scope.flag = function(id, event){
      var value = event.target.attributes.src.value;
      var important;
      if(value == '/app/app-content/img/clicked.png'){
        event.target.attributes.src.value = "/app/app-content/img/unclicked.png";
        important = '0';
      }
      else{
        event.target.attributes.src.value = "/app/app-content/img/clicked.png";
        important = '1';
      }
      
      MessageService.UpdateImportant(id, important).then(function(err, res){});

    }

    $scope.goto = function(id) {
      $state.go('home.messageDetail', {'id': id});
    }
  }
})();