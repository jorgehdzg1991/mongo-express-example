const express = require('express');
const UsersController = require('../../../controllers/users.controller');
const { respond } = require('../../../helpers/response.helper');
const { verifyJWTMiddleware } = require('../../../middleware/request.middleware');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');

const router = express.Router();

router.all('*', verifyJWTMiddleware);

router.get('/', async (req, res) => {
    try {
        const users = await UsersController.getAll();
        respond(res, OK, users);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UsersController.getById(id);

        if (!user) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, user);
        }
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        const user = await UsersController.create(userData);
        respond(res, OK, user);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const user = await UsersController.update(id, userData);

        if (!user) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, user);
        }
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await UsersController.delete(id);
        respond(res, OK);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UsersController.getUserByIdWithPosts(id);

        if (!user) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, user);
        }
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/search', async (req, res) => {
    try {
        const { page, take } = req.body;

        const users = await UsersController
            .searchUsersPaginated('', page, take);

        respond(res, OK, users);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.get('/search/:searchText', async (req, res) => {
    try {
        const { searchText } = req.params;
        const users = await UsersController.searchUsers(searchText);
        respond(res, OK, users);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/search/:searchText', async (req, res) => {
    try {
        const { searchText } = req.params;
        const { page, take } = req.body;

        const users = await UsersController
            .searchUsersPaginated(searchText, page, take);

        respond(res, OK, users);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

module.exports = router;