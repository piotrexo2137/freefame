var videoPlayer = videojs("fcplayer");
var streamWatchIntervId;

videoPlayer.on('error', function() {
  if (videoPlayer.error_["code"] == 4) {
    streamWatchIntervId = setInterval(watchForStream, 10000);
  }
});


function watchForStream () {
  clearInterval(streamWatchIntervId);
  videoPlayer.load(params.playlist[0]);
};
