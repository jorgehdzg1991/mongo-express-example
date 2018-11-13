const express = require('express');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');
const UsersController = require('../../../controllers/users.controller');
const { respond } = require('../../../helpers/response.helper');
const { createJWT } = require('../../../helpers/auth.helper');

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

module.exports = router;