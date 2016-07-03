[![Build Status](https://semaphoreci.com/api/v1/projects/cae233af-d75e-4ed0-ae50-5c2b95957111/704855/badge.svg)](https://semaphoreci.com/bruceio/client)

#### To develop locally
* Run `npm install`
* Run `npm start`
* Open [localhost:5000](http://localhost:5000)

#### List of commands
Command                | Description
                   --- | ---
**npm install**        | Install dependencies
npm run build:dev      | Output dev codebase 
npm run build:prod     | Output optimized codebase
npm run build:watch    | Output dev and watch for changes
npm run deploy:login   | Login to firebase
npm run deploy:logout  | Logout of firebase
**npm run deploy**     | Build and deploy code to dev
npm run deploy:prod    | Build and deploy code to prod
npm run deploy:staging | Build and deploy code to staging
npm run serve          | Start a web server at localhost:5000
**npm start**          | Shortcut for build:watch and serve

#### Building and running the native interface
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