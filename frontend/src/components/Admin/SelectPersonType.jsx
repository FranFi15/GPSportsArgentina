// src/components/Admin/SelectPersonType.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SelectPersonType.css'; // Crea este archivo CSS

const SelectPersonType = () => {
  const navigate = useNavigate();

  const handleAddJugador = () => {
    navigate('/admin/agregar/jugador');
  };

  const handleAddEntrenador = () => {
    navigate('/admin/agregar/entrenador');
  };

  // Nueva función para navegar a la gestión de redes sociales
  const handleGoToSocialPosts = () => {
    navigate('/admin/socialposts');
  };

  return (
    <div className="select-person-type-container">
      <h2>¿Qué deseas hacer?</h2> {/* Cambiamos el texto para que sea más general */}
      <div className="buttons-container">
        <button className="add-jugador-button" onClick={handleAddJugador}>Agregar Jugador</button>
        <button className="add-entrenador-button" onClick={handleAddEntrenador}>Agregar Entrenador</button>
        <button className="social-posts-button" onClick={handleGoToSocialPosts}>Gestionar Redes Sociales</button> {/* ¡NUEVO BOTÓN! */}
        <button className="cancel-button" onClick={() => navigate('/admin')}>Volver al Dashboard</button> {/* Cambiamos "Cancelar" por "Volver" */}
      </div>
    </div>
  );
};

export default SelectPersonType;