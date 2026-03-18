# Frontend-Backend Integration Guide

## ✅ Setup Complete

Your frontend and backend are now integrated!

## 📁 Files Created

- `src/services/api.js` - API client with axios
- `.env.local` - Environment configuration

## 🚀 How to Use in Your Components

### Example 1: Register a User

```jsx
import { authAPI } from '../services/api';
import { useState } from 'react';

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token); // if backend returns token
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* form fields */}
      <button disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### Example 2: Fetch Users

```jsx
import { userAPI } from '../services/api';
import { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Login

```jsx
import { authAPI } from '../services/api';

async function handleLogin(email, password) {
  try {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
}
```

## 🔗 Available API Functions

### Authentication
- `authAPI.register(data)` - Register new user
- `authAPI.login(data)` - Login user

### Users
- `userAPI.getAllUsers()` - Get all users
- `userAPI.getUser(id)` - Get user by ID
- `userAPI.updateUser(id, data)` - Update user
- `userAPI.deleteUser(id)` - Delete user

### Products (for future use)
- `productAPI.getAllProducts()`
- `productAPI.getProduct(id)`
- `productAPI.createProduct(data)`
- `productAPI.updateProduct(id, data)`
- `productAPI.deleteProduct(id)`

### Health Check
- `checkBackendHealth()` - Verify backend is running

## ⚙️ Configuration

The API URL is configured in `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

Change this to your backend URL if deploying.

## 🛡️ Auto Token Management

The API client automatically:
- Adds authorization token to all requests (if stored in localStorage)
- Removes token and redirects to login on 401 Unauthorized
- Handles CORS for local development

## 📋 Starting Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Both will run simultaneously:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## ✨ Next Steps

1. Add user authentication to your UI
2. Replace hardcoded product data with API calls
3. Implement protected routes for authenticated users
4. Add error handling and loading states
5. Test API endpoints with Postman or cURL

## 🧪 Test Backend with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Get all users
curl http://localhost:5000/api/users
```
