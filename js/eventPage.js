chrome.runtime.onStartup.addListener(function() {
    console.log('Extension started up...');

});
chrome.alarms.create("coucou", { delayInMinutes: 0, periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("")
});
