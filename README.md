[![Build Status](https://semaphoreci.com/api/v1/projects/cae233af-d75e-4ed0-ae50-5c2b95957111/704855/badge.svg)](https://semaphoreci.com/bruceio/client)

## Web interface setup
Install webpack  
`npm install -g webpack`  

Install a server, if you don't have one or aren't going to use [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)  
`npm install -g http-server`  

Install application dependencies  
`npm install`

Run a debug build and starts a server at localhost:8080 using `http-server`  
`npm start`  

Run a debug build (file watcher, source maps, non-minified)  
`webpack -d --watch --progress`

Run a release build (minified)  
`webpack -p --progress`

The build outputs files in the `www` folder, which Cordova uses to create the native installers. Run a server here to access the site locally. 

## Building and running the native interface
Install Cordova  
`npm install -g cordova`  

Add necessary platforms and plugins  
`cordova platforms add ios`  
`cordova platforms add android`  

`cordova plugin add org.apache.cordova.console`  
`cordova plugin add org.apache.cordova.device`  
`cordova plugin add org.apache.cordova.splashscreen`  
`cordova plugin add org.apache.cordova.statusbar`  
`cordova plugin add org.apache.cordova.whitelist`  

Build an installer  
`cordova build ios`  
`cordova build android`  

Run an emulator  
`cordova emulate ios`
`cordova emulate android`

##Deploying to firebase
Install [firebase tools](https://www.firebase.com/docs/hosting/quickstart.html)
`npm install -g firebase-tools`

Optimize the codebase  
`webpack -p`

Upload to firebase  
`firebase deploy` (to emmersive-dev)

Upload to different environment in firebase  
`firebase deploy -f emmersive-stage` (staging)  
`firebase deploy -f flickering-infero-1351` (production)

#### Other Dependencies
* Node.js 4.x
* Android
  * Oracle jdk 7 (Android)
    * JAVA_HOME=/path/to/java
    * PATH=$JAVA_HOME/bin:$PATH
  * Android stand-alone sdk tools r24.x (Android)
    * ANDROID_HOME=/path/to/android-sdk
    * ANDROID_SDK_ROOT=/path/to/android-sdk
    * PATH=$ANDROID_HOME/platform-tools:$PATH
    * PATH=$ANDROID_HOME/tools:$PATH
    * PATH=$ANDROID_HOME/build-tools/23.0.2:$PATH
    * `android list targets | grep 22` -> get ID for next line
    * `android create avd -n cordova -t 22 -b google_apis/x86_64`

#### Android debug from chrome!
In chrome, you can load the dev tools and point it at the app just like you
would normally debug a web page. This will give you access to the javascript
console, network, dom inspector, etc.

* Become a developer
  * Go to settings
  * About phone
  * Tab the "Build number" about 7 times
* Enable debug
  * Go to settings
  * Developer Options
  * Enable "USB debugging"
* Trust your machine
  * Plug in phone
  * Accept prompt on phone
* Point the debugger at your phone
  * Bring up dev tools as usual (CTRL+SHIFT+I except on mac)
  * Click the "..." next the the close(x) button on the top right.
  * Click "Inspect Devices"
  * Launch app on phone
  * Click the app on the device list in chrome
