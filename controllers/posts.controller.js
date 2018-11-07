const Post = require('../schemas/posts.schema');

class PostsController {
    static getAll(conditions) {
        return new Promise((resolve, reject) => {
            Post.find(conditions, (err, posts) => {
                if (err) {
                    console.error('Error while getting all posts.', err);
                    reject(err);
                } else {
                    resolve(posts);
                }
            });
        });
    }

    static getById(id, conditions = {}) {
        return new Promise((resolve, reject) => {
            const queryConditions = Object.assign({ _id: id }, conditions);

            Post.findOne(queryConditions, (err, post) => {
                if (err) {
                    console.error(`Error while getting post with id: ${id}.`, err);
                    reject(err);
                } else {
                    resolve(post);
                }
            });
        });
    }

    static create(postData) {
        return new Promise((resolve, reject) => {
            Post.create(postData, (err, post) => {
                if (err) {
                    console.error('Error while creating post.', err);
                    reject(err);
                } else {
                    resolve(post);
                }
            });
        });
    }

    static update(id, postData, conditions = {}) {
        return new Promise((resolve, reject) => {
            const queryConditions = Object.assign({ _id: id }, conditions);

            Post.findOneAndUpdate(queryConditions, postData, async err => {
                if (err) {
                    console.error(`Error while updating post with id: ${id}.`, err);
                    reject(err);
                } else {
                    try {
                        const post = await PostsController.getById(id);
                        resolve(post);
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

            Post.findOneAndDelete(queryConditions, err => {
                if (err) {
                    console.error(`Error while deleting post with id: ${id}.`, err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = PostsController;
