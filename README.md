# Blog App – Node.js + Express + EJS
This is my first blog app/ first app created using Node.js and Express js. It is a capstone project from udemy, and below is the details of how i created and the functions of the app. (I'm getting better at this and will definitely improve more).
A full-featured blogging platform built with Node.js, Express, and EJS templates, where users can create, view, edit, and delete blog posts with image uploads.
It also includes responsive layouts, secure image handling, and admin login access for post management.

### Features
1. Create and publish blog posts with images
2. Edit and delete existing posts
3. View each post in detail
4. Landscape blog image upload
5. Login system for post creation
6. Responsive UI for mobile and desktop
7. Secure upload validation (file size & type)

### Tech Stack
* Backend === Node.js, Express.js
* Frontend === EJS Templates, HTML, CSS
* File Uploads === Multer
* Sessions === Express-session
* Deployment === render and railway (from Github)
* Check the about session for the link to the web app

### Login Access
The general default admin login credentials (for creating and editing posts):
* Email === techFBI@gmail.com
* Password === techFBI

### Image Upload Rules

* Only image files are allowed (.jpg, .png, .jpeg)
* Maximum file size: 2MB
* Portrait images are rejected (with friendly feedback)

### File Structure
- blog-app/
- ├── public/
- │   ├── css/
- │   ├── uploads/
- │   └── images/
- ├── views/
- │   ├── index.ejs
- │   ├── create.ejs
- │   ├── edit-blog.ejs
- │   ├── login.ejs
- │   └── myblog.ejs
- ├── index.js
- ├── package.json
- └── README.md

### Future Improvements

* Add database (MongoDB / PostgreSQL) for persistent posts
* Add user registration or sign up for multiple authors
* Add comment system
* Integrate Cloudinary for permanent image hosting
* Add dark mode toggle

### Contributing
* Pull requests are welcome!
* For major changes, please open an issue first to discuss what you’d like to change.

### Author
#### Daodu Johnson Oluwafemi (oluwafemijohnson347@gmail.com)
Built with ❤️ using Node.js and Express.


