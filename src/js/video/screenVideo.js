import angular from 'angular';

export default function($window) {
  'ngInject';

  return {
    restrict: 'E',
    link: function($scope, $elem, $attrs) {
      const $parent = $elem.parent();
      const parent = $parent[0];

      const src = $attrs.src;
      const iframe = angular.element(`<iframe width="100%" height="100%" src="${src}" frameborder="0" allowfullscreen></iframe>`);

      // Hide for now
      $elem.css('display', 'none');

      $elem.append(iframe);

      $window.addEventListener('resize', update);

      $scope.$on('$destroy', function() {
        $window.removeEventListener('resize', update);
      });

      update();

      function update() {
        // Get the width and height of the parent
        const pwidth = parent.clientWidth;
        const pheight = parent.clientHeight;
        const origWidth = parseFloat($attrs.origWidth, 10);
        const origHeight = parseFloat($attrs.origHeight, 10);
        const aspect =  origHeight / origWidth;

        var actualWidth;
        var actualHeight;

        if (pwidth * aspect > pheight) {
          // Height limited
          actualHeight = pheight;
          actualWidth = pheight / aspect;
        } else {
          // Width limited
          actualWidth = pwidth;
          actualHeight = pwidth * aspect;
        }

        const scale = actualHeight / origHeight;
        const screenX = parseFloat($attrs.screenX, 10);
        const screenY = parseFloat($attrs.screenY, 10);
        const screenWidth = parseFloat($attrs.screenWidth, 10);
        const screenHeight = parseFloat($attrs.screenHeight, 10);

        $elem.css({
          display: '',
          position: 'absolute',
          width: `${scale * screenWidth}px`,
          height: `${scale * screenHeight}px`,
          bottom: `${actualHeight - (scale * (screenY + screenHeight))}px`,
          left: `${((pwidth - actualWidth) / 2) + (scale * screenX)}px`
        });
      }
    }
  };
}
