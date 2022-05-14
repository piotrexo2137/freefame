
(function(e,t,n) {var r="attachEvent",i="addEventListener",s="DOMContentLoaded";if(!t[i])i=t[r]?(s="onreadystatechange")&&r:"";e[n]=function(r){/in/.test(t.readyState)?!i?setTimeout(function(){e[n](r)},9):t[i](s,r,false):r()}}) (window,document,"domReady");

domReady(function() {
  var wowza_css=document.createElement('link');
  wowza_css.rel='stylesheet';
  wowza_css.href= "//player.cloud.wowza.com/wowza_embed.css";
  wowza_css.onload=loadVideoJSCSS;
  document.getElementsByTagName('head')[0].appendChild(wowza_css);

  function loadVideoJSCSS() {
    var ls = document.createElement('link');
    ls.rel='stylesheet';
    ls.href= "//player.cloud.wowza.com/js-lib/video-js-5/video-js.min.css";
    ls.onload = loadPlayer;
    document.getElementsByTagName('head')[0].appendChild(ls);
  };


  function loadPlayer() {
    

    var playerText="<div id='fcplayer_wrapper' class='fcplayer' style='position: relative; background-image: url(); background-size: cover;height: 720px; width: 1280px;'><div style='height: 0; padding-bottom: 56.25%'></div>"
    playerText+="<video id='fcplayer' class='video-js vjs-default-skin vjs-big-play-centered' style='position: absolute; left: 0; top:0; width:100%;height:100%;'  controls>"
    playerText+="	<source id='fcplayer_source' src='//cdn3.wowza.com/1/WVBPMnJET1NvbFk2/cCtZdzhN/hls/live/playlist.m3u8' type='application/x-mpegURL'></source>"
    playerText+="</div>"

    var doc = document.createElement('div');
    doc.innerHTML = playerText;
    var playerDiv = doc.firstChild;
    w_ie('wowza_player', playerDiv);

    function w_ie(id, div) {
      document.getElementById(id).appendChild(div);
    }

    params = {
      poster:              "",        // Posterframe URL
      preload:             "none",
      autoplay:            false,
      playlist: [{
      mediaid:             "FAME MMA 14 ",
      title:               "FAME MMA 14 ",
      file:                "//cdn3.wowza.com/1/WVBPMnJET1NvbFk2/cCtZdzhN/hls/live/playlist.m3u8",
      sources:             [],
      live:                true,                  // Live flag
      countdown:           false,    // Countdown flag
      countdown_timestamp: "", // UNIX timestamp of the countdown date (required to show the countdown)
      live_done:           false                  // Show the "Thanks for watching message"
      }],
      freecaster: {
        player_root:         "https://player.cloud.wowza.com/hosted/qnfxyb4g/",
        get_video_path:      "wowza.json", // Will call player_root + get_video_path to get updated playlist item
        noactions:           true,       // Disable internal views counter
        template_livedate:   "%a %e %b %Y @ %H:%M",
        template_countdown:  "%days day(s) %hours:%minutes:%seconds",
        live_done_message:   "Thanks for watching!",
        live_done_image:     null,       // Optional image to append below the live_done message
        watermark_path:      "",       // Path to SVG
        watermark_href:      "#",       // Watermark link URL
        watermark_position:  "top-left"
      }
    };

    var wpTechOrder=document.getElementById('wowza_player').getAttribute('techOrder')

    if (wpTechOrder) {
      params.techOrder=wpTechOrder.split(' ');
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//player.cloud.wowza.com/js-lib/fc-vjs-wrapper.js"
    document.getElementsByTagName("head")[0].appendChild(script);

    var node = document.createElement('style');
    node.innerHTML = '\n.vjs-error .vjs-error-display:before {\n  content: \"\" !important;\n}\n\n.vjs-error-display.vjs-modal-dialog {\n  background: none !important;\n}\n\n.fc-poster #fcplayer_freecaster_countdown {\n  height: 95px !important;\n  width: 280px !important;\n  font-size: 18px !important;\n  top: 70px !important;\n\n  font-weight: bold;\n  line-height: 25px;\n  padding-left: 40px;\n  padding-top: 10px;\n  border-radius: 0px 20px 20px 0px;\n  background: rgba(0,0,0,0.5);\n  color: #FFFFFF;\n  z-index: 1000;\n}\n\n.fc-poster #fcplayer_freecaster_countdown #fcplayer_freecaster_countdown_livedate::before {\n    content: \"Stream will start on:\";\n    font-size: 15px;\n    font-weight: bold;\n    display: block;\n    color: #FFFFFF;\n    clear: both;\n}\n\n.fc-overlays {\n    pointer-events: none;\n}\n';
    document.getElementsByTagName("head")[0].appendChild(node);


  }
});
