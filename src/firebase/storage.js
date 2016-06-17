import firebase from './ref';

function storeImage(path, file, metadata) {
    return new Promise((resolve, reject) => {
        var uploadTask = firebase.storage.child(path).put(file, metadata);
        uploadTask.on('state_changed', null,
            error => reject(error),
            function () {
                var url = uploadTask.snapshot.metadata.downloadURLs[0];
                firebase.root.child(path).set(url);
                return resolve(url);
            });
    });
}

export {storeImage};