const jwt = require('jsonwebtoken');
const _ = require('lodash');

function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
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

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 3600
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
            expiresIn: details.maxAge,
            algorithm: 'HS256'
        }
    );

    return token;
}

module.exports = {
    verifyJWT,
    createJWT
};
