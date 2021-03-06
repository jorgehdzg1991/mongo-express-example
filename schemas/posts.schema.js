const mongoose = require('mongoose');

const attachmentSchema = mongoose.Schema({
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
});

const postSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [attachmentSchema],
    createDate: { type: Date, default: Date.now },
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;