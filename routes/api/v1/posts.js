const express = require('express');
const PostsController = require('../../../controllers/posts.controller');
const { respond } = require('../../../helpers/response.helper');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await PostsController.getAll();
        respond(res, OK, posts);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const post = await PostsController.getById(id);

        if (!post) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, post);
        }
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.post('/', async (req, res) => {
    try {
        const postData = req.body;
        const post = await PostsController.create(postData);
        respond(res, OK, post);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        const post = await PostsController.update(id, postData);

        if (!post) {
            respond(res, NOT_FOUND);
        } else {
            respond(res, OK, post);
        }
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PostsController.delete(id);
        respond(res, OK);
    } catch (e) {
        console.error(e);
        respond(res, INTERNAL_SERVER_ERROR, e);        
    }
});

module.exports = router;