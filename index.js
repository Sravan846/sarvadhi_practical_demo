const express = require("express");
const app = express();
require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json({ limit: 100000000000 }));
app.use(bodyParser.json({ limit: 100000000000 }));
app.use(bodyParser.urlencoded({ limit: 100000000000, extended: true }));
app.use(cors());


app.use('/uploads', express.static('uploads'));

app.use(cookieParser());



//Import Route
const userRoute = require("./Routes/user.router");
const blogRoute = require("./Routes/blog.router");
const commentRoute = require("./Routes/comment.router");

// //Route MiddleWare
app.use("/v1/user/", userRoute);
app.use("/v1/blog", blogRoute);
app.use("/v1/comments", commentRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`The Port is Running at ${port}`);
});
