const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Users = require('../schemas/users.schema');

class UsersController {
    static getAll() {
        return new Promise((resolve, reject) => {
            Users.find({}, {
                password: 0,
                __v: 0,
            }, (err, users) => {
                if (err) {
                    console.error('Error while getting all users.');
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            Users.findById(id, {
                password: 0,
                __v: 0,
            }, (err, user) => {
                if (err) {
                    console.error(`Error while getting user with id: ${id}.`);
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    static create(userData) {
        return new Promise((resolve, reject) => {
            Users.create(userData, (err, user) => {
                if (err) {
                    console.error('Error while creating user.');
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }

    static update(id, userData) {
        return new Promise((resolve, reject) => {
            Users.findByIdAndUpdate(id, userData, async err => {
                if (err) {
                    console.error(`Error while updating user with id: ${id}.`);
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
            Users.findByIdAndDelete(id, err => {
                if (err) {
                    console.error(`Error while deleting user with id: ${id}.`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getUserByIdWithPosts(id) {
        return new Promise((resolve, reject) => {
            Users
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
                        console.error(`Error while getting user with id: ${id}.`);
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
        });
    }

    static getUserByUsernameAndPassword(username, password) {
        return new Promise((resolve, reject) => {
            Users.find()
                .select({ password: 0, __v: 0 })
                .and([{ username }, { password }])
                .hint({ username: 1, password: 1 })
                .exec((err, result) => {
                    if (err) {
                        console.error(`Error while getting user with username: ${username}.`);
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
        });
    }

    static searchUsers(searchText) {
        return new Promise((resolve, reject) => {
            Users.find({ $text: { $search: searchText } })
                .select({ password: 0, __v: 0 })
                .exec((err, result) => {
                    if (err) {
                        console.error(`Error while searching users with text "${searchText}".`);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
        });
    }
}

module.exports = UsersController;
