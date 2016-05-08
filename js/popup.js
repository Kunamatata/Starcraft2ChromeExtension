"use strict";

var liveStreams = [];
var liveBroadcasterLanguageStreams = [];

var broadcasterLanguage = "fr";
var notifiedWhenOnline;

var notifiedList = JSON.parse(localStorage.getItem("favStreams"));
if (notifiedList === null) {
    notifiedList = [];
}


function checkStreamsAjax(link) {
    $.ajax({
        url: link,
        dataType: 'json',
        success: function (res) {
            console.log(res);
            for (var stream of res.streams) {
                console.log(notifiedList);
                chrome.notifications.create(
                    stream.channel.url, {
                        type: 'basic',
                        iconUrl: stream.channel.logo,
                        title: stream.channel.display_name + "is online",
                        message: "Click me to see the stream!"
                    },
                    function () { }
                );
            }
        },
        error: function (res) { },
        complete: function (res) { },
    });
};

function openStreamLink(streamLink) {
    window.open(streamLink, '_blank');
};

function isStreamOnline(notifiedList) {
    var channels = "";
    for (var object of notifiedList) {
        channels += object['stream-name'] + ",";
    }
    var link = "https://api.twitch.tv/kraken/streams?stream_type=live&channel=" + channels;

    link = link.slice(0, -1);
    checkStreamsAjax(link);
};

// Favorite a stream
$('#stream-results').on('click', '.fa.fa-star', function (event) {
    var data = $(this).data("stream-name");
    var obj = {};
    if ($(this).hasClass('active-star')) {
        $(this).removeClass('active-star');
        notifiedList = notifiedList.filter(function (obj) {
            return obj['stream-name'] != data;
        });
    } else {
        $(this).addClass('active-star');
        obj['stream-name'] = data;
        obj['isNotified'] = false;
        notifiedList.push(obj);
        isStreamOnline(notifiedList);
    }
    localStorage.setItem("favStreams", JSON.stringify(notifiedList));
});

$("#checkbox-get-notified").change(function (event) {
    if ($(this).prop("checked") === true) {
        localStorage.setItem("notifiedWhenOnline", true);
    } else {
        localStorage.setItem("notifiedWhenOnline", false);
    }
});

function loadPreferences() {
    notifiedWhenOnline = localStorage.getItem('notifiedWhenOnline');
    notifiedWhenOnline = JSON.parse(notifiedWhenOnline);
    $("#checkbox-get-notified").prop("checked", notifiedWhenOnline);
};

// Create the DOM element for a stream
function createStreamElement(stream, htmlContent) {
    if (stream.channel) {
        htmlContent += '<div class="stream"><a class="stream-title" target="_blank" href="' + stream.channel.url + '">' + stream.channel.display_name + '</a><span>' + stream.channel.status.substring(0, 90) + '</span><span>Viewers: ' + stream.viewers + '</span> <div class="stream-logo" style="background-image:url(' + stream.channel.logo + ')"></div><i class="fa fa-star fa-lg" data-stream-name=' + stream.channel.display_name + '></i>';
        //Race icon if race found in stream status
        if (stream.channel.status != null) {
            if (stream.channel.status.match("[tT][eE][rR][rR][aA][nN]")) {
                htmlContent += '<div class="icon terran"></div>';
            }
            if (stream.channel.status.match("[zZ][eE][rR][gG]")) {
                htmlContent += '<div class="icon zerg"></div>';
            }
            if (stream.channel.status.match("[pP][rR][oO][tT][oO][sS][sS]")) {
                htmlContent += '<div class="icon protoss"></div>';
            }
        }
        htmlContent += '</div>';
    }
    return htmlContent
}

// Receives json and parses it to content
function getStreamList(language) {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=500',
        dataType: 'json',
        success: function (res) {
            liveStreams = res.streams;
            for (var stream of liveStreams) {
                if (stream.channel.broadcaster_language === language || stream.channel.language === language)
                    liveBroadcasterLanguageStreams.push(stream);
            }
            console.log(liveBroadcasterLanguageStreams);
            var htmlContent = '';
            for (stream of liveBroadcasterLanguageStreams) {
                htmlContent = createStreamElement(stream, htmlContent)
            }


            $("#stream-results").html(htmlContent);
            if (notifiedList != null)
                for (var favoriteStream of notifiedList) {
                    var elem = $("[data-stream-name*='" + favoriteStream['stream-name'] + "']");
                    elem.addClass("active-star");
                }
        },
        error: function (res) {
            console.log("Are you sure you are connected?");
        },
        complete: function (res) {
            $(".spinner").hide();
            $(".stream").css('opacity', '1');
        },
        timeout: 5000
    });
};



$("#option-icon").click(function (event) {
    $("#option-popup").css({
        visibility: 'visible',
        opacity: '1',
        'z-index': '1'
    });
});

$("#close-popup").click(function (event) {
    $("#option-popup").css({
        visibility: 'hidden',
        opacity: '0',
        'z-index': '-1'
    });
});


$('#select-broadcaster-language').change(function () {
    liveBroadcasterLanguageStreams = [];
    $("#stream-results").html("");
    broadcasterLanguage = $(this).val();
    getStreamList(broadcasterLanguage);
});

chrome.notifications.onClicked.addListener(openStreamLink);

localStorage.setItem("broadcasterLanguage", broadcasterLanguage);

loadPreferences();

document.addEventListener('DOMContentLoaded', function () {


});

// Google Analytics Tracking Code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-76976309-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();