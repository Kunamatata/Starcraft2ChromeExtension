$(document).ready(function() {
    var liveStreams = [];
    var liveBroadcasterLanguageStreams = [];

    var broadcasterLanguage = "fr"
    var notifiedWhenOnline;



    var openStreamLink = function(notificationId) {
        window.open(stream.channel.url, '_blank');
    }


    $("#checkbox-get-notified").change(function(event) {
        if ($(this).prop("checked") === true) {
            localStorage.setItem("notifiedWhenOnline", true);
        } else {
            localStorage.setItem("notifiedWhenOnline", false);
        }
    });

    var loadPreferences = function() {
        notifiedWhenOnline = localStorage.getItem('notifiedWhenOnline');
        notifiedWhenOnline = JSON.parse(notifiedWhenOnline);
        $("#checkbox-get-notified").prop("checked", notifiedWhenOnline);
    }

    var getStreamList = function(language) {
        $.ajax({
            url: 'https://api.twitch.tv/kraken/search/streams?q=starcraft&limit=500',
            dataType: 'json',
            success: function(res) {
                liveStreams = res.streams;
                for (stream of liveStreams) {
                    if (stream.channel.broadcaster_language === language || stream.channel.language === language)
                        liveBroadcasterLanguageStreams.push(stream);
                }
                console.log(liveBroadcasterLanguageStreams);
                for (stream of liveBroadcasterLanguageStreams) {
                    console.log(stream.channel.logo)
                    $("#stream-results").append('<div class="stream"><a class="stream-title" target="_blank" href="' + stream.channel.url + '">' + stream.channel.display_name + '</a><span>' + stream.channel.status + '</span><span>Viewers: ' + stream.viewers + '</span> <div class="stream-logo" style="background-image:url(' + stream.channel.logo + ')"></div></div>');
                    //Race icon if race found in stream status
                    //stream.channel.status.match("[zZ]erg");
                }
            },
            error: function(res) {
                $("#container").append("failed");
            },
            complete: function(res) {
                $(".spinner").hide();
                $(".stream").css('opacity', '1');
            },
        });
    };
    localStorage.setItem("broadcasterLanguage", broadcasterLanguage);
    $('#select-broadcaster-language').change(function() {

        liveBroadcasterLanguageStreams = [];
        $("#stream-results").html("");
        broadcasterLanguage = $(this).val();
        getStreamList(broadcasterLanguage);


    });

    $("#option-icon").click(function(event) {
        $("#option-popup").css({
            visibility: 'visible',
            opacity: '1',
            'z-index': '1'
        });
    });

    $("#close-popup").click(function(event) {
        $("#option-popup").css({
            visibility: 'hidden',
            opacity: '0',
            'z-index': '-1'
        });
    });

    loadPreferences();
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
