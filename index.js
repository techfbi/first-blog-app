import express from "express";
import bodyParser from "body-parser";
import session from 'express-session'; // For managing user sessions (after npm install express-session). The next is the middleware
import multer from "multer"; // For handling multipart/form-data, which is primarily used for uploading files. (after npm install multer)
import { dirname } from "path";
import { fileURLToPath } from "url";
// The two import below was added for security purpose, because it caused some issues with loading of css and images ---tagging it as malware site


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

var userIsAuthorized = false; 
//posts array (in-memory storage for blog posts)
let posts = []; // defined first in create post route below and also called in the / route

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({   //express-session
  secret: 'Oluwafemi',
  resave: false,
  saveUninitialized: true
}));


// middleware to define activePage for all routes so i can use it in header.ejs to highlight active link
app.use((req, res, next) => {
  res.locals.activePage = ""; // default
  next();
});


//To configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // unique filename for the uploaded file
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter(req, file, cb) { // file type filter
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  }
});



function emailAndPass(req, res, next) {
  const email = req.body["email"];
  const pass = req.body["password"];
  if (email === "techFBI@gmail.com" && pass === "techFBI") {
    userIsAuthorized = true; 
    console.log("Email and Password is correct");
  } else {
    userIsAuthorized = false; 
    console.log("Email and Password is wrong");
  }
  next();
}


function checkAuth(req, res, next) { //Middleware to check login
  if (userIsAuthorized) {
    next();
  } else {
    res.redirect("/login-page");
  }
}



app.get("/", (req, res) => {
  res.locals.activePage = "home"; // set activePage for this route


    res.render("index.ejs", {
      posts: posts, // Pass the posts array to the EJS template
    }); 
});



//route to display most recent blog post
app.get("/blogs", (req, res) => {
  res.locals.activePage = "blogs"; // set activePage for this route

  if (posts.length === 0) {
    return res.render("blog.ejs", { post: null });
  }

  const latestPost = posts[0]; // first item is the newest (because you used unshift)

  res.render("blog.ejs", { post: latestPost });
});

app.get("/create-blog", checkAuth, (req, res) => { // Middleware to check login included
  res.locals.activePage = "create-blog"; // set activePage for this route
  res.render("create.ejs");
});

app.get("/login-page", (req, res) => {
  res.locals.activePage = "login-page"; // set activePage for this route
  res.render("login.ejs", { access: null });
});

app.get("/signup", (req, res) => {
  res.render("sample.ejs");
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/login-page");
  });
});

/* app.use(emailAndPass);

Instead of using this global middleware which causes error if i try to 
click on logout button. we can only use the middleware where its needed
which is inside the "app.post("/login"..." */

app.post("/login",emailAndPass, (req, res) => { //here the emailandpass middleware is added, instead of using it globally
  if (userIsAuthorized) {
    res.locals.activePage = "create-blogs"; // set activePage for this route
    res.redirect("/create-blog");
  } else {
    res.locals.activePage = "login-pages"; // set activePage for this route
    res.render("login.ejs", { access: "incorrect" });
  }
});


app.post("/myblog", upload.single("image"), (req,res) => { //Multer Middleware; upload.single("image") is used to handle single file upload with the field name "image". the field name must match the name attribute in the form input. 
  res.locals.activePage = "blogs"; // set activePage for this route
    
    const today = new Date();
    const dateStamp = today.toLocaleDateString("en-US", {
        weekday: "long",   // e.g. Friday
        year: "numeric",   // e.g. 2025
        month: "long",     // e.g. September
        day: "numeric"     // e.g. 19
    });
    const timeStamp = today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
//     second: "2-digit",
       hour12: true // true = 12-hour format with AM/PM, false = 24-hour format
    });

//   Another format for date and time to call in "/" index ejs
  const anotherVersDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const anotherVersTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true // true = 12-hour format with AM/PM, false = 24-hour format
  });


  //Dynamically add otherbodies to a list and loop through them in ejs
  let otherBodies = [];
  for (let i = 2; i <= 10; i++) {
    if (req.body[`body${i}`]) {
      otherBodies.push(req.body[`body${i}`]);
    }
  }

  const myBlogs = {
      id: Date.now().toString(), // Unique ID for each post
      datePosted: `${dateStamp} - ${timeStamp}`, // Date and time when the blog is posted
      datePostedTwo: `${anotherVersDate} - ${anotherVersTime}`, // Another format for date and time to call in "/" index ejs
      blogImage: req.file ? `/uploads/${req.file.filename}` : null, // If a file was uploaded, use its path; otherwise, set to null
      author: req.body["author-name"],
      blogHeading: req.body["heading"],
      blogSubHead: req.body["sub-heading"],
      blogBody: req.body["body"],
      extraBodies: otherBodies
//    blogBody2: req.body["body2"] .... Instead of writing like this till 10, we loop instead
    }

  //add the new blog post to the posts array, keep only latest 3 posts
  posts.unshift(myBlogs); // Add new post to the beginning of the array. I used unshift instead of push to add to the beginning
  if (posts.length > 3) {
    posts.pop(); // Remove the oldest post if there are more than 3
  }


    res.render("myblog.ejs", { 
      ...myBlogs, 
      posts: posts,

    });
})


// View a single post
app.get("/view/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");
  
  res.render("myblog.ejs", { 
    ...post, 
    extraBodies: post.extraBodies || []
  });
  console.log("User viewed a post: /view/"+req.params.id);
});


function findPostById(id) {
  return posts.find(p => p.id == id);
} // the function of this cod


// Delete a post
app.post("/delete/:id", (req, res) => {
  posts = posts.filter(post => post.id != req.params.id); // .filter() → keep everything except (or only) the ones that match. i.e remove the one that matches. Also for more explanation, that line means "keep all posts where the post id is not equal to the id in the url, and delete the one that is equal"
  res.redirect("/");
  console.log("User deleted a post: /delete/"+req.params.id);
});

// Edit (load form with old values)
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id); //.find() → get me one specific item. i.e get the one that matches
  if (!post) return res.status(404).send("Post not found");

  res.render("edit-blog.ejs", { post });
});

// Save changes to edited post
app.post("/edit/:id", upload.single("image"), (req, res) => {
  const index = posts.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    posts[index].blogHeading = req.body["heading"];
    posts[index].blogSubHead = req.body["sub-heading"];
    posts[index].blogBody = req.body["body"];
    posts[index].author = req.body["author-name"];

    // If a new image was uploaded, replace it. Otherwise keep the old one.
    if (req.file) { // If a new file was uploaded
      posts[index].blogImage = `/uploads/${req.file.filename}`;// Update the image path
    }
    // Rebuild extraBodies array from req.body (just like i did when creating)
    let updatedExtraBodies = [];
    for (let i = 2; i <= 10; i++) {
      if (req.body[`body${i}`]) {
        updatedExtraBodies.push(req.body[`body${i}`]);
      }
    }
    posts[index].extraBodies = updatedExtraBodies; // overwrite old with new
    console.log("User edited a post: /edit/"+req.params.id);
  
    res.redirect("/view/" + req.params.id); // Redirect to the blog page with updated post data
  } else {
    res.status(404).send("Post not found");
  }
});





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});