const commentSchema = require('../models/blogComment');
const blogSchema = require('../models/blog');

const commentCreate = async (req, res) => {
  try {
    const blogIdCheck = await blogSchema.findOne({ _id: req.body.blogId });
    if (!blogIdCheck) {
      res.send({ message: "Blog Id not Valid", isSuccess: false });
    } else {
      const newblog = new commentSchema({
        content: req.body.content,
        userId: req.user.id,
        blogId: req.body.blogId,
      });
      newblog.save()
        .then(() => res.status(201).json({ message: "Comment Added Successfully", isSuccess: true }))
        .catch((error) => {
          res.send({ error, isSuccess: false });
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
};

const getAllComment = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    var perPage = req.query.perPage ? req.query.perPage : 25
    const data = await commentSchema
      .find()
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ '_id': -1 }).populate(["blogId", "userId"])
    const count = await commentSchema.find().count()
    res.status(201).send({
      message: "List of blogs",
      data,
      current: page,
      totalCount: count,
      pages: Math.ceil(count / perPage),
      isSuccess: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message, isSuccess: false });
  }
}

module.exports = {
  commentCreate,
  getAllComment
}
