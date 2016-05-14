var liveStreams = [];
// For chrome badge
var grey = [0, 0, 0, 255]
var green = [0, 255, 0, 255]
var red = [255, 0, 0, 255]


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

function getAllStreams() {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=500',
        dataType: 'json',
        success: function (res) {
            currentLiveStreams = res.streams;
            setExtensionBadge(currentLiveStreams);
            var previousLiveStreams = localStorage.getItem("previousLiveStreams");

            compareStreams(currentLiveStreams, JSON.parse(previousLiveStreams));

            localStorage.setItem("previousLiveStreams", JSON.stringify(currentLiveStreams));
        },
        error: function (res) {
            console.log("Are you sure you are connected?");
        },
        timeout: 5000
    });
};

function checkFavoriteStreams(streamDifference, favoriteList){
    var notifyList = streamDifference.filter(function(value){
        return favoriteList.filter(function(val){
            return value.channel._id === val.channel._id
        })
    })
    console.log(favoriteList)
    console.log(notifyList)
}

function compareStreams(currentList, oldList) {
    // console.log(currentList);
    // console.log(oldList)
    var streamDifference = currentList.filter(function (value) {
        return oldList.filter(function (val) {
            return value.channel._id === val.channel._id
        }).length == 0
    })
    console.log(streamDifference.length)
    // If there is a difference in the list check favorite streamerList
    
    var favoriteList = JSON.parse(localStorage.getItem("favStreams"));
    
    if (streamDifference.length > 0 && favoriteList) {
        checkFavoriteStreams(streamDifference, JSON.parse(localStorage.getItem("favStreams")));
    }
}

chrome.runtime.onStartup.addListener(function () {
    console.log('Extension started up...');

});
chrome.alarms.create("ajax", { delayInMinutes: 0, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(function (alarm) {
    getAllStreams()
});
