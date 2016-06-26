import {toObj} from '../utility/transform';

export default class UserCache {
    constructor({root}) {
        this.cache = {};
        this.usersRef = root.child('users');
    }

    get(userId) {
        var promise = this.cache[userId];
        if (!promise) {
            promise = this.usersRef.child(userId).once('value').then(snapshot => {
                const user = toObj(snapshot);
                this.cache[userId] = Promise.resolve(user);
                return user;
            });

            this.cache[userId] = promise;
        }

        return promise;
    }
};