const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const blogController = require('../controllers/blog.controller');
const upload = require("../config/multer");
const { blogSchema } = require("../middleware/validator");

router.post('/add', [auth, upload.fields([{
    name: 'blog',
    maxCount: 10
}]), blogSchema], blogController.blogCreate);
router.get('/', auth, blogController.getAllblog);
router.put("/:id", [auth,], blogController.blogUpdate);
router.delete('/:id', auth, blogController.blogDelete);
router.get("/blogLike", auth, blogController.blogLike);
router.get("/blogDislike", auth, blogController.blogDislike);
router.get("/:id", auth, blogController.blogById);
module.exports = router;
