/**
 * Created by malavallim on 7/5/16.
 */
(function () {
  var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || function () {
    console.log('getUserMedia() not supported.');
  };
  var constraints = {
    audio: false,
    video: true
  };
  var setVideoSource = function (video, stream) {
    video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
  };
  var gotMedia = function (stream) {
    console.log('getUserMedia(): Got stream - ', stream);
    setVideoSource(document.getElementById('self'), stream);
  };
  var gotError = function (error) {
    console.log('getUserMedia(): - ', error);
  };

  getUserMedia.call(navigator, constraints, gotMedia, gotError);
})();
