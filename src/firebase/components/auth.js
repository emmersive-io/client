export default {
    createUser: function (authObj) {
        const {name, email, password} = authObj;
        return this.auth.createUserWithEmailAndPassword(email, password)
            // Create a user entry
            .then(user => this.root.child('users/' + user.uid).set({
                provider: 'password',
                email: email,
                name: name
            }))
            // Automatically log the user in
            .then(() => this.login(authObj));
    },

    login({email, password}) {
        return this.auth.signInWithEmailAndPassword(email, password);
    },

    logOut() {
        return this.auth.signOut();
    },

    resetPassword: function (email) {
        return this.auth.sendPasswordResetEmail(email);
    }
}