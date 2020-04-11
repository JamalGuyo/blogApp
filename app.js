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
  created: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

//   setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
// INDEX ROUTE
app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs });
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
  Blog.create(
    {
      title: req.body.blog.title,
      image: req.body.blog.image,
      body: req.body.blog.body,
      created: req.body.blog.created,
    },
    (error, blog) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/blogs");
      }
    }
  );
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (error, blog) => {
    if (error) {
      console.log(error);
    } else {
      res.render("show", { blog });
    }
  });
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`BlogApp server listening on port ${port}...`)
);
