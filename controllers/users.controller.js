const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../schemas/user.schema');

class UsersController {
    static getAll() {
        return new Promise((resolve, reject) => {
            User.find({}, {
                password: 0,
                __v: 0,
            }, (err, users) => {
                if (err) {
                    console.error('Error while getting all users.', err);
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            User.findById(id, {
                password: 0,
                __v: 0,
            }, (err, user) => {
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

    static update(id, userData) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(id, userData, async err => {
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

    static delete(id) {
        return new Promise((resolve, reject) => {
            User.findByIdAndDelete(id, err => {
                if (err) {
                    console.error(`Error while deleting user with id: ${id}.`, err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getUserWithPosts(id) {
        return new Promise((resolve, reject) => {
            User
                .aggregate([
                    {
                        $match: { _id: ObjectId(id) },
                    },
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'posts',
                        }
                    },
                    {
                        $project: {
                            password: 0,
                            __v: 0,
                            'posts.__v': 0,
                        }
                    },
                ])
                .exec((err, result) => {
                    if (err) {
                        console.error(`Error while getting user with id: ${id}.`, err);
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
        });
    }

    static getUserByUsernameAndPassword(username, password) {
        return new Promise((resolve, reject) => {
            const query = User.find();
            query.select({ password: 0, __v: 0 });
            query.and([{ username }, { password }]);
            query.hint({ username: 1, password: 1 });
            query.exec((err, result) => {
                if (err) {
                    console.error(`Error while getting user with username: ${username}.`, err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }
}

module.exports = UsersController;
