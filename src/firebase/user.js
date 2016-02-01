var firebase = require('./connection');

module.exports = {
    changePassword: function (email, oldPassword, newPassword) {
        firebase.changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        }, function (error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error changing password:", error);
                }
            }
            else {
                alert("User password changed successfully!");
            }
        });
    },

    resetPassword: function () {
        firebase.resetPassword();
    }
};