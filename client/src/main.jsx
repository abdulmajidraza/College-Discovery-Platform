import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CollegesPage from './pages/CollegesPage'
import CollegeDetailPage from './pages/CollegeDetailPage'
import ComparePage from './pages/ComparePage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { AuthProvider } from './context/AuthContext'
import { SavedProvider } from './context/SavedContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedProvider>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<CollegesPage />} />
              <Route path="/colleges/:id" element={<CollegeDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </SavedProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
