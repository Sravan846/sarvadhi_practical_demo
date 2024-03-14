const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment.controller');

router.post('/add', auth, commentController.commentCreate);
router.get('/', auth, commentController.getAllComment);

module.exports = router;
