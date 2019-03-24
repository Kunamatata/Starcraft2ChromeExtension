import config from './config/config';

const { STARCRAFT_API_URL } = config;

// For chrome badge
const grey = [66, 66, 66, 255];
const green = [0, 255, 0, 255];
const red = [255, 0, 0, 255];

/**
 * Formats numbers with k formatting ex: num = 1500 => 1.5k
 * @params {integer} num number to be formatted
 */
function kNumberFormatter(num) {
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num.toString();
}

/**
 * Sets the number on the badge with color depending on the number of viewers of the highest stream
 * @param {array} streams this is an array with all the streams received by the ajax request
 */
function setExtensionBadge(streams) {
  // Get the stream with the highest number of viewers
  const stream = streams.reduce((prev, curr) => (prev.viewers < curr.viewers ? curr : prev));

  const viewerCount = stream.viewers;

  chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });

  if (viewerCount < 5000) {
    chrome.browserAction.setBadgeBackgroundColor({ color: grey });
  } else if (viewerCount <= 15000) {
    chrome.browserAction.setBadgeBackgroundColor({ color: green });
  } else {
    chrome.browserAction.setBadgeBackgroundColor({ color: red });
  }

  chrome.browserAction.setBadgeText({ text: kNumberFormatter(viewerCount) });
}

function openStreamLink(streamLink) {
  console.log(streamLink);
  window.open(streamLink, '_blank');
}


function createStreamNotification(streams) {
  console.log('notifying');
  Object.keys(stream).forEach((key) => {
    const stream = streams[key];
    chrome.notifications.create(
      stream.url, {
        type: 'basic',
        iconUrl: stream.logo,
        title: `${key}is online`,
        message: 'Click me to see the stream!',
      },
      (notificationId) => {
        console.log(notificationId);
      },
    );
  });
}

function isStreamOnline(favoriteStreams, streams) {
  const now = Date.now();
  if (favoriteStreams != null) {
    const streamsToNotify = Object.keys(favoriteStreams).reduce((prev, curr) => {
      if ((now - favoriteStreams[curr].lastNotificationDate) >= 60 * 60 * 1000) {
        console.log(now - favoriteStreams[curr].lastNotificationDate);
        console.log(curr);
        prev[curr] = favoriteStreams[curr];
      }
      return prev;
    }, {});
    console.log('Streams to notify from favoriteStreams');
    console.log(streamsToNotify);

    const liveStreams = streams.reduce((prev, curr) => {
      prev[curr.channel.display_name] = curr.channel.display_name;
      return prev;
    }, {});
    console.log('live streams');
    console.log(liveStreams);

    const liveStreamsToNotify = Object.keys(streamsToNotify).reduce((prev, curr) => {
      if (liveStreams[curr] != null) {
        streamsToNotify[curr].lastNotificationDate = now;
        prev[curr] = streamsToNotify[curr];
      }
      return prev;
    }, {});

    if (Object.keys(liveStreamsToNotify).length !== 0) {
      console.log('live streams to notify');
      console.log(liveStreamsToNotify);

      console.log('spread object');
      chrome.storage.sync.set({ favoriteStreams: { ...favoriteStreams, ...liveStreamsToNotify } }, () => {
        console.log('saved');
      });

      createStreamNotification(liveStreamsToNotify);
    }
  }
}

function getStreamList() {
  fetch(STARCRAFT_API_URL).then((response) => {
    if (response.status !== 200) {
      console.log(`Looks like there was a problem. Status Code: ${
        response.status}`);
      return;
    }
    response.json().then((data) => {
      const { streams } = data;
      setExtensionBadge(streams);
      chrome.storage.sync.get('favoriteStreams', (result) => {
        console.log(result);
        const { favoriteStreams } = result;
        isStreamOnline(favoriteStreams, streams);
      });
    });
  });
}

chrome.notifications.onClicked.addListener(openStreamLink);

chrome.alarms.create('ajax', { delayInMinutes: 0, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  getStreamList();
});

getStreamList();
