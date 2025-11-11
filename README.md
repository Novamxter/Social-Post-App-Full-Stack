# 🌐 Social Post App — Full Stack Internship Project (3W Solutions)

A **full-stack social media web app** built for the **3W Full Stack Internship Assignment**.  
This project allows users to **sign up, log in, create posts (text/images), like, comment, and view a public feed** — inspired by the **TaskPlanet app’s Social Page**.

---

## 🚀 Live Links

- **Frontend (React.js on Vercel):** [https://social-post-app-full-stack.vercel.app/](https://social-post-app-full-stack.vercel.app/)
- **Backend (Express on Render):** [https://social-post-app-full-stack.onrender.com](https://social-post-app-full-stack.onrender.com)
- **Database (MongoDB Atlas):** Hosted on MongoDB Atlas Cluster

---

## 🧠 Objective

> Build a **Mini Social Post Application** where users can:
> - Create accounts  
> - Post text and/or images  
> - View all users’ posts  
> - Like and comment in real-time  
> - Experience a clean and responsive UI similar to the TaskPlanet app.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Real-Time Updates** | Socket.io |
| **Image Storage** | Cloudinary |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 🌟 Features Implemented

### 👤 Authentication
- Secure **signup and login** using email and password  
- JWT-based authentication flow  
- User details stored in MongoDB (`users` collection)

### 📝 Create Post
- Users can post **text, image, or both**
- Integrated **Cloudinary** for seamless image uploads  
- Automatically displays username and timestamp

### 📰 Feed
- Displays all posts from all users in chronological order  
- Shows **username, caption, image, likes, and comment count**
- Includes **loading spinners** for a smoother experience

### ❤️ Like & 💬 Comment
- Users can like/unlike and comment on any post  
- Updates appear **instantly across devices** using **Socket.io**  
- Stores usernames of users who liked or commented

### 👨‍💻 Profile Page
- Displays user info (username, email, joined date, etc.)  
- Lists user’s posts and activity

### ✨ Extras 
- **Socket.io** integration for real-time feed updates  
- **Cloudinary image management**  
- **Profile page** for each user  
- **Skeleton loading** for post cards while fetching posts 
- **Loader animations** for network operations  
- Well-structured code with comments and reusable components

---

## 🧩 Project Structure

```
📦 social-post-app
├── 📁 frontend/        # React.js frontend
│   ├── src/
│   ├── public/
|   ├── .env
|   ├── .gitignore
|   ├── index.html
│   └── package.json
│
├── 📁 backend/         # Express.js backend
|   ├── config/
|   ├── middleware
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
|   ├── .env
|   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

## 🛠️ Installation & Setup (For Local Testing)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Novamxter/Social-Post-App-Full-Stack.git
cd Social-Post-App-Full-Stack
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:
```bash
npm start
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
```

In `/frontend/src/services/api.js`, update the backend base URL:
```js
export const BASE_URL = "https://social-post-app-full-stack.onrender.com";
```

Run the frontend:
```bash
npm run dev
```

---

## ⚡ API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/users/signup` | Register a new user |
| `POST` | `/api/users/login` | Login user |
| `GET` | `/api/posts` | Fetch all posts |
| `POST` | `/api/posts` | Create a new post |
| `PUT` | `/api/posts/like` | Like/unlike a post |
| `POST` | `/api/posts/comment` | Add a comment |

---

## 🔌 Real-Time Functionality

- **Socket.io** is used for live post updates.  
- Whenever a user **creates, likes, or comments**, the feed automatically updates for all connected clients.

---

<!-- ## 📸 Screenshots 

--- -->

##  Bonus Highlights

- Clean and modern UI  
- Responsive design  
- Code structured with MVC pattern  
- Reusable and commented components  
- Optimized data fetching and socket events  

---

## 👨‍💻 Developer

**Developed by:** Mohit Kumar  

📧 Email: [mehramkmohit968@gmail.com]  

---

> **Submission Date:** 11 November 2025  
> **For:** 3W Solutions — Full Stack Internship Assignment (Task 1)
