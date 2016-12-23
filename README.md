[![Build Status](https://travis-ci.org/Kunamatata/Starcraft2ChromeExtension.svg?branch=master)](https://travis-ci.org/Kunamatata/Starcraft2ChromeExtension)

# This is the ReactJS rewrite branch for Starcraft 2 Streams
---
Everthing in this branch is in progress. The goal is to rewrite the correct extension with ReactJS.

The reasons behind this decision are :
- More maintainable and modular code
- Use of components to seperate concerns
- A faster and more responsive extension


# Chrome Extension for Starcraft 2 Streams
---
Get your Starcraft 2 streams quickly with this extensions. Get notified when your favorite streamers get online!

Tons of new features to come!

## Setup
1. `npm install`
2. `npm install webpack webpack-dev-server -g`
3. `npm run client` To start the webpack-dev-server 

Dist is never pushed to github since it's something you can build

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## TODO
1. Rewrite existing extension on master branch with ReactJS
2. Add a notification system with background event page.
3. Implement options such as getting notified or not / Themes etc...