/**
 * Created by malavallim on 7/5/16.
 */

var sigChannelSelf = new LoopbackSignalingChannel();
var sigChannelOther = new LoopbackSignalingChannel();

(function () {

  var video = document.getElementById('self');
  var pc = new RTCPeerConnection(null, { optional: [] });

  pc.onicecandidate =
    function (e) {
      console.log('Self: sending ice candidate - ', e.candidate.candidate);
      sigChannelOther.send({ candidate: e.candidate.candidate });
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
          sigChannelOther.send({ offer: offer.sdp });
        }
      ).catch(
        console.log.bind(console)
      );
    }
  ).catch(
    console.log.bind(console)
  );
})();

//
//(function () {
//
//  var selfVideo = document.getElementById('self');
//  var remoteVideo = document.getElementById('remote');
//
//  var pcServers = null;
//  var pcConstraints = { optional: [] };
//  var pcSelf = new RTCPeerConnection(pcServers, pcConstraints);
//  var pcOther = new RTCPeerConnection(pcServers, pcConstraints);
//  var sigChannelSelf = new LoopbackSignalingChannel();
//  var sigChannelOther = new LoopbackSignalingChannel();
//
//  var mediaConstraints = {
//    audio: false,
//    video: {
//      width: { ideal: 320 },
//      height: { ideal: 240 }
//    }
//  };
//
//  var generateOffer = function (stream) {
//    console.log('Self: Got stream - ', stream);
//    selfVideo.srcObject = stream;
//    pcSelf.addStream(stream);
//    pcSelf.onicecandidate = function (e) {
//      console.log('Self: Sending candidate')
//      sigChannelOther.send({
//        command: 'addIceCandidate',
//        candidate: e.candidate.toJSON()
//      });
//    };
//    return pcSelf.createOffer();
//  };
//
//  var sendOffer = function (sdp) {
//    pcSelf.setLocalDescription(sdp)
//      .then(function () {
//        sigChannelOther.send({
//          command: 'setRemoteDescription',
//          sdp: sdp.toJSON()
//        });
//      });
//  };
//
//  var logError = function (error) {
//    console.log('getUserMedia(): - ', error);
//  };
//
//  sigChannelOther.receive(function (data) {
//    switch (data.command) {
//      case 'addIceCandidate': {
//        pcOther.addIceCandidate(new RTCIceCandidate(data.candidate.candidate));
//        break;
//      }
//      case 'setRemoteDescription': {
//        pcOther.setRemoteDescription(new RTCSessionDescription(data.sdp.sdp))
//          .then(function () {
//            return pcOther.createAnswer();
//          }).then(function (sdp) {
//            pcOther.setLocalDescription(sdp)
//              .then(function () {
//                sigChannelSelf.send({
//                  command: 'setRemoteDescription',
//                  sdp: sdp.toJSON()
//                });
//              });
//          });
//      }
//    }
//  });
//
//  sigChannelSelf.receive(function (data) {
//    pcSelf.setRemoteDescription(new RTCSessionDescription(data.sdp.sdp))
//      .then(function () {
//        console.log('Connection established.');
//      });
//  });
//
//  navigator.mediaDevices.getUserMedia(mediaConstraints)
//    .then(generateOffer)
//    .then(sendOffer)
//    .catch(logError);
//})();
