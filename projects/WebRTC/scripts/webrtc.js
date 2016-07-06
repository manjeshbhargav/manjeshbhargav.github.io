/**
 * Created by malavallim on 7/6/16.
 */

(function (scope) {
  scope.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  scope.getUserMedia = scope.getUserMedia || function (constraints, success, failure) {
    failure = failure || function (error) { console.error(error); };
    failure('Not supported');
  };
})(navigator);

(function (scope) {
  scope.URL = scope.URL || {
    createObjectURL: function (source) {
      return source;
    }
  };
})(window);