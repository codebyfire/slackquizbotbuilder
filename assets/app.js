/// <reference path="../typings/angularjs/angular.d.ts"/>

angular.module('com.codebyfire.slackquizbotbuilder', ['ui.bootstrap', 'ui.sortable']);
angular.module('com.codebyfire.slackquizbotbuilder').config(['$provide', function ($provide){
    $provide.decorator('accordionDirective', function($delegate) { 
        var directive = $delegate[0];
        directive.replace = true;
        return $delegate;
    });
}]);
angular.module('com.codebyfire.slackquizbotbuilder').controller('QuizCtrl', function ($scope, $modal, $document) {
  
  $scope.openSettingsModal = function () {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'settings.html',
      controller: 'SettingsInstanceCtrl',
      resolve: {
        settings: function () {
          return $scope.settings;
        }
      }
    });
    
    modalInstance.result.then(function (settings) {
      $scope.settings = settings;
    });
  };
  
  $scope.openImportModal = function () {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'import.html',
      controller: 'ImportInstanceCtrl'
    });
    
    modalInstance.result.then(function (importedJSON) {
      $scope.importJSON(importedJSON);
    });
  };
  
  $scope.importedJSON = {};
  
  $scope.settings = {
    startQuestionGap: 3,
    questionTime: 60,
    nextQuestionGap: 10,
    pointsPerQuestion: 1,
    showScoreInterval: 1
  };

  $scope.questions = [];
  
  $scope.importJSON = function(json) {
    var imported = angular.fromJson(json);
    $scope.questions = imported.questions;
    $scope.settings = imported.settings;
  }
  
  $scope.downloadJSON = function() {
    var element = $document[0].createElement('a');
    element.setAttribute('href', 'data:json;charset=utf-8,' + angular.toJson({questions:$scope.questions, settings:$scope.settings}));
    element.setAttribute('download', 'myquiz.json');
    element.style.display = 'none';
    $document[0].body.appendChild(element);
    element.click();
    $document[0].body.removeChild(element);
  }

  $scope.addQuestion = function() {
    $scope.questions.push({text:"", answers:[{text:[""]}], answersNeeded:1});
  };
  $scope.removeQuestion = function(questionId) {
    $scope.questions.splice(questionId, 1);
  };
  
  $scope.addImage = function(questionId) {
    $scope.questions[questionId].image = "Image URL";
  };
  $scope.removeImage = function(questionId) {
    delete $scope.questions[questionId].image;
  };
  
  $scope.addAnswer = function(questionId) {
    var newItemNo = $scope.questions[questionId].answers.length;
    $scope.questions[questionId].answers.push({text:["Answer " + (newItemNo+1)]});
  };
  $scope.removeAnswer = function(questionId, answerId) {
    $scope.questions[questionId].answers.splice(answerId, 1);
  };
  $scope.addAlternative = function(questionId, answerId) {
    $scope.questions[questionId].answers[answerId].text.push($scope.questions[questionId].answers[answerId].text[0]);
  };
  $scope.removeAlternative = function(questionId, answerId, alternativeId) {
    $scope.questions[questionId].answers[answerId].text.splice(alternativeId, 1);
  };
});


angular.module('com.codebyfire.slackquizbotbuilder').controller('SettingsInstanceCtrl', function ($scope, $modalInstance, settings) {
  $scope.settings = settings;

  $scope.ok = function () {
    $modalInstance.close($scope.settings);
  };
});

angular.module('com.codebyfire.slackquizbotbuilder').controller('ImportInstanceCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close($scope.importedJSON);
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});