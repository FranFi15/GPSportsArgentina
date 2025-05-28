import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../../assets/fondo2.png'; // Asegúrate de que la ruta a tu imagen de fondo sea correcta

const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // Aunque la navegación la maneje AuthContext, se mantiene por si se necesita localmente
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos al intentar iniciar sesión
    try {
      await login(usuario, contraseña);
      // La navegación a la página principal se realiza en AuthContext si el login es exitoso
    } catch (err) {
      // Captura el error del proceso de login y lo muestra
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cambia el estado para mostrar u ocultar la contraseña
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {/* Muestra mensajes de error si existen */}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Campo de Usuario */}
          <div className="form-group">
            <label htmlFor="usuario">Usuario *</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* Campo de Contraseña con opción de ver/ocultar */}
          <div className="form-group">
            <label htmlFor="contraseña">Contraseña *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'} // Cambia el tipo de input basado en el estado showPassword
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
              <button
                type="button" // Importante: type="button" para evitar que envíe el formulario
                className="password-toggle-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Ocultar' : 'Ver'} {/* Texto del botón según el estado */}
              </button>
            </div>
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;