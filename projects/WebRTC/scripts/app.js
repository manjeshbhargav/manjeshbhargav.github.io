/**
 * Created by malavallim on 7/5/16.
 */
(function () {
  var constraints = {
    audio: false,
    video: {
      width: { ideal: 320 },
      height: { ideal: 240 }
    }
  };
  var gotMedia = function (stream) {
    console.log('getUserMedia(): Got stream - ', stream);
    document.getElementById('self').src = URL.createObjectURL(stream);
  };
  var gotError = function (error) {
    console.log('getUserMedia(): - ', error);
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMedia)
    .catch(gotError);
})();
