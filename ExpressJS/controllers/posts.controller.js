const path = require("path");

function getPost(req, res) {
  // res.send("<div><h1>Post Title</h1><p>This is a post</p></div>");
  res.sendFile(path.join(__dirname, "..", "public", "images", "sky.jpg"));
}

module.exports = {
  getPost,
};
