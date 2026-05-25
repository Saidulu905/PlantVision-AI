import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

// Import Views
import Home from './pages/Home';
import Shop from './pages/Shop';
import PlantDetails from './pages/PlantDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AiDetect from './pages/AiDetect';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-inter">
            {/* Header Navigation Menu */}
            <Navbar />

            {/* Main Interactive Workspaces */}
            <main className="flex-grow">
              <Routes>
                {/* Public Catalog Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/plants/:id" element={<PlantDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer & Diagnosis Tools */}
                <Route
                  path="/ai-detect"
                  element={
                    <ProtectedRoute>
                      <AiDetect />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Backoffice Operations */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Footer Site Maps */}
            <Footer />

            {/* Floating AI Botanical Assistant Chatbot */}
            <Chatbot />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
