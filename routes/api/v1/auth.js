const express = require('express');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const UsersController = require('../../../controllers/users.controller');
const { respond } = require('../../../helpers/response.helper');
const { createJWT, verifyJWT } = require('../../../helpers/auth.helper');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UsersController.getUserByUsernameAndPassword(username, password);

        if (!user) {
            return respond(res, NOT_FOUND);
        }

        respond(res, OK, {
            user,
            authToken: createJWT({
                sessionData: user,
                time: 3600
            })
        });
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const userData = req.body;
        const user = await UsersController.create(userData);

        respond(res, OK, {
            user,
            authToken: createJWT({
                sessionData: user,
                time: 3600
            })
        });
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/refreshAuthToken', async (req, res) => {
    try {
        const { user, authToken } = req.body;
        
        const decodedToken = await verifyJWT(authToken);

        if (decodedToken.data['_id'] !== user['_id']) {
            return respond(res, UNAUTHORIZED, 'Invalid auth jwt token.');
        }

        respond(res, OK, {
            user,
            authToken: createJWT({
                sessionData: user,
                time: 3600
            })
        });
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.patch('/resetPassword/:userId', async (req, res) => {
    try {
        const authToken = req.headers['auth-jwt-token'];
        
        const decodedToken = await verifyJWT(authToken);

        const { userId } = req.params;

        if (decodedToken.data['_id'] !== userId) {
            return respond(res, UNAUTHORIZED, 'Invalid auth jwt token.');
        }

        const { password } = req.body;
        const user = await UsersController.update(userId, { password });

        if (!user) {
            return respond(res, NOT_FOUND);
        }

        respond(res, OK);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});


module.exports = router;