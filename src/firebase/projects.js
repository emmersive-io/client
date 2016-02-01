var firebase = require('./connection');
var projectsRef = require('./connection').child('projects');

module.exports = {
    getById: function(projectId, callback){
        projectsRef.child(projectId).once('value', function(snapShot){
            callback(snapShot.val());
        });
    },

    getActivity: function (projectId, callback) {
        projectsRef.child(projectId).child('activities').once('value', function (snapShot) {
            callback(snapShot.val());
        });
    },

    getAll: function (callback) {
        projectsRef.once('value', function (snapShot) {
            callback(snapShot.val());
        });
    },

    getTasks: function (projectId, callback) {
        projectsRef.child(projectId).child('tasks').once('value', function (snapShot) {
            callback(snapShot.val());
        });
    },

    getPeople: function (projectId, callback) {

    }
};