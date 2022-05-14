var libs = [
'//player-dev.cloud.wowza.com/js-lib/qa/common.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5/video.min.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/videojs-contrib-hls.min.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/flashhls/videojs.flashls.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/fc/freecaster.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/videojs-wowza-languages.js',
'//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/videojs-wowza-offline.js'
]

function loadJQuery() {
  if (!window.jQuery) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//player-dev.cloud.wowza.com/js-lib/qa/jquery-1.7.2.min.js";
    document.body.appendChild(script);
  } else {
    version = jQuery.fn.jquery
    parts = version.split(".")
    major = parts.length > 0 ? parseInt(parts[0]) : 0
    minor = parts.length > 1 ? parseInt(parts[1]) : 0
    rev   = parts.length > 2 ? parseInt(parts[2]) : 0
    if (major < 1 || minor < 7 || rev < 2) {
      console.error("VideoJS requires JQuery 1.7.2 or greater.  Currently using JQuery " + version);
    }
  }
}

function loadScript(url) {
  if( url.length == 0) {
    //final function to execute
    return loadVJS;
  }

  var f = function(){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url.shift();

    //recursion
    script.onload = loadScript(url) ;

    document.body.appendChild(script);
  }
  return f;
}

function loadScripts(urls) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = urls.shift();
  script.onload = loadScript(urls);
  document.body.appendChild(script);
}

loadJQuery();
loadScripts(libs);

// var jQuery_1_7_2 = $.noConflict(true);

function loadVJS () {
  videojs.flashls({swfUrl: "//player-dev.cloud.wowza.com/js-lib/qa/video-js-5-addons/flashhls/video-js-flashls.swf"});
  var videoPlayer = videojs("fcplayer", params, function(){
  //  -- Video.js 5 Layers for the Freecaster plugin ------------------------------
  videoPlayer.el().oncontextmenu = function(){ return false; };
  $("<div>").css({
    bottom: "0",
    left: "0",
    position: "absolute",
    right: "0",
    top: "0"
  }).addClass("fc-overlays").insertAfter($(videoPlayer.el()).find(".vjs-poster"));
  $("<div>").css({
    backgroundSize: "cover",
    bottom: "0",
    left: "0",
    position: "absolute",
    right: "0",
    top: "0"
  }).addClass("fc-poster").appendTo($(videoPlayer.el()).find(".vjs-poster"));
  //  -- Video.js 5 Shim ----------------------------------------------------------
  videoPlayer.getContainer = videoPlayer.el;
  videoPlayer.config = function(c){
    if (c) return params[c];
    return params;
  };
  videoPlayer.poster(params.poster);
  videoPlayer.item = function(i){
    return params.playlist[0];
  };
  function url_to_src(url)
  {
    var m = url.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
    if (m)
    {
      var ext = m[1].toLowerCase();
      var type;
      switch (ext)
      {
        case 'f4m':
          type = 'application/f4m';
          break;
        case 'm3u8':
          type = "application/x-mpegURL";
          break;
        default:
          type = "video/" + ext;
          break;
      }
      return { type: type, src: url };
    }
    return { src: url };
  }
  var load = videoPlayer.load;
  videoPlayer.load = function(item){
    var src = [];
    if (item.file) src.push(url_to_src(item.file));
    else if ((item.sources) && (item.sources.length))
    {
      for (var i = 0; i < item.sources.length; i++)
      {
        src.push(url_to_src(item.sources[i].file));
      }
    }
    videoPlayer.src(src);
    load.call(videoPlayer);
    videoPlayer.trigger("playlistItem", { item: item });
  };
  videoPlayer.resize = function(w, h){
    $("#fcplayer_wrapper").css({
      height: h + "px",
      width: w + "px"
    });
    videoPlayer.trigger("resize", { width: w, height: h });
  };
  videoPlayer.stop = videoPlayer.pause;
  var on = videoPlayer.on;
  videoPlayer.on = function(type, callback, p){
    if (typeof type == "string")
    {
      type = type.split(" ");
      return on.call(videoPlayer, type, function(e, data){
        // Translate Video.js events in JW7 events
        for (var key in data)
        {
          e[key] = data[key];
        }
        callback(e, data);
      }, p);
    }
    return on.call(videoPlayer, type, callback, p);
  };

  window.fcplayer = function(id){
    if (!id) id = "fcplayer";
    return videojs(id);
  };
  //  -----------------------------------------------------------------------------
  addPlayer(videoPlayer);

  videoPlayer.trigger("playlistItem", { item: params.playlist[0] });
  });

  // Returns a custom countdown template according to the time left
  function fcplayerCountdownTemplate(left, days, hours, minutes, seconds)
  {
  if (days > 1) return "%days days %hours:%minutes:%seconds";
  else if (days == 1) return "%days day %hours:%minutes:%seconds";
  return "%hours:%minutes:%seconds";
} }
