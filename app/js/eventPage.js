var liveStreams = [];
var starcraft2URL = 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=100';

var openShiftSc2URL = "https://kuna-starcraft2.rhcloud.com/api/sc2/streams"

// For chrome badge
var grey = [66, 66, 66, 255];
var green = [0, 255, 0, 255];
var red = [255, 0, 0, 255];

/**
 * Formats numbers with k formatting ex: num = 1500 => 1.5k
 * @params {integer} num number to be formatted
 */
function kNumberFormatter(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num.toString()
}

/**
 * Sets the number on the badge with color depending on the number of viewers of the highest stream
 * @param {array} streams this is an array with all the streams received by the ajax request
 */
function setExtensionBadge(streams) {

    // Get the stream with the highest number of viewers
    var stream = streams.reduce(function (prev, curr) {
        return prev.viewers < curr.viewers ? curr : prev
    })

    var viewerCount = stream.viewers

    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });

    if (viewerCount < 5000) {
        chrome.browserAction.setBadgeBackgroundColor({ color: grey });
    }
    else if (viewerCount <= 15000) {
        chrome.browserAction.setBadgeBackgroundColor({ color: green });
    }
    else {
        chrome.browserAction.setBadgeBackgroundColor({ color: red });
    }

    chrome.browserAction.setBadgeText({ text: kNumberFormatter(viewerCount) });

}

function openStreamLink(streamLink) {
    window.open(streamLink, '_blank');
}


function checkFavoriteStreamChannels(link) {
    fetch(link, {headers: {
        'Client-ID' : 'd70esgd3z7nrisyuznehtqp8l5a1qeu'
    }}).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }
        response.json().then(function (res) {
            for (var stream of res.streams) {
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
        })
    })
}

function isStreamOnline(notifiedList) {
    var channels = "";
    var now = Date.now();
    if (notifiedList != null) {
        notifiedList.forEach(function (object, index) {
            if (!object['isNotified']) {
                channels += object['stream-name'] + ',';
                notifiedList[index]['isNotified'] = true;
                notifiedList[index]['notificationDate'] = new Date();
            }
            else {
                var pastNotificationTime = new Date(notifiedList[index]['notificationDate'])
                //Every hour reset notifications to be sent out
                if (now - pastNotificationTime.getTime() >= 3600000) {
                    notifiedList[index]['isNotified'] = false;
                    channels += object['stream-name'] + ','
                }
            }
        })
        localStorage.setItem('favStreams', JSON.stringify(notifiedList));
        var link = "https://api.twitch.tv/kraken/streams?stream_type=live&channel=" + channels;
        if(channels != ""){
            checkFavoriteStreamChannels(link);
        }
    }
}

function getAllStreams() {
    fetch(openShiftSc2URL).then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }
        response.json().then(function (res) {
            var currentLiveStreams = res.streams;
            setExtensionBadge(currentLiveStreams);
            var notifiedList = JSON.parse(localStorage.getItem("favStreams"));
            isStreamOnline(notifiedList)
        })
    })
}

chrome.runtime.onStartup.addListener(function () {
    console.log('Extension started up...');

})

chrome.notifications.onClicked.addListener(openStreamLink);

chrome.alarms.create("ajax", { delayInMinutes: 0, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(function (alarm) {
    getAllStreams()
})
