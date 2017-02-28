(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('MessageService', MessageService);
 
    MessageService.$inject = ['$q','$filter', '$timeout', '$rootScope', '$http'];

  function MessageService($q, $filter, $timeout, $rootScope, $http) {
    var MessageService = {};

    MessageService.GetMessageById = GetMessageById;
    MessageService.DeleteMessage = DeleteMessage;
    MessageService.GetMessages = GetMessages;
    MessageService.UpdateImportant = UpdateImportant;
    MessageService.AddComment = AddComment;
    MessageService.AddMessage = AddMessage;
    MessageService.initial=initial;

    return MessageService;

     function initial() {
      return $http.get('/initial').then(handleSuccess, handleError('Error getting message'));
    }

    function GetMessages() {
      return $http.get('/messages').then(handleSuccess, handleError('Error getting message'));
    }

    function GetMessageById(messageID) {
      return $http.get('/messageDetail/' + messageID).then(handleSuccess, handleError('Error getting message'));
    }

    function DeleteMessage(messageID) {
      return $http.delete('/deleteMessage/' + messageID).then(handleSuccess, handleError('Error getting message'));
    }

    function UpdateImportant(messageID, important) {
      return $http.put('/updateImportant/', {params: {id:messageID,important:important}}).then(handleSuccess, handleError('Error getting message'));
    }

    function AddMessage(message) {
      return $http.post('/addMessage/', message).then(handleSuccess, handleError('Error getting message'));
    }

    function AddComment(messageID, message) {
      return $http.put('/addComment/', {params: {id:messageID,message:message}}).then(handleSuccess, handleError('Error getting message'));
    }

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(error) {
      return function() {
        return { success: false, message: error};
      };
    }
  }
})();