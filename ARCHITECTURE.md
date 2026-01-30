# System Architecture Documentation

## Overview

The Label Management System is a full-stack web application that enables administrators to dynamically modify UI labels through a chatbot interface without affecting application functionality.

## Technology Stack

### Frontend
- **React 18**: UI library for building user interfaces
- **React Router v6**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client for API calls
- **Socket.io Client**: Real-time communication
- **CSS3**: Styling with custom design system

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Sequelize ORM**: Database object-relational mapping
- **Socket.io**: Real-time bidirectional communication
- **JWT**: Authentication and authorization
- **bcrypt**: Password hashing

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  About   │  │  Admin   │  │Dashboard │   │
│  │   Page   │  │   Page   │  │  Login   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │            │              │              │         │
│         └────────────┴──────────────┴──────────────┘         │
│                        │                                      │
│              ┌─────────▼─────────┐                          │
│              │  React Components │                          │
│              └─────────┬─────────┘                          │
│                        │                                      │
│         ┌──────────────┼──────────────┐                     │
│         │              │              │                      │
│    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐                │
│    │ Label   │   │  Auth   │   │ Socket  │                │
│    │ Context │   │ Context │   │ Service │                │
│    └─────────┘   └─────────┘   └─────────┘                │
└─────────────────────────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         HTTP │     WebSocket       │
              │          │          │
┌─────────────▼──────────▼──────────▼─────────────────────────┐
│                      SERVER LAYER                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Express.js Application                    │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │  │
│  │  │  Auth   │  │  Label  │  │Chatbot  │  │ Socket  │ │  │
│  │  │ Routes  │  │ Routes  │  │ Routes  │  │   IO    │ │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │  │
│  │       │            │            │            │        │  │
│  │  ┌────▼────────────▼────────────▼────────────▼─────┐ │  │
│  │  │           Middleware Layer                      │ │  │
│  │  │  - Authentication   - Error Handling           │ │  │
│  │  │  - Authorization    - Request Logging          │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │       │            │            │                    │  │
│  │  ┌────▼────────────▼────────────▼─────┐             │  │
│  │  │        Controllers                 │             │  │
│  │  │  - authController                  │             │  │
│  │  │  - labelController                 │             │  │
│  │  │  - chatbotController               │             │  │
│  │  └─────────────┬──────────────────────┘             │  │
│  │                │                                     │  │
│  │  ┌─────────────▼──────────────────────┐             │  │
│  │  │         Services Layer              │             │  │
│  │  │  - chatbotService (NLP parsing)     │             │  │
│  │  └─────────────┬──────────────────────┘             │  │
│  │                │                                     │  │
│  │  ┌─────────────▼──────────────────────┐             │  │
│  │  │      Sequelize ORM Models          │             │  │
│  │  │  - User    - Label                 │             │  │
│  │  │  - LabelHistory                    │             │  │
│  │  └─────────────┬──────────────────────┘             │  │
│  └────────────────┼────────────────────────────────────┘  │
└───────────────────┼───────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────┐
│                  DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                      │ │
│  │  ┌────────┐  ┌────────┐  ┌──────────────┐           │ │
│  │  │ users  │  │ labels │  │label_history │           │ │
│  │  └────────┘  └────────┘  └──────────────┘           │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Views Page with Labels
```
User → Home/About Page → LabelContext → API Request → Labels Table → Response → UI Update
```

### 2. Admin Updates Label via Chatbot
```
Admin → Chatbot Input → API Request → Chatbot Service → Label Controller 
→ Database Update → History Record → Socket.io Broadcast → All Clients Update
```

### 3. Authentication Flow
```
Login Form → Auth API → JWT Generation → Local Storage → Protected Routes
```

## Database Schema

### users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### labels Table
```sql
CREATE TABLE labels (
  id SERIAL PRIMARY KEY,
  label_key VARCHAR(255) UNIQUE NOT NULL,
  label_value VARCHAR(255) NOT NULL,
  page VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  description TEXT,
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### label_history Table
```sql
CREATE TABLE label_history (
  id SERIAL PRIMARY KEY,
  label_id INTEGER REFERENCES labels(id) NOT NULL,
  label_key VARCHAR(255) NOT NULL,
  old_value VARCHAR(255) NOT NULL,
  new_value VARCHAR(255) NOT NULL,
  changed_by INTEGER REFERENCES users(id) NOT NULL,
  change_type VARCHAR(20) DEFAULT 'chatbot',
  chatbot_command TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user

### Labels
- `GET /api/labels` - Get all labels (Public)
- `PUT /api/labels/:key` - Update label (Admin only)
- `GET /api/labels/history` - Get change history (Admin only)
- `GET /api/labels/search` - Search labels (Admin only)

### Chatbot
- `POST /api/chatbot/process` - Process chatbot command (Admin only)

## Security Features

### Authentication & Authorization
- **JWT-based authentication**: Stateless token-based auth
- **Password hashing**: bcrypt with salt rounds
- **Role-based access control**: Admin-only routes
- **Token expiration**: Configurable JWT expiry

### Security Middleware
- **Helmet.js**: Security headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate limiting**: Prevent abuse (can be added)
- **Input validation**: Express-validator

### Best Practices
- Environment variables for sensitive data
- SQL injection prevention via Sequelize ORM
- XSS protection through React
- HTTPS recommended for production

## Real-time Communication

### Socket.io Events

**Server-side:**
- `connection`: Client connected
- `disconnect`: Client disconnected
- `join-admin`: Admin joined room

**Client-side:**
- `label-updated`: Label changed notification
- Automatic reconnection on disconnect

### Use Cases
1. Multi-admin collaboration
2. Instant UI updates across all users
3. Real-time chatbot responses

## State Management

### Frontend State
- **AuthContext**: User authentication state
- **LabelContext**: Global label data
- **Component State**: Local UI state

### Data Caching
- Labels cached in React Context
- Automatic refresh on updates
- Manual refresh capability

## Chatbot Natural Language Processing

### Command Patterns
```javascript
// Change commands
"Change About to Contact Us"
"Rename Home to Welcome"
"Update nav_home label to Main"

// List commands
"Show all labels"
"List labels"

// Help commands
"Help"
"What can you do"
```

### Parsing Logic
1. Convert to lowercase
2. Match against regex patterns
3. Extract label key and new value
4. Fuzzy matching for label keys
5. Execute corresponding action

## Performance Considerations

### Backend
- Connection pooling for PostgreSQL
- Sequelize query optimization
- Indexed database columns
- Async/await for non-blocking operations

### Frontend
- React Context for state management
- Code splitting (can be implemented)
- Lazy loading components (can be added)
- Optimized re-renders

## Scalability

### Horizontal Scaling
- Stateless JWT authentication
- Socket.io with Redis adapter (for multiple servers)
- Load balancing support

### Database Scaling
- Read replicas for PostgreSQL
- Connection pooling
- Query optimization with indexes

## Monitoring & Logging

### Current Implementation
- Console logging for development
- Error tracking in middleware
- Request logging

### Recommended Additions
- Winston/Morgan for production logging
- Error monitoring (e.g., Sentry)
- Performance monitoring (e.g., New Relic)
- Database query logging

## Deployment Architecture

### Recommended Setup
```
Users → Nginx (Reverse Proxy) → Node.js Server → PostgreSQL
                                ↓
                         Socket.io Server
```

### Environment Configuration
- Development: Local setup
- Staging: Cloud-hosted with test data
- Production: Secure, optimized, monitored

## Future Enhancements

1. **Multi-language Support**: i18n for labels
2. **Version Control**: Track label versions
3. **Bulk Operations**: Update multiple labels at once
4. **Advanced Chatbot**: AI-powered NLP with ML
5. **Label Preview**: See changes before applying
6. **Role Management**: Multiple admin levels
7. **API Rate Limiting**: Prevent abuse
8. **Caching Layer**: Redis for performance
9. **Audit Logs**: Comprehensive activity tracking
10. **Export/Import**: Backup and restore labels
