/**
 * Created by malavallim on 7/6/16.
 */

(function (scope) {
  var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  getUserMedia = getUserMedia || function (constraints, success, failure) {
    failure = failure || function (error) { console.error(error); };
    failure('Not supported');
  };

  scope.getUserMedia = function (constraints) {
    return new Promise(function (resolve, reject) {
      getUserMedia.call(scope, constraints, resolve, reject);
    });
  };
})(navigator);

(function (scope) {
  scope.URL = scope.URL || {
    createObjectURL: function (source) {
      return source;
    }
  };
})(window);