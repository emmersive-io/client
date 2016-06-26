function storeImage(session, path, file) {
    return new Promise((resolve, reject) => {
        var uploadTask = session.storage.child(path).put(file, {
            contentType: file.type
        });

        uploadTask.on('state_changed', null,
            error => reject(error),
            function () {
                var url = uploadTask.snapshot.metadata.downloadURLs[0];
                return session.root.child(path).set(url).then(() => resolve(url));
            });
    });
}

export {storeImage};