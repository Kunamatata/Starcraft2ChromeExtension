let STARCRAFT_API_URL = 'http://bewareofcat.asuscomm.com:3000/api/sc2/streams';

if (process.env.NODE_ENV === 'dev') {
  STARCRAFT_API_URL = 'http://localhost:3000/api/sc2/streams';
}

const config = {
  STARCRAFT_API_URL,
  supportedLanguages: [
    { abbr: 'all', caption: 'All' },
    { abbr: 'en', caption: 'English' },
    { abbr: 'fr', caption: 'French' },
    { abbr: 'ko', caption: 'Korean' },
    { abbr: 'pl', caption: 'Polish' },
    { abbr: 'de', caption: 'German' },
    { abbr: 'es', caption: 'Spanish' },
    { abbr: 'zh', caption: 'Chinese' },
    { abbr: 'ru', caption: 'Russian' },
    { abbr: 'nl', caption: 'Dutch' },
  ],
};

export default config;
