// src/components/Admin/PersonList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PersonList.css';
// Import de iconos (prueba con estos primero)
// Si los anteriores no funcionan, prueba con estos:
import { FaEdit, FaTrash } from 'react-icons/fa';

const PersonList = () => {
  const [personas, setPersonas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPosicion, setFiltroPosicion] = useState('todos');
  const [error, setError] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPersonas = async () => {
      setError('');
      try {
        const responseJugadores = await fetch(`${API_BASE_URL}/api/jugadores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!responseJugadores.ok) {
          throw new Error('Error al cargar jugadores');
        }
        const jugadoresData = await responseJugadores.json();
        jugadoresData.forEach(jugador => jugador.tipo = 'jugador');

        const responseEntrenadores = await fetch(`${API_BASE_URL}/api/entrenadores`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!responseEntrenadores.ok) {
          throw new Error('Error al cargar entrenadores');
        }
        const entrenadoresData = await responseEntrenadores.json();
        entrenadoresData.forEach(entrenador => entrenador.tipo = 'entrenador');

        setPersonas([...jugadoresData, ...entrenadoresData]);
      } catch (err) {
        console.error("Fetch error in PersonList:", err);
        setError(err.message);
      }
    };

    if (token) {
      fetchPersonas();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const filteredPersonas = personas.filter(persona => {
    const nombreMatch = persona.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) ||
                        persona.apellido.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoMatch = filtroTipo === 'todos' || persona.tipo === filtroTipo;
    const posicionMatch = filtroTipo === 'jugador' ?
                          (filtroPosicion === 'todos' || persona.posicion === filtroPosicion) : true;
    return nombreMatch && tipoMatch && posicionMatch;
  });

  const handleEditar = (id, tipo) => {
    navigate(`/admin/${tipo}/editar/${id}`);
  };

  const handleEliminar = async (id, tipo, nombre, apellido) => {
    if (window.confirm(`¿Seguro que quieres eliminar a ${tipo} ${nombre} ${apellido}?`)) {
      try {
        const url = tipo === 'jugador' ? `/api/jugadores/${id}` : `/api/entrenadores/${id}`;
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error al eliminar ${tipo}`);
        }
        setPersonas(personas.filter(p => !(p._id === id && p.tipo === tipo)));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="person-list-container">
      <h2 className="person-list-title">Lista de Jugadores y Entrenadores</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="filter-controls">
        <input
          type="text"
          className="filter-input"
          placeholder="Filtrar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <select className="filter-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="jugador">Jugadores</option>
          <option value="entrenador">Entrenadores</option>
        </select>
        {filtroTipo === 'jugador' && (
          <select className="filter-select" value={filtroPosicion} onChange={(e) => setFiltroPosicion(e.target.value)}>
            <option value="todos">Todas las posiciones</option>
            <option value="base">Base</option>
            <option value="escolta">Escolta</option>
            <option value="alero">Alero</option>
            <option value="ala-pivot">Ala-Pivot</option>
            <option value="pivot">Pivot</option>
          </select>
        )}
        <button className="add-new-button" onClick={() => navigate('/admin/agregar')}>Agregar Nuevo</button>
        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <ul className="person-list">
        {filteredPersonas.map(persona => (
          <li key={persona._id} className="person-item">
            <span className="person-info">
              <span className="person-name">{persona.nombre} {persona.apellido}</span>
              <span className="person-type">({persona.tipo})</span>
              {persona.posicion && <span className="person-position"> - {persona.posicion}</span>}
              {persona.fechaNacimiento && <span className="person-instagram"> - Edad: {persona.fechaNacimiento}</span>}
            </span>
            <div className="person-actions">
              <button className="edit-button" onClick={() => handleEditar(persona._id, persona.tipo)}>
                <FaEdit /> {/* Icono de editar */}
              </button>
              <button className="delete-button" onClick={() => handleEliminar(persona._id, persona.tipo, persona.nombre, persona.apellido)}>
                <FaTrash /> {/* Icono de eliminar */}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonList;