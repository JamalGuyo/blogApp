const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

//   connect mongoose to db
mongoose
  .connect("mongodb://localhost/blogapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Blog app is connected to database`))
  .catch((err) => console.log(`Error connecting to database : ${err}`));

//   setup blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: Date,
});
const Blog = mongoose.model("Blog", blogSchema);

//   setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
// INDEX ROUTE
app.get("/", (req, res) => {
  res.render("index");
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`BlogApp server listening on port ${port}...`)
);
