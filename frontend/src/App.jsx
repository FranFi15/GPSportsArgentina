// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import LaEmpresa from './pages/LaEmpresa';
import TeamGPSPORTS from './pages/TeamGPSPORTS';
import MKT from './pages/MKT';
import Charlas from './pages/Charlas';
import Basketball from './pages/Deportes/Basketball';
import Contacto from './pages/Contacto';
import LoginPage from './components/Auth/LoginPage';
import PersonList from './components/Admin/PersonList';
import AddEditPerson from './components/Admin/AddEditPerson';
import SelectPersonType from './components/Admin/SelectPersonType'; // Importa el nuevo componente
import { LanguageProvider } from './context/LanguageContext';
import  AuthProvider, { useAuth } from './context/AuthContext';
import AdminSocialPosts from './pages/AdminSocialPosts';
import './App.css';
import Footer from './components/Footer';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, token } = useAuth();

    return !token || !isAuthenticated ? <Navigate to="/login" /> : children;
};


function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/la-empresa" element={<LaEmpresa />} />
            <Route path="/team-gp-sport" element={<TeamGPSPORTS />} />
            <Route path="/mkt-eventos" element={<MKT />} />
            <Route path="/charlas" element={<Charlas />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<PrivateRoute><PersonList /></PrivateRoute>} />
            <Route path="/admin/agregar" element={<PrivateRoute><SelectPersonType /></PrivateRoute>} /> {/* Nueva ruta para la selección de tipo */}
            <Route path="/admin/agregar/:tipo" element={<PrivateRoute><AddEditPerson /></PrivateRoute>} /> {/* Ruta para agregar jugador o entrenador */}
            <Route path="/admin/:tipo/editar/:id" element={<PrivateRoute><AddEditPerson /></PrivateRoute>} />
            <Route path="/admin/socialposts" element={<PrivateRoute><AdminSocialPosts /></PrivateRoute>} />
          </Routes>
          <Footer/>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;