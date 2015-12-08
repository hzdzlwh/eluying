var UIModule = angular.module('UIModule', ['ngAnimate', 'ui.bootstrap']);
UIModule.controller('modalCtrl', function($scope, $uibModal){
    $scope.open = function(url, size){
        var modalInstance = $uibModal.open({
            templateUrl: url,
            size: size
        });
    }
});
UIModule.controller('modalInstanceCtrl', function($scope, $uibModalInstance){
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
