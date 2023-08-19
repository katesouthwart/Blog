//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Welcome to the blog project! This is a project done during my fullstack development course. This blog project features the use of Express.js, EJS, Mongoose. The purpose of this project was to learn how to use Mongoose and MongoDB, as well as utilize EJS and Express to create dynamic pages for each blog post.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
dotenv.config();
const app = express();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
  console.log("Connected to database.")
}



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postSchema = new mongoose.Schema ({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {

  Post.find({})
    .then (foundPosts => {

      res.render("home", {
        startContent: homeStartingContent,
        posts: foundPosts
      });
    })

    .catch(function(err) {
      console.log(err);
    });


});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
});

// app.get("/contact", (req, res) => {
//   res.render("contact", {contactContent: contactContent});
// });

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {

  const post = new Post ({
    title: req.body.submissionTitle,
    body: req.body.submissionBody
  });

  post.save()
  .then(function(result){
      console.log("Posted to Database.");
      res.redirect("/")
    })
  .catch(function(err){
    console.log(err);
  });


});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
    .then(function(post){
      res.render("post", {
        title: post.title,
        body: post.body
      });
    })
    .catch(function(err){
      console.log(err);
    })


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
