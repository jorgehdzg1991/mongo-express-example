const express = require('express');
const UsersController = require('../../../controllers/users.controller');
const respond = require('../../../helpers/response.helper');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UsersController.getUserByUsernameAndPassword(username, password);

        if (!user) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, user);
        }
    } catch (e) {
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

module.exports = router;