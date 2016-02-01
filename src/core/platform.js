require('./onReady')(function () {
    var userAgent = navigator.userAgent;
    var platformTraits = {
        chrome: /webkit\W.*(chrome|chromium)\W/i.test(userAgent),
        firefox: /mozilla.*\Wfirefox\W/i.test(userAgent),
        ie: (navigator.appName === 'Microsoft Internet Explorer' || /\bTrident\b/.test(userAgent)),
        safari: /webkit\W(?!.*chrome).*safari\W/i.test(userAgent),

        android: /android/i.test(userAgent),
        ios: /(ipad|iphone|ipod)/i.test(userAgent),
        mobile: /(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i.test(userAgent),
        tablet: /(ipad|android(?!.*mobile)|tablet)/i.test(userAgent)
    };

    document.body.className = Object.keys(platformTraits).filter(function (trait) {
        return platformTraits[trait];
    }).join(' ');
});