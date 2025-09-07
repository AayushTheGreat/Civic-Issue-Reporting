# 🏙️ Civic Issue Reporting System

This project is a **full-stack civic issue reporting platform** designed for hackathons and smart city projects.  
It allows **citizens** to submit reports (like potholes, broken streetlights, garbage dumps) with photos and location.  
An **admin dashboard** helps authorities view, manage, and resolve these issues efficiently.

## ✨ Features
- 📸 Citizens can submit reports with description, location, and photo  
- 📂 Uploaded photos stored securely on the server  
- 🗂️ Admin dashboard to view all reports in a table  
- 🔄 Update report status (Pending → In Progress → Resolved)  
- 🌍 (Optional) Google Maps integration for geolocation-based reporting  
- 💾 Lightweight database (SQLite) — no setup required  

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, SQLite, Multer  
- **Frontend:** HTML + JavaScript (simple admin dashboard)  
- **Database:** SQLite (auto-generated)  

## 🚀 Getting Started
```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/civic-issue-reporting.git
cd civic-issue-reporting

# Install dependencies
npm install

# Run backend server
node server.js
