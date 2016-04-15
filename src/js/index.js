import '../sass/index.scss';

import angular from 'angular';
import angularScroll from 'angular-scroll';

import screenVideo from './video/screenVideo';

angular.module('ghIndex', [angularScroll])
  .directive('screenVideo', screenVideo)
  .value('duScrollDuration', 500)
  .run(function($window, $rootScope) {
    'ngInject';

    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
      //Automaticly update location
      var hash = $target.prop('id');
      if (hash) {
        $window.location.hash = hash;
      }
    });

  });

angular.bootstrap(document, ['ghIndex'], {strictDi: true});
