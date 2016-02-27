$(document).ready(function() {
    var liveStreams = [];
    var liveBroadcasterLanguageStreams = [];

    var broadcasterLanguage = "fr"

    var openStreamLink = function(notificationId) {
        window.open(stream.channel.url, '_blank');
    }

    $.ajax({
        url: 'https://api.twitch.tv/kraken/search/streams?q=starcraft&limit=500',
        dataType: 'json',
        success: function(res) {
            liveStreams = res.streams;
            for (stream of liveStreams) {
                if (stream.channel.broadcaster_language === broadcasterLanguage)
                    liveBroadcasterLanguageStreams.push(stream);
            }
            console.log(liveBroadcasterLanguageStreams);
            for (stream of liveBroadcasterLanguageStreams) {
                $("#container").append("<div class='stream'><a class='stream-title' target='_blank' href='" + stream.channel.url + "'>" + stream.channel.display_name + "</a><span>" + stream.channel.status + "</span><span>Viewers: " + stream.viewers + "</span></div>");
            }
        },
        complete: function(res) {
            $(".spinner").hide();
            $(".stream").css('opacity', '1');
        },
        failure: function(res) {
            $("#container").append("failed");
        }
    });
});

/* This code is for when the user adds favorite streams and will be notified when they go online
chrome.notifications.onClicked.addListener(openStreamLink);
chrome.notifications.create(
    'Notification-test', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: stream.channel.display_name + "is online",
        message: "Click Me if you want to see the stream!"
    },

    function() {}

);
*/