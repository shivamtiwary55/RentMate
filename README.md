# 🏠 RentMate

> A hyperlocal rental and roommate finding platform for students — find rooms, find compatible roommates, split expenses, track complaints, and review landlords.

## 🔗 Live Demo
**Frontend:** [https://rentmate.vercel.app](https://rentmate.vercel.app)  
**Backend API:** [https://rentmate-backend.onrender.com](https://rentmate-backend.onrender.com)

## 🎯 Demo Credentials
| Role | Email | Password |
|---|---|---|
| Student | rahul@test.com | 123456 |
| Landlord | suresh@test.com | 123456 |
| Admin | admin@rentmate.com | admin123 |

## 🚀 Features
- 🗺️ Browse listings on interactive Leaflet map with geospatial search
- 🧩 Roommate compatibility quiz with weighted scoring algorithm
- 💰 Expense splitter — auto split bills, track balances
- 🔧 Complaint tracker with real-time Socket.IO status updates
- ⭐ Verified tenant-only landlord reviews
- 📧 Automated rent reminder emails via node-cron
- 👥 3 role-based dashboards — Student, Landlord, Admin
- 📊 Admin analytics with Recharts

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, React Router, Axios, Leaflet.js, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas with geospatial indexing |
| Auth | JWT in HTTP-only cookies, bcrypt, RBAC |
| Real-time | Socket.IO |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Scheduler | node-cron |
| Deployment | Vercel (frontend) + Render (backend) |

## 📁 Project Structure
\`\`\`
rentmate/
├── backend/          # Express API
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & upload
│   └── utils/        # Token, cron jobs
└── frontend/         # React app
    └── src/
        ├── pages/    # Student, Landlord, Admin
        ├── components/
        └── context/  # Auth context
\`\`\`

## ⚙️ Run Locally

\`\`\`bash
# Clone
git clone https://github.com/YOUR_USERNAME/rentmate.git

# Backend
cd rentmate/backend
npm install
# create .env with your values
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
\`\`\`

## 🔑 Environment Variables

### Backend (.env)
\`\`\`
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=
VITE_SOCKET_URL=
\`\`\`

## 👨‍💻 Author
[Shivam Tiwary) · [https://www.linkedin.com/in/shivam-tiwary-4646802b8/)
