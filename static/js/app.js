const StatusManager = () => {
  const element = $('#connextion-status');
  this.connect = () => {
    console.log('marking status element as connected', element);
    element.removeClass('badge-secondary badge-danger')
      .addClass('badge-success')
      .text('Connected');
  }
  this.disconnect = () => {
    console.log('marking status element as disconnected');
    element.removeClass('badge-secondary badge-success')
      .addClass('badge-danger')
      .text('Disconnected');
  }

  this.checking = () => {
    console.log('marking status element as checking status');
    element.removeClass('badge-success badge-danger')
      .addClass('badge-secondary')
      .text('Checking');
  }

  return this;
}

$(document).ready(function() {

  console.log("document loaded");
  const Status = StatusManager();

  var Socket = io();
  Socket.on('connect', () => {
    console.log('connected', Socket.id);
    Status.connect();
  });

  Socket.on('disconnect', () => {
    console.log('disconnected', Socket.id);
    Status.disconnect();
  });
});