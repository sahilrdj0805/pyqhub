# 📚 PYQ Hub - Previous Year Question Paper Platform

![PYQ Hub Banner](https://via.placeholder.com/1200x400/000000/FFFFFF?text=PYQ+Hub+-+Your+Academic+Companion)

**PYQ Hub** is a comprehensive, full-stack educational platform designed to help students access, organize, and contribute Previous Year Question (PYQ) papers. Built with the **MERN Stack**, it features a secure role-based authentication system, a dedicated admin dashboard, user contribution workflows, and integrated payment gateways for premium access.

---

## 🚀 Features

### 👨‍🎓 For Students / Users
* **Extensive Library**: Browse and search through a vast collection of PYQs by Subject, Year, and Course.
* **In-app PDF Viewer**: View question papers directly in the browser or download them securely.
* **Community Contributions**: Can't find a paper? Submit an "Upload Request" with a PDF to contribute to the community.
* **Premium Access**: Upgrade to a Pro account using **Stripe** or **Razorpay** to unlock unlimited downloads and exclusive academic content.
* **Contact Support**: Reach out to administrators directly from the platform.

### 🛡️ For Administrators
* **Admin Dashboard**: A centralized, secure portal to monitor platform statistics (total users, PYQs, downloads).
* **Moderation Workflow**: Review, approve, or reject user-submitted PYQ upload requests before they go live.
* **Content Management**: Add, edit, or delete Subjects and PYQs directly from the dashboard.
* **Message Center**: View and respond to contact messages submitted by users.

### 🔒 Security & Architecture
* **JWT Authentication**: Secure Bearer token authentication with `bcrypt` password hashing.
* **Role-Based Access Control (RBAC)**: Strict separation of privileges between `user` and `admin` roles, protecting sensitive API routes.
* **Cloud Storage**: Secure PDF storage and retrieval using **Cloudinary**.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Custom styling and animations)
* Axios (API Integration)
* React Router DOM
* Context API / State Management

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Token (JWT) & bcryptjs (Auth)

**Third-Party Services:**
* **Cloudinary**: File/PDF hosting
* **Stripe & Razorpay**: Payment Processing
* **Render**: Cloud Hosting & Deployment

---

## ⚙️ Installation & Local Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/sahilrdj0805/pyqhub.git
cd pyqhub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

---

## 🌐 Live Demo
* **Frontend Application:** [https://pyqhub-snpo.onrender.com](https://pyqhub-snpo.onrender.com)
* **Backend API:** [https://pyqhub-backend-1k7e.onrender.com](https://pyqhub-backend-1k7e.onrender.com)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/sahilrdj0805/pyqhub/issues) if you want to contribute.

## 📝 License
This project is licensed under the MIT License.

---
*Built with ❤️ by Sahil Ahamad*
