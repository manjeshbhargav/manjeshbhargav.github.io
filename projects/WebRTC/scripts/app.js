/**
 * Created by malavallim on 7/5/16.
 */

var sigChannelSelf = new LoopbackSignalingChannel();
var sigChannelOther = new LoopbackSignalingChannel();

(function () {

  var video = document.getElementById('other');
  var pc = new RTCPeerConnection(null, { optional: [] });

  pc.onaddstream =
    function (e) {
      console.log('Other: adding self\'s stream - ', e.stream);
      video.srcObject = e.stream;
    };

  pc.onicecandidate =
    function (e) {
      if (e.candidate) {
        console.log('Other: sending ice candidate - ', e.candidate.candidate);
        sigChannelSelf.send({ candidate: e.candidate.toJSON() });
      }
    };

  sigChannelOther.receive(
    function (data) {
      if (data.hasOwnProperty('offer')) {
        console.log('Other: offer - ', data.offer);
        pc.setRemoteDescription(new RTCSessionDescription(data.offer))
          .then(
            function () {
              return pc.createAnswer();
            }
          ).then(
            function (answer) {
              console.log('Other: answer - ', answer.sdp);
              pc.setLocalDescription(answer)
                .then(
                  function () {
                    console.log('Other: local sdp set, sending answer...');
                    sigChannelSelf.send({
                      answer: answer.toJSON()
                    });
                  }
                ).catch(
                  console.log.bind(console)
                );
            }
          ).catch(
            console.log.bind(console)
          );
      }
      else if (data.hasOwnProperty('candidate')) {
        console.log('Other: receiving ice candidate - ', data.candidate);
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(
            console.log.bind(console)
          );
      }
    }
  );

})();

(function () {

  var video = document.getElementById('self');
  var pc = new RTCPeerConnection(null, { optional: [] });

  pc.onicecandidate =
    function (e) {
      if (e.candidate) {
        console.log('Self: sending ice candidate - ', e.candidate.candidate);
        sigChannelOther.send({ candidate: e.candidate.toJSON() });
      }
    };

  sigChannelSelf.receive(
    function (data) {
      if (data.hasOwnProperty('answer')) {
        console.log('Self: answer - ', data.answer);
        pc.setRemoteDescription(new RTCSessionDescription(data.answer))
          .then(
            function () {
              console.log('Self: connection established!');
            }
          ).catch(
            console.log.bind(console)
          );
      }
      else if (data.hasOwnProperty('candidate')) {
        console.log('Self: receiving ice candidate - ', data.candidate);
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(
            console.log.bind(console)
          );
      }
    }
  );

  navigator.mediaDevices.getUserMedia(
    {
      audio: false,
      video: true
    }
  ).then(
    function (stream) {
      console.log('Self: local stream - ', stream);
      video.srcObject = stream;
      pc.addStream(stream);
      return pc.createOffer();
    }
  ).then(
    function (offer) {
      console.log('Self: offer - ', offer.sdp);
      pc.setLocalDescription(offer).then(
        function () {
          console.log('Self: local sdp set, sending offer...');
          sigChannelOther.send({ offer: offer.toJSON() });
        }
      ).catch(
        console.log.bind(console)
      );
    }
  ).catch(
    console.log.bind(console)
  );

})();
