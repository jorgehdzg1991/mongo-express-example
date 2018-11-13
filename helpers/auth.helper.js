const jwt = require('jsonwebtoken');
const _ = require('lodash');

function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err);
            }
            resolve(decodedToken);
        });
    });
}

function createJWT(details) {
    if (typeof details !== 'object') {
        details = {};
    }

    if (!details.time || typeof details.time !== 'number') {
        details.time = 3600
    }

    details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            memo[key] = val
        }
        return memo
    }, {});

    let token = jwt.sign(
        {
            data: details.sessionData
        },
        process.env.JWT_SECRET,
        {
            expiresIn: details.time,
            algorithm: 'HS256'
        }
    );

    return token;
}

module.exports = {
    verifyJWT,
    createJWT
};
