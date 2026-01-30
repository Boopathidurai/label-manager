# Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**

## Step 1: PostgreSQL Database Setup

### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # For macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # For Windows
   # Download installer from https://www.postgresql.org/download/windows/
   ```

2. **Start PostgreSQL service**:
   ```bash
   # Ubuntu/Debian
   sudo service postgresql start

   # macOS
   brew services start postgresql

   # Windows
   # PostgreSQL should start automatically after installation
   ```

3. **Create database and user**:
   ```bash
   # Access PostgreSQL as postgres user
   sudo -u postgres psql

   # OR on Windows/macOS
   psql -U postgres
   ```

   Then run these SQL commands:
   ```sql
   -- Create database
   CREATE DATABASE label_management;

   -- Create user with password
   CREATE USER label_admin WITH PASSWORD 'your_secure_password';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE label_management TO label_admin;

   -- Connect to the database
   \c label_management

   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO label_admin;

   -- Exit psql
   \q
   ```

### Option B: Using PostgreSQL Docker Container

```bash
docker run --name postgres-label-mgmt \
  -e POSTGRES_DB=label_management \
  -e POSTGRES_USER=label_admin \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:14
```

### Option C: Using Cloud PostgreSQL (e.g., ElephantSQL, Heroku, AWS RDS)

1. Create a PostgreSQL instance on your preferred cloud provider
2. Note down the connection URL (format: `postgresql://user:password@host:port/database`)
3. Use this URL in the `.env` file

## Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd label-management-app/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file** with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development

   # PostgreSQL Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=label_management
   DB_USER=label_admin
   DB_PASSWORD=your_secure_password

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   JWT_EXPIRE=7d

   # CORS
   CLIENT_URL=http://localhost:3000

   # Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

5. **Run database migrations**:
   ```bash
   npm run migrate
   ```

   You should see:
   ```
   ✅ Database connection established
   ✅ Database tables synchronized
   ✅ Migrations completed successfully
   ```

6. **Seed initial data**:
   ```bash
   npm run seed
   ```

   You should see:
   ```
   ✅ Admin user created
   ✅ Initial labels seeded
   📋 Default credentials:
      Email: admin@example.com
      Password: admin123
   ✅ Database seeding completed successfully
   ```

7. **Start backend server**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ========================================
   🚀 Server running in development mode
   📡 Server: http://localhost:5000
   🔌 Socket.io ready for real-time updates
   ========================================
   ✅ PostgreSQL Connection established successfully
   ✅ Database synchronized
   ```

## Step 3: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
   ```bash
   cd label-management-app/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file** (optional, default values should work):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

5. **Start frontend development server**:
   ```bash
   npm start
   ```

   The application should automatically open in your browser at `http://localhost:3000`

## Step 4: Verify Installation

1. **Check if backend is running**:
   - Open `http://localhost:5000/health` in your browser
   - You should see: `{"status":"OK","message":"Server is running","timestamp":"..."}`

2. **Check frontend**:
   - Open `http://localhost:3000` in your browser
   - You should see the Home page with navigation

3. **Test Admin Login**:
   - Click on "Admin" in the navigation
   - Login with:
     - Email: `admin@example.com`
     - Password: `admin123`
   - You should be redirected to the Admin Dashboard

4. **Test Chatbot**:
   - In Admin Dashboard, try a command like:
     - "Change About to Contact Us"
     - "List all labels"
   - Navigate to Home or About page and verify the label changed

## Troubleshooting

### Database Connection Issues

**Error: "ECONNREFUSED"**
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check if PostgreSQL is listening on port 5432: `sudo netstat -plnt | grep 5432`
- Verify credentials in `.env` file

**Error: "password authentication failed"**
- Double-check username and password in `.env`
- Recreate the user with correct password

**Error: "database does not exist"**
- Create the database: `sudo -u postgres createdb label_management`

### Backend Issues

**Error: "Cannot find module"**
- Run `npm install` again in backend directory
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Port already in use**
- Change PORT in `.env` to something else like 5001
- Or kill the process using port 5000: `lsof -ti:5000 | xargs kill`

### Frontend Issues

**Error: "Failed to compile"**
- Check for any syntax errors in the code
- Clear cache: `rm -rf node_modules/.cache`
- Reinstall dependencies

**Blank page or errors in browser console**
- Check if backend is running
- Verify API URL in frontend `.env` file
- Check browser console for specific errors

### Real-time Updates Not Working

- Ensure both frontend and backend are using the same Socket.io version
- Check if WebSocket connection is established in browser DevTools > Network > WS
- Verify firewall settings aren't blocking WebSocket connections

## Next Steps

1. **Customize Labels**:
   - Use the Admin Chatbot to change labels
   - Example: "Change Home to Welcome"

2. **View History**:
   - Click on "History" tab in Admin Dashboard
   - See all label changes with timestamps

3. **Production Deployment**:
   - See DEPLOYMENT.md for production setup instructions

## Security Notes

⚠️ **Important for Production**:
- Change JWT_SECRET to a strong, random string
- Change admin password immediately
- Use environment variables for all sensitive data
- Enable HTTPS for production
- Set up proper CORS policies
- Use connection pooling for database
- Implement rate limiting

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check network connectivity between frontend and backend
