"use strict";

Raven.config('https://3e478e63aaae4ff6810ec83dc4b2bec1@sentry.io/107160').install()

var liveStreams = [];
var liveBroadcasterLanguageStreams = [];

var broadcasterLanguage = "en";
var notifiedWhenOnline;

var notifiedList = JSON.parse(localStorage.getItem("favStreams"));
if (notifiedList === null) {
  notifiedList = [];
}
var options = {};
var PREFERED_LANGUAGE = "broadcasterLanguage"

var streamResults = document.getElementById('stream-results');

var amazonSC2Server = 'https://bewareofcat.asuscomm.com/api/sc2/streams'
var starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100'


// Favorite a streamItem
streamResults.addEventListener('click', function(evt) {
  var item = evt.target;
  var data = item.getAttribute('data-stream-name');
  var obj = {};
  if (item.classList.contains('active-star')) {
    item.classList.remove('active-star');
    notifiedList = notifiedList.filter(function(obj) {
      return obj['stream-name'] != data;
    });
  } else if (item.classList.contains('fa-star')) {
    item.classList.add('active-star');
    obj['stream-name'] = data;
    obj['isNotified'] = false;
    notifiedList.push(obj);
  }
  localStorage.setItem('favStreams', JSON.stringify(notifiedList));
})

var checkBoxGetNotified = document.getElementById('checkbox-get-notified');
checkBoxGetNotified.onchange = function(evt) {
  localStorage.setItem('notifiedWhenOnline', checkBoxGetNotified.checked)
}

function loadLanguagePreferences() {
  if (localStorage.getItem(PREFERED_LANGUAGE)) {
    options.lang = localStorage.getItem(PREFERED_LANGUAGE);
    selectBroadcasterLanguage.value = options.lang;
  }
}

function loadPreferences() {
  notifiedWhenOnline = localStorage.getItem('notifiedWhenOnline');
  notifiedWhenOnline = JSON.parse(notifiedWhenOnline);
  checkBoxGetNotified.checked = notifiedWhenOnline;
  loadLanguagePreferences(options);
}

// Create the DOM element for a stream
function createStreamElement(stream, htmlContent) {
  if (stream) {
    htmlContent += '<div class="stream"><span class="first-row">' + '<i class="fa fa-star fa-lg" data-stream-name=' + stream.user_name + '></i><a class="stream-title" target="_blank" href="' + `https://twitch.tv/${stream.user_name}` + '">' + stream.user_name + '</a> - ' + stream.viewer_count.toLocaleString() + '<svg class="svg-glyph_live" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px"> <path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path> </svg></span><span>' + (stream.title != null ? stream.title.substring(0, 90) : '') + '</span> <div class="stream-logo" style="background-image:url()">' + '</div>';
    //Race icon if race found in stream status
    if (stream.title != null) {
      if (stream.title.match(/terran/i)) {
        htmlContent += '<div class="icon terran"></div>';
      }
      if (stream.title.match(/zerg/i)) {
        htmlContent += '<div class="icon zerg"></div>';
      }
      if (stream.title.match(/protoss/i) || stream.title.match(/(^|\W)toss($|\W)/i)) {
        htmlContent += '<div class="icon protoss"></div>';
      }
      if (stream.title.match(/random/i)) {
        htmlContent += '<div class="icon random"></div>';
      }
    }
    htmlContent += '</div>';
  }
  return htmlContent
}

// Receives json and parses it to content
function getStreamList(options) {
  var language = options.lang;

  fetch(amazonSC2Server)
    .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        document.getElementById('error-message').innerHTML = "There was a problem with the server. Author is working on a fix and migrating to a new server. Thank you for your patience"
        return;
      }
      response.json().then(function(res) {
        liveStreams = res.data;
        var favoriteNames = notifiedList.map(favoriteStream => favoriteStream['stream-name']);

        for (var stream of liveStreams) {
          if (language == "all" || stream.language === language || stream.language === language) {
            if (favoriteNames.includes(stream.user_name)) liveBroadcasterLanguageStreams.unshift(stream);
            else liveBroadcasterLanguageStreams.push(stream);
          }
        }
        var htmlContent = '';
        for (stream of liveBroadcasterLanguageStreams) {
          htmlContent = createStreamElement(stream, htmlContent)
        }

        streamResults.innerHTML = htmlContent;
        if (notifiedList != null) {
          for (var favoriteStream of notifiedList) {
            var streamItem = document.querySelector('[data-stream-name="' + favoriteStream['stream-name'] + '"]');
            streamItem.classList.add('active-star');
          }
        }
        document.getElementById('spinner').classList.add('hidden');
      })
    })
}


var optionIcon = document.getElementById('option-icon');
var optionPopup = document.getElementById('option-popup');
var closePopup = document.getElementById('close-popup');

optionIcon.addEventListener('click', function(evt) {
  optionPopup.classList.remove('hidden');
  optionPopup.classList.add('visible');
})

closePopup.addEventListener('click', function(evt) {
  optionPopup.classList.remove('visible');
  optionPopup.classList.add('hidden');
})

var selectBroadcasterLanguage = document.getElementById('select-broadcaster-language')

selectBroadcasterLanguage.onchange = function(evt) {
  liveBroadcasterLanguageStreams = [];
  var streamResults = document.getElementById('stream-results');
  streamResults.innerHTML = "";
  var broadcasterLanguage = selectBroadcasterLanguage.options[selectBroadcasterLanguage.selectedIndex].value;
  localStorage.setItem(PREFERED_LANGUAGE, broadcasterLanguage);

  options.lang = broadcasterLanguage
  getStreamList(options);
}

loadPreferences();
getStreamList(options);

//This is to communicate between popup.js and background.js (eventPage.js)
document.addEventListener('DOMContentLoaded', function() {});

// Google Analytics Tracking Code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-76976309-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
