import '../sass/index.scss';

import angular from 'angular';

import angularScroll from 'angular-scroll';
import angularAnimate from 'angular-animate';
import uiCollapse from 'angular-ui-bootstrap/src/collapse';

import imgix from '@ortoo/angular-common/lib/images/imgix.js';

import screenVideo from './video/screenVideo.js';
import PricingController from './pricing/PricingController.js';

angular.module('ghIndex', [angularAnimate, angularScroll, uiCollapse, imgix.name])
  .directive('screenVideo', screenVideo)
  .value('duScrollDuration', 500)
  .controller('PricingController', PricingController)
  .config(function(imgixProvider) {
    'ngInject';
    imgixProvider.addHostMapping(__CONFIG__.IMGIX.CDN_MAP.host, __CONFIG__.IMGIX.CDN_MAP.source);
  })
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
