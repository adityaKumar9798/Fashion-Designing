<<<<<<< HEAD
=======


>>>>>>> 16a9fedb9364f722c67c97e9e49181033af63f64
# Yashvi Studio - E-commerce Platform

A modern, full-stack e-commerce platform for Yashvi Studio, featuring real-time Firebase authentication, database management, and a comprehensive admin dashboard for dress inventory management.

## 🚀 Features

### 🔐 Authentication System
- **Firebase Authentication** with email/password
- **Real-time session management**
- **Role-based access control** (User/Admin)
- **Secure login/logout** functionality
- **Form validation** and error handling

### 👗 Product Management
- **Admin Dashboard** for dress management
- **Add/Edit/Delete** products
- **Real-time updates** using Firebase
- **Image preview** and validation
- **Category and size management**
- **Featured products** system

### 🛒 E-commerce Features
- **Shopping cart** functionality
- **Order management** system
- **Real-time order tracking**
- **Customer management**
- **Contact form** with message handling

### 📱 User Experience
- **Responsive design** for all devices
- **Modern UI** with Tailwind CSS
- **Smooth animations** with Framer Motion
- **Real-time notifications**
- **Admin panel** with comprehensive analytics

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project (for production deployment)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/adityaKumar9798/Fashion-Designing.git
cd Fashion-Designing
npm install
```

### 2. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to Authentication → Sign-in method
   - Enable "Email/Password" provider
   - Save settings

3. **Set up Realtime Database**
   - Go to Realtime Database → Create Database
   - Choose "Start in test mode" (for development)
   - Select a location and create

4. **Get Firebase Configuration**
   - Go to Project Settings → General → Your apps
   - Copy the Firebase configuration object

### 3. Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local`** with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔑 Default Admin Account

The first user to sign up with the email `admin@yashvi.com` will automatically receive admin privileges.

## 📁 Project Structure

```
Fashion-Designing/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminOrders.tsx
│   │   └── AdminMessages.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── ...
├── firebase.ts         # Firebase service exports
├── firebase-config.ts  # Firebase configuration
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main app component
├── .env.example       # Environment template
└── README.md
```

## 🎯 Admin Features

### Product Management
- **Add new dresses** with images, prices, and descriptions
- **Edit existing products** with real-time updates
- **Delete products** with confirmation
- **Manage categories** (Gowns, Occasion, Casual, etc.)
- **Size management** (XS, S, M, L, XL, XXL)
- **Featured products** toggle

### Order Management
- **View all orders** with status tracking
- **Update order status** (Processing, Shipped, Delivered, Cancelled)
- **Real-time order updates**

### Customer Management
- **View customer inquiries** from contact form
- **User management** and analytics

## 🔐 Authentication Flow

### User Registration
1. User fills signup form with name, email, password
2. Firebase creates user account
3. User profile stored in Realtime Database
4. Automatic login and redirect

### User Login
1. User enters email and password
2. Firebase validates credentials
3. Real-time session management
4. Role-based redirect (admin → dashboard, user → home)

### Session Management
- **Persistent sessions** across browser refreshes
- **Automatic logout** on token expiration
- **Real-time auth state** updates

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Firebase Hosting Deployment

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**:
   ```bash
   firebase init hosting
   ```

4. **Deploy**:
   ```bash
   firebase deploy
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

All Firebase configuration is handled through environment variables for security. Never commit your actual Firebase credentials to version control.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary to Yashvi Studio.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for Yashvi Studio**
