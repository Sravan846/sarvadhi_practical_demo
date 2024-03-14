const blogSchema = require('../models/blog');

const blogCreate = async (req, res) => {
  try {
    let images = []
    req.files.blog.forEach((item) => {
      images.push(`${process.env.IMAGE_URL}/${item.path.replace(/\\/g, "/")}`)
    })
    const newblog = new blogSchema({
      title: req.body.title,
      content: req.body.content,
      images,
      userId: req.user.id,
      likes: [],
      dislikes: [],
    });
    newblog.save().then(() =>
      res.status(201).json({ message: "Blog Uploaded Successfully", isSuccess: true })
    ).catch((error) => {
      res.status(500).json({ error, isSuccess: false })
    });
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}

const getAllblog = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    var perPage = req.query.perPage ? req.query.perPage : 25
    const data = await blogSchema
      .find(req.query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ '_id': -1 })
    const count = await blogSchema.find(req.query).count()
    res.status(201).send({
      message: "List of blogs",
      data,
      current: page,
      totalCount: count,
      pages: Math.ceil(count / perPage),
      isSuccess: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}

const blogById = async (req, res) => {
  try {
    const _id = req.params.id;
    const getBlog = await blogSchema.findById(_id).populate([{ path: "likes", select: '_id name email' }, { path: "dislikes", select: '_id name email' }, { path: "userId", select: '_id name email' }])
    if (!getBlog) {
      res.status(400).json({ messgae: "Invalid blog Id", isSuccess: false });
    } else {
      res.status(200).json({ data: getBlog, isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}

const blogUpdate = async (req, res) => {
  try {
    const _id = req.params.id;
    const { content, title } = req.body
    const blogUpdate = await blogSchema.findByIdAndUpdate(_id, { title, content },
      {
        new: true,
        runValidators: true
      })
    if (blogUpdate == null) {
      res.status(400).json({ message: "Invalid blog Id", isSuccess: false });
    } else {
      res.status(200).json({ message: "This blog is updated", data: blogUpdate, isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}

const blogDelete = async (req, res) => {
  try {
    const _id = req.params.id;
    let blogId = await blogSchema.findByIdAndDelete(_id);
    if (blogId) {
      res.status(200).json({ message: "Blog Deleted SuccessFully", isSuccess: true });
    } else {
      res.status(400).json({ error: "Blog Id is not correct", isSuccess: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
};
const blogLike = async (req, res) => {
  try {
    const _id = req.query.id;
    const getBlog = await blogSchema.findById(_id)
    if (!getBlog) {
      res.status(400).json({ messgae: "Invalid blog Id", isSuccess: false });
    } else {
      await blogSchema.findByIdAndUpdate(_id, { $push: { likes: req.user.id } })
      res.status(200).json({ message: "Your liked this blog", isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}
const blogDislike = async (req, res) => {
  try {
    const _id = req.query.id;
    const getBlog = await blogSchema.findById(_id)
    if (!getBlog) {
      res.status(400).json({ messgae: "Invalid blog Id", isSuccess: false });
    } else {
      await blogSchema.findByIdAndUpdate(_id, { $push: { dislikes: req.user.id } })
      res.status(200).json({ message: "Your dislike this blog", isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}


module.exports = {
  blogCreate,
  blogById,
  blogUpdate,
  blogDelete,
  getAllblog,
  blogLike,
  blogDislike,
}
