# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v16+ installed
- PostgreSQL installed and running

### Quick Setup

1. **Setup PostgreSQL Database**
   ```bash
   # Login to PostgreSQL
   sudo -u postgres psql
   
   # Create database and user
   CREATE DATABASE label_management;
   CREATE USER label_admin WITH PASSWORD 'admin123';
   GRANT ALL PRIVILEGES ON DATABASE label_management TO label_admin;
   \c label_management
   GRANT ALL ON SCHEMA public TO label_admin;
   \q
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - Open browser: http://localhost:3000
   - Login as admin: admin@example.com / admin123

### Try It Out

1. Go to Admin Dashboard
2. Use chatbot: "Change About to Contact Us"
3. Check the About page - the label should update!

### Need Help?
- See [SETUP.md](./SETUP.md) for detailed instructions
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system details

## 🎯 Key Features

✅ **Dynamic Label Management** - Change any UI text without code changes
✅ **AI Chatbot Interface** - Natural language commands
✅ **Real-time Updates** - Changes reflect instantly across all users
✅ **Full Audit Trail** - Track all label changes with history
✅ **Secure Admin Panel** - JWT authentication & role-based access
✅ **PostgreSQL Database** - Reliable, scalable data storage

## 📝 Example Chatbot Commands

```
"Change About to Contact Us"
"Rename Home to Welcome"
"Update nav_home label to Main Page"
"List all labels"
"Help"
```

## 🏗️ Project Structure

```
label-management-app/
├── backend/           # Node.js + Express + PostgreSQL
├── frontend/          # React application
├── README.md         # Main documentation
├── SETUP.md          # Detailed setup guide
└── ARCHITECTURE.md   # Technical architecture
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_NAME=label_management
DB_USER=label_admin
DB_PASSWORD=admin123
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📚 API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/labels` - Get all labels
- `PUT /api/labels/:key` - Update label
- `POST /api/chatbot/process` - Process chatbot command
- `GET /api/labels/history` - View change history

## 🎨 Pages

1. **Home** - Landing page with dynamic labels
2. **About** - About page with dynamic content
3. **Admin Login** - Secure authentication
4. **Admin Dashboard** - Control panel with chatbot

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- SQL injection prevention (Sequelize ORM)
- CORS protection
- XSS protection (React)

## 🌐 Real-time Features

- Socket.io for instant updates
- Live label synchronization
- Multi-user support
- Automatic reconnection

## 📊 Database Tables

- **users** - Admin accounts
- **labels** - UI label storage
- **label_history** - Change audit trail

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Socket.io Client
- Axios
- Context API

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Socket.io
- JWT & bcrypt

## 💡 Use Cases

1. **Multi-language switching** - Change labels for different languages
2. **A/B testing** - Test different label variations
3. **Seasonal updates** - Update labels for holidays/events
4. **Brand refresh** - Update terminology across app
5. **Quick fixes** - Fix typos without deployment

## 🚀 Production Deployment

For production deployment:
1. Use environment variables for all secrets
2. Enable HTTPS
3. Set up proper CORS
4. Use PostgreSQL connection pooling
5. Implement rate limiting
6. Add monitoring and logging
7. Use PM2 or similar for Node.js

## 📞 Support

For issues or questions:
1. Check console logs (frontend & backend)
2. Verify environment variables
3. Ensure PostgreSQL is running
4. Review [SETUP.md](./SETUP.md)
5. Check [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
