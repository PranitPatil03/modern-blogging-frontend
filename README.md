
# EpicBlogs - Modern Blogging Platform with MERN Stack, Editor.js, Tailwind CSS, AWS, and Firebase

Welcome to the Modern Blogging Platform! This platform allows users to create, edit, and publish blogs. It utilizes the MERN stack (MongoDB, Express.js, React.js, and Node.js), AWS S3 for image storage, Firebase for Google Authentication, and Editor.js as the blog editor.

If you find this project interesting or useful, consider giving it a ⭐!

## Project Overview

### Technologies Used
- MERN stack (MongoDB, Express.js, React.js, and Node.js)
- AWS S3 (Image storage)
- Firebase (Google Authentication)
- Editor.js (Blog Editor)
- Tailwind CSS

## Core Features

1. **User Authentication**
   - Sign up, log in, and log out functionality.
   - Google Authentication for a seamless sign-in experience.

2. **Blog Editing and Publishing**
   - Rich text editor with page animation for a smooth user experience.
   - Save drafts, edit, and publish blogs.

3. **AWS Integration**
   - Setup AWS S3 bucket for storing banner images.
   - Connect AWS to the server for seamless image uploads.

4. **Home Page**
   - Display latest and trending blogs with minimal blog cards.
   - Filter blogs by categories.
   - Pagination for a better user experience.

5. **User Profile**
   - User profile page displaying authored blogs.
   - Edit profile information and change password functionality.

6. **Blog Interaction**
   - Like blogs, leave comments, and view similar blogs.
   - Pagination for comments and replies.

7. **Search Functionality**
   - Search for blogs and users with a working search input.
   - Dedicated search page.

8. **Notification Dashboard**
   - Users receive notifications for new comments, likes, and replies.
   - Notification dashboard to view and manage notifications.

9. **Blog Dashboard**
   - Overview of authored blogs with edit and delete functionality.
   - Analytics for blog views, likes, and comments.


## Configuration and Setup
In order to run this project locally, simply fork and clone the repository or download as zip and unzip on your machine.

- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)
- Split your terminal into two (run the client on one terminal and the server on the other terminal)

In the first terminal
- cd client and create a .env file in the root of your client directory.
- Supply the following credentials

```
VITE_SERVER_DOMAIN='http://localhost:4000'
```

```
$ cd client
$ npm install (to install client-side dependencies)
$ npm run dev (to start the client)
```
In the second terminal
- cd server and create a .env file in the root of your server directory.
- Supply the following credentials

```
DB_LOCATION=
SECRET_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_SECRET_KEY=
```
```
$ cd server
$ npm install (to install server-side dependencies)
& npm start (to start the server)
```


## Contributing

Contributions to this project are welcome! If you find a bug or want to add a feature, please submit an issue or a pull request. To contribute, follow these steps:

1. Fork the repository
2. Create a new branch for your feature: `git checkout -b my-new-feature`
3. Make changes and commit them: `git commit -m 'Add some feature'`
4. Push your branch to your forked repository: `git push origin my-new-feature`
5. Create a Pull Request
