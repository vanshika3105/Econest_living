# Firebase Authentication Setup Guide

## ✅ What's Been Set Up

Your project now has complete Firebase authentication integrated with:
- Frontend: React components for Login & Register
- Backend: Firebase token verification
- Auto token injection in API calls
- User context management

## 🔐 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"** or select existing project
3. Enter project name (e.g., "EcoNest Living")
4. Click **"Create Project"**

### 1.2 Enable Authentication
1. Go to **Authentication** in the left menu
2. Click **"Get Started"**
3. Select **"Email/Password"** as authentication method
4. Enable it

## 📋 Step 2: Get Firebase Credentials

### 2.1 Frontend Credentials
1. In Firebase Console, click the **gear icon** (Settings)
2. Go to **"Project Settings"**
3. Scroll to **"Your apps"** section
4. If no app exists, click **"Add app"** and select **Web**
5. Copy the config object:

```javascript
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcd1234"
}
```

### 2.2 Update Frontend `.env.local`

File: `c:\Users\Lenovo\econest-living\.env.local`

Replace with your actual Firebase credentials:

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234
```

### 2.3 Backend Service Account (Optional but Recommended)

To verify Firebase tokens on the backend:

1. In Firebase Console **Project Settings** > **Service Accounts**
2. Click **"Generate New Private Key"**
3. This downloads a JSON file
4. Copy the entire JSON content
5. In backend `.env`, add:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

Or set the path to the file:
```env
FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/service-account-key.json
```

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.js                 # Firebase initialization
├── context/
│   └── AuthContext.jsx             # Auth state management
├── services/
│   └── firebase-api.js             # API calls with token
├── pages/
│   ├── Login.jsx                   # Login component
│   └── Register.jsx                # Register component
└── App.jsx                         # Main app (needs routing)

backend/
├── src/
│   ├── config/
│   │   └── firebase-admin.js       # Firebase Admin SDK
│   ├── routes/
│   │   └── firebase-auth.routes.js # Token verification
│   └── server.js                   # Updated with Firebase routes
└── .env                            # Backend configuration
```

## 🎯 Step 3: Update Your App Component

Update `src/App.jsx` to include AuthProvider and routing:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import YourMainApp from './App'; // Your current app

export default function AppWithAuth() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<YourMainApp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

You'll need to install react-router-dom:
```bash
npm install react-router-dom
```

## 💻 Step 4: Use Auth in Components

### Check if User is Logged In
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Logout User
```jsx
import { useAuth } from '../context/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Make Authenticated API Call
```jsx
import { userAPI } from '../services/firebase-api';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      userAPI.getUser(user.id)
        .then(res => setUserData(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return <div>{/* Display user data */}</div>;
}
```

## 🧪 Step 5: Test

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Test Registration
1. Go to http://localhost:5173/register
2. Fill in the form with:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: Password123
   - Confirm Password: Password123
3. Click "Sign Up"
4. Check Firebase Console > Authentication > Users tab to verify

### Test Login
1. Go to http://localhost:5173/login
2. Enter email and password from registration
3. Click "Sign In"
4. Should redirect to home page as authenticated user

### Verify Backend Token
```bash
curl -X POST http://localhost:5000/api/firebase/auth/verify \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📱 Features Implemented

✅ User Registration with email/password
✅ User Login
✅ Logout functionality
✅ Automatic token management
✅ Protected API routes (if token verification enabled)
✅ User context for global auth state
✅ Error handling
✅ Loading states
✅ Auto token injection in API calls

## 🔒 Security Best Practices

1. **Never commit credentials** - Keep `.env.local` in `.gitignore`
2. **Use environment variables** - Don't hardcode Firebase config
3. **Validate on backend** - Always verify tokens server-side
4. **HTTPS only in production** - Firebase requires HTTPS
5. **Enable security rules** - Configure Firestore/Realtime rules
6. **Rotate service accounts** - Regularly update backend credentials

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth API](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [React Router Documentation](https://reactrouter.com/)

## ❓ Troubleshooting

### "Firebase configuration is invalid"
- Check if all environment variables are set correctly
- Verify Firebase credentials in `.env.local`
- Restart the development server after changing `.env.local`

### "Can't connect to backend"
- Ensure backend is running on port 5000
- Check if `VITE_API_URL` is correct in `.env.local`
- Check browser console for CORS errors

### "Token verification failed"
- Verify Firebase Admin SDK is initialized with service account
- Check if `FIREBASE_SERVICE_ACCOUNT_KEY` is set in backend `.env`
- Ensure Firebase project ID matches in all configs

### "User session persists after logout"
- Check if Firebase SDK is properly initialized
- Verify `onAuthStateChanged` listener is working
- Clear browser cache and local storage

## 🎉 Next Steps

1. Style the Login/Register pages to match your design
2. Add forgot password functionality
3. Implement user profile page
4. Add email verification
5. Implement social login (Google, GitHub)
6. Add user roles and permissions
7. Create protected routes component
