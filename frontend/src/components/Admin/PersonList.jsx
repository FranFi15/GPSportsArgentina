import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import './PersonList.css'; // Asegúrate de tener estilos para la lista

const PersonList = () => {
  const [personas, setPersonas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPosicion, setFiltroPosicion] = useState('todos');
  const [error, setError] = useState('');
  const { token, logout } = useAuth(); // Usa el hook para acceder al token y la función logout
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      setError('');
      try {
        const responseJugadores = await fetch('/api/jugadores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!responseJugadores.ok) {
          throw new Error('Error al cargar jugadores');
        }
        const jugadoresData = await responseJugadores.json();

        const responseEntrenadores = await fetch('/api/entrenadores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!responseEntrenadores.ok) {
          throw new Error('Error al cargar entrenadores');
        }
        const entrenadoresData = await responseEntrenadores.json();

        setPersonas([...jugadoresData, ...entrenadoresData]);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      fetchPersonas();
    } else {
      navigate('/login'); // Redirige si no hay token
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

  const handleEliminar = async (id, tipo) => {
    if (window.confirm(`¿Seguro que quieres eliminar a ${tipo} con ID ${id}?`)) {
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
    logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige al login
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
            </span>
            <div className="person-actions">
              <button className="edit-button" onClick={() => handleEditar(persona._id, persona.tipo)}>Editar</button>
              <button className="delete-button" onClick={() => handleEliminar(persona._id, persona.tipo)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonList;