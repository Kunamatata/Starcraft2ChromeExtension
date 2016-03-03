$(document).ready(function() {
    var liveStreams = [];
    var liveBroadcasterLanguageStreams = [];

    var broadcasterLanguage = "fr"
    var notifiedWhenOnline;

    //localstroage array
    var notifiedList = JSON.parse(localStorage.getItem("favStreams"));
    if(notifiedList == null)
        notifiedList = [];
    var checkStreamsAjax = function(link) {
        $.ajax({
            url: link,
            dataType: 'json',
            success: function(res) {
                console.log(res)
                for (stream of res.streams) {
                    console.log(notifiedList);
                    chrome.notifications.create(
                        'Notification-test', {
                            type: 'basic',
                            iconUrl: 'img/icon.png',
                            title: stream.channel.display_name + "is online",
                            message: "Click Me if you want to see the stream!"
                        },
                        function() {}

                    );
                }
            },
            error: function(res) {},
            complete: function(res) {},
        });
    };

    var openStreamLink = function(notificationId) {
        window.open(stream.channel.url, '_blank');
    }

    var isStreamOnline = function(notifiedList) {
        var channels = "";
        for (object of notifiedList) {
            channels += object['stream-name'] + ",";
        }
        var link = "https://api.twitch.tv/kraken/streams?stream_type=live&channel=" + channels;

        //Remove last comma
        link = link.slice(0, -1);
        checkStreamsAjax(link);
    }

    $('#stream-results').on('click', '.fa.fa-star', function(event) {
        var data = $(this).data("stream-name");
        var obj = {};
        if ($(this).hasClass('active-star')) {
            $(this).removeClass('active-star');
            notifiedList = notifiedList.filter(function(obj) {
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
            url: 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=500',
            dataType: 'json',
            success: function(res) {
                liveStreams = res.streams;
                for (stream of liveStreams) {
                    if (stream.channel.broadcaster_language === language || stream.channel.language === language)
                        liveBroadcasterLanguageStreams.push(stream);
                }
                console.log(liveBroadcasterLanguageStreams);
                for (stream of liveBroadcasterLanguageStreams) {
                    console.log(stream);
                    $("#stream-results").append('<div class="stream"><a class="stream-title" target="_blank" href="' + stream.channel.url + '">' + stream.channel.display_name + '</a><span>' + stream.channel.status + '</span><span>Viewers: ' + stream.viewers + '</span> <div class="stream-logo" style="background-image:url(' + stream.channel.logo + ')"></div><i class="fa fa-star fa-lg" data-stream-name=' + stream.channel.display_name + '></i></div>');
                    //Race icon if race found in stream status
                    //stream.channel.status.match("[zZ]erg");
                }
                if (notifiedList != null)
                    for (favoriteStream of notifiedList) {
                        var elem = $("[data-stream-name*='" + favoriteStream['stream-name'] + "']");
                        elem.addClass("active-star");
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


    $('#select-broadcaster-language').change(function() {
        liveBroadcasterLanguageStreams = [];
        $("#stream-results").html("");
        broadcasterLanguage = $(this).val();
        getStreamList(broadcasterLanguage);
    });

    chrome.notifications.onClicked.addListener(openStreamLink);

    localStorage.setItem("broadcasterLanguage", broadcasterLanguage);


    loadPreferences();
});
