/**
 * Created by malavallim on 7/6/16.
 */

function LoopbackSignalingChannel () {
  var handlers = [];

  this.send = function (data) {
    handlers.forEach(function (handler) {
      setTimeout(function () { handler(data); }, 0);
    });
  };

  this.receive = function (handler) {
    typeof handler === 'function' && handlers.push(handler);
  };
}
