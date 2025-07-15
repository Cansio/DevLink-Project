# DevLink – Developer Social Hub 👥💬

**DevLink** is a full-stack social media platform designed for developers to connect, share posts, and build their personal brand. Built using the MERN stack, it offers user authentication, post creation, likes, comments, profile customization, **search functionality**, and more — all wrapped in a clean, responsive interface.

---

## 🚀 Tech Stack

* **Frontend:** React.js (with Vite), React Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens)

---

## ✨ Features

### 👤 Authentication & Security

* Register & login with JWT-based auth
* Secure password hashing (bcrypt)
* Update password functionality

### 📝 Post System

* Create, edit, and delete your own posts
* View and explore posts from other developers
* Like and comment on posts in real-time
* 🔍 **Search posts by keywords, tags, or authors**

### 🙍‍♂️ Profile Management

* View and edit your profile information
* Upload/change profile picture
* View posts you've created

---

## 📁 Project Structure

```
devlink/
├── client/              # Frontend (React + Vite)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
├── server/              # Backend (Node + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── server.js
├── .env
└── README.md
```

---

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devlink.git
cd devlink
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Visit your app at:
**Frontend** → `http://localhost:5173`
**Backend API** → `http://localhost:5000`

---

## 📌 Environment Variables

Create a `.env` file in the `server/` folder with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret_key
```

---

## 📈 Future Enhancements

* 🔔 Real-time notifications
* 💬 Developer messaging system
* 📷 video post support
* 🧠 Hashtags, mentions, and search enhancements
* 🌐 Dark/light mode toggle

---

## 🤝 Contributing

Feel free to fork, improve, and raise PRs. Feedback and suggestions are welcome!

---

## 👨‍💻 Author

**Joe Fernandes**
Passionate full-stack developer focused on clean design and scalable code.

---


