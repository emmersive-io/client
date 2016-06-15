import defaultIcon from '../images/no_projects.png';

function requestPermission() {
    if (window.Notification) {
        return window.Notification.requestPermission();
    }

    return Promise.reject('Not supported');
}

function notify(title, body, tag) {
    return requestPermission().then(function (result) {
        if (result === 'granted') {
            return new Notification(title, {
                body: body,
                icon: defaultIcon,
                renotify: tag != null,
                tag: tag
            });

        }

        return Promise.reject(result);
    });
}


export {notify, requestPermission}