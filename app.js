const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

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
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
  req.body.blog.body = req.sanitize(req.body.blog.body);
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

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog });
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`BlogApp server listening on port ${port}...`)
);
