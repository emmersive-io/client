import firebase from './ref';

function storeImage(path, file) {
    return new Promise((resolve, reject) => {
        var uploadTask = firebase.storage.child(path).put(file, {
            contentType: file.type
        });

        uploadTask.on('state_changed', null,
            error => reject(error),
            function () {
                var url = uploadTask.snapshot.metadata.downloadURLs[0];
                return firebase.root.child(path).set(url)
                    .then(() => resolve(url));
            });
    });
}

export {storeImage};