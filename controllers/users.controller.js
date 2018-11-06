const User = require('../schemas/user.schema');

class UsersController {
    static getAll(conditions) {
        return new Promise((resolve, reject) => {
            User.find(conditions, (err, users) => {
                if (err) {
                    console.error('Error while getting all users.', err);
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
    }

    static getById(id, conditions = {}) {
        return new Promise((resolve, reject) => {
            const queryConditions = Object.assign({ _id: id }, conditions);

            User.findOne(queryConditions, (err, user) => {
                if (err) {
                    console.error(`Error while getting user with id: ${id}.`, err);
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    static create(userData) {
        return new Promise((resolve, reject) => {
            User.create(userData, (err, user) => {
                if (err) {
                    console.error('Error while creating user.', err);
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    static update(id, userData, conditions = {}) {
        return new Promise((resolve, reject) => {
            const queryConditions = Object.assign({ _id: id }, conditions);

            User.findOneAndUpdate(queryConditions, userData, async err => {
                if (err) {
                    console.error(`Error while updating user with id: ${id}.`, err);
                    reject(err);
                } else {
                    try {
                        const user = await UsersController.getById(id);
                        resolve(user);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    static delete(id, conditions = {}) {
        return new Promise((resolve, reject) => {
            const queryConditions = Object.assign({ _id: id }, conditions);

            User.findOneAndDelete(queryConditions, err => {
                if (err) {
                    console.error(`Error while deleting user with id: ${id}.`, err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = UsersController;
