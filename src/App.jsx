import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import DataAnalysis from './pages/DataAnalysis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col md:ml-64">
      <Navbar />
      <main className="flex-1 p-8 overflow-y-auto mt-16">
        {children}
      </main>
    </div>
    <ToastContainer theme="dark" position="bottom-right" />
  </div>
);

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          isAuthenticated ? (
            <MainLayout><Dashboard /></MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/projects" element={
          isAuthenticated ? (
            <MainLayout><Projects /></MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/tasks" element={
          isAuthenticated ? (
            <MainLayout><Tasks /></MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/analysis" element={
          isAuthenticated ? (
            <MainLayout><DataAnalysis /></MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
