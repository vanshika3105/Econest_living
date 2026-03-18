# EcoNest Living Backend

Express.js backend API for the EcoNest Living project.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/      # Custom middleware
│   └── server.js        # Main server file
├── package.json
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/econest-living
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running locally or provide a remote MongoDB URI.

### 4. Run the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Next Steps

1. **Add Authentication**: Implement JWT token-based authentication
2. **Add Password Hashing**: Use `bcrypt` for password encryption
3. **Add Validation**: Implement input validation middleware
4. **Add Error Handling**: Create custom error handling utilities
5. **Add Tests**: Setup Jest for unit and integration tests
6. **Add Database Models**: Create additional models as needed
7. **Connect Frontend**: Update frontend to call these API endpoints

## Notes

- Passwords are currently stored as plain text (for development only). Use `bcrypt` in production.
- CORS is configured to accept requests from `http://localhost:5173` (Vite default)
- Uses ES6 modules (`"type": "module"` in package.json)
