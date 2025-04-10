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

  return (
    <div className="select-person-type-container">
      <h2>¿Qué deseas agregar?</h2>
      <div className="buttons-container">
        <button className="add-jugador-button" onClick={handleAddJugador}>Agregar Jugador</button>
        <button className="add-entrenador-button" onClick={handleAddEntrenador}>Agregar Entrenador</button>
        <button className="cancel-button" onClick={() => navigate('/admin')}>Cancelar</button>
      </div>
    </div>
  );
};

export default SelectPersonType;