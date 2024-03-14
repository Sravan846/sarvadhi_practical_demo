const userSchema = require('../models/user');
const blogSchema = require('../models/blog');
const commentSchema = require('../models/blogComment');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { email } = req.body;
    const userMailCheck = await userSchema.findOne({ email });
    let profile = ""
    if (userMailCheck) {
      return res.status(409).json({ message: 'User Email is Already Exists', isSuccess: false });
    } else {
      req.files.profile.forEach((item) => {
        profile = `${process.env.IMAGE_URL}/${item.path.replace(/\\/g, "/")}`
      })
      const newuser = new userSchema({ ...req.body, profile });
      newuser.save()
        .then(() => res.status(201).json({ message: "Register successfully", isSuccess: true }))
        .catch((error) => res.status(500).json({ error, isSuccess: false }));
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, isSuccess: false })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userMail = await userSchema.findOne({ email });
    if (!userMail) {
      return res.status(401).json({ message: "Invalid Useremail", isSuccess: false });
    } else {
      const isMatch = await bcrypt.compare(password, userMail.password);
      const token = await userMail.generateAuthToken();
      if (isMatch) {
        return res.status(201).json({ message: "Login Success", data: token, isSuccess: true })
      }
      else {
        return res.status(401).json({ message: "Invalid Username or Password", isSuccess: false });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
}

const logout = async (req, res) => {
  try {
    res.status(201).json({ message: "Logout Success", isSuccess: true })
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
}

const getMyDetails = async (req, res) => {
  try {
    const userDetails = await userSchema.findById(req.user.id).select({ password: 0 }).populate([{ path: "followers", select: '_id name email' },])
    const blogDetails = await blogSchema.find({ userId: req.user.id }).populate([{ path: "likes", select: '_id name email' }, { path: "dislikes", select: '_id name email' }, { path: "userId", select: '_id name email' }])
    const commentDetails = await commentSchema.find({ userId: req.user.id }).populate([{ path: "blogId", select: '_id name email' }, { path: "userId", select: '_id name email' },])
    const data = {
      user: userDetails,
      blogDetails,
      commentDetails
    }
    res.status(201).json({ message: "Your details with your blogs and comments", data, isSuccess: true })
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
}
const UpdateyMyDetails = async (req, res) => {
  try {
    const { email } = req.body;
    const userMailCheck = await userSchema.findOne({ email });
    let profile = ""
    if (userMailCheck) {
      return res.status(409).json({ message: 'User Email is Already Exists', isSuccess: false });
    } else {
      req.files.profile.forEach((item) => {
        profile = item.path.replace(/\\/g, "/")
      })
      await userSchema.findByIdAndUpdate(req.user.id, { ...req.body, profile })
      return res.status(201).json({ message: "Your details is updated", isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false });
  }
}
const deleteUserById = async (req, res) => {
  try {
    const _id = req.params.id;
    if (req.user.isAdmin) {
      let userId = await userSchema.findByIdAndDelete(_id);
      if (userId) {
        res.status(200).json({ message: "user Deleted SuccessFully", isSuccess: true });
      } else {
        res.status(400).json({ error: "User Id is not correct", isSuccess: false });
      }
    }
    else {
      res.status(400).json({ error: "You don't have access for this api", isSuccess: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}
const userFollow = async (req, res) => {
  try {
    const _id = req.query.id;
    const getuser = await userSchema.findById(_id)
    if (!getuser) {
      res.status(400).json({ messgae: "Invalid user Id", isSuccess: false });
    } else {
      await userSchema.findByIdAndUpdate(_id, { $push: { followers: req.user.id } })
      res.status(200).json({ message: "Your follow this user", isSuccess: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, isSuccess: false })
  }
}

module.exports = {
  register,
  login,
  logout,
  getMyDetails,
  UpdateyMyDetails,
  deleteUserById,
  userFollow
}
