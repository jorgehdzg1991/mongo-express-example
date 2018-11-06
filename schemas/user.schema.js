const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, min: 18, max: 99, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
});

userSchema.index({ username: 1, password: 1 });

const User = mongoose.model('Users', userSchema);

module.exports = User;