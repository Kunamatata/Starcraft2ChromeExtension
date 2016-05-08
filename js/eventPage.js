var liveStreams = [];


function getStreamList(language) {
    $.ajax({
        url: 'https://api.twitch.tv/kraken/streams?game=StarCraft+II&limit=500',
        dataType: 'json',
        success: function (res) {
            currentLiveStreams = res.streams;
            // console.log("Difference", _.difference(liveStreams, localStorage.getItem("previousStreamSnapshot")))
            // localStorage.setItem("previousStreamSnapshot", JSON.stringify(liveStreams));
            // console.log(localStorage.getItem("previousStreamSnapshot"))
            console.log(liveStreams.length)
            console.log(
                currentLiveStreams.filter(function (value) {
                   return oldStreamList.filter(function(val){
                       return value.channel._id === val.channel._id
                   }).length == 0
                }))

        },
        error: function (res) {
            console.log("Are you sure you are connected?");
        },
        timeout: 5000
    });
};

chrome.runtime.onStartup.addListener(function () {
    console.log('Extension started up...');

});
chrome.alarms.create("ajax", { delayInMinutes: 0, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(function (alarm) {
    getStreamList("")
});
