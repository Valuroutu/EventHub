# 🎉 EventHub

EventHub is a modern **MERN Stack Event Management Platform** that enables users to discover, create, manage, and book events through an intuitive web interface. The platform is designed to simplify event organization while providing a seamless experience for both organizers and attendees.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login
* Secure Authentication
* Browse Available Events
* View Event Details
* Book Events
* View Booking History
* Responsive User Interface

### 🎯 Organizer Features

* Create New Events
* Edit Existing Events
* Delete Events
* Manage Event Information
* Track Event Registrations

### 🔒 Security

* JWT Authentication
* Password Encryption
* Protected Routes
* Secure API Access

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* CSS / Tailwind CSS (depending on implementation)

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

## Development Tools

* Git
* GitHub
* Postman
* VS Code
* Nodemon

---

# 📁 Project Structure

```
EventHub/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Valuroutu/EventHub.git
cd EventHub
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

---

## 5. Start Backend

```bash
cd server
npm run dev
```

---

## 6. Start Frontend

Open another terminal.

```bash
cd client
npm run dev
```

Frontend will run on

```
http://localhost:5173
```

Backend will run on

```
http://localhost:5000
```

---

# 📌 API Overview

### Authentication

* Register User
* Login User
* Get User Profile

### Events

* Get All Events
* Get Event by ID
* Create Event
* Update Event
* Delete Event

### Bookings

* Book Event
* Get User Bookings
* Cancel Booking

---

# 📷 Screenshots

You can add screenshots here.

```
screenshots/
├── home.png
├── login.png
├── register.png
├── dashboard.png
├── event-details.png
```

Example:

```markdown
![Home](screenshots/home.png)
```

---

# 🔮 Future Enhancements

* Email Notifications
* Payment Gateway Integration
* Event Categories
* Search & Filters
* Admin Dashboard
* Event Analytics
* QR Code Ticket Verification
* Real-Time Notifications
* Image Uploads
* Google Authentication

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 🐛 Known Issues

* Email notifications are not yet implemented.
* Payment gateway integration is under development.
* Admin analytics dashboard is planned for future releases.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Valuroutu Santosh Kumar**

* GitHub: https://github.com/Valuroutu

---

## ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.
