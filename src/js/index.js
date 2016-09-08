import '../sass/index.scss';

import angular from 'angular';

import angularScroll from 'angular-scroll';
import angularAnimate from 'angular-animate';
import uiCollapse from 'angular-ui-bootstrap/src/collapse';

import screenVideo from './video/screenVideo.js';

angular.module('ghIndex', [angularAnimate, angularScroll, uiCollapse])
  .directive('screenVideo', screenVideo)
  .value('duScrollDuration', 500)
  .run(function($window, $rootScope) {
    'ngInject';

    const history = $window.history;

    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
      //Automaticly update location
      var hash = $target.prop('id');
      if (hash) {
        if (history && history.replaceState) {
          history.replaceState(null, null, '#' + hash);
        } else {
          $window.location.hash = hash;
        }

      }
    });

  });

angular.bootstrap(document, ['ghIndex'], {strictDi: true});
