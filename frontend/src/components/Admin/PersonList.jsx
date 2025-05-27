// src/components/Admin/PersonList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PersonList.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PersonList = () => {
    const [personas, setPersonas] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroPosicion, setFiltroPosicion] = useState('todos');
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Default to localhost if not set

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
    }, [token, navigate, API_BASE_URL]); // Added API_BASE_URL to dependencies

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
                // Ensure correct URL for delete based on tipo
                const url = tipo === 'jugador' ? `${API_BASE_URL}/api/jugadores/${id}` : `${API_BASE_URL}/api/entrenadores/${id}`;
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
                <li className="person-item person-list-header"> {/* Added a header class */}
                    <span className="header-image">Imagen</span> {/* Header for image */}
                    <span className="header-name">Nombre Completo</span>
                    <span className="header-type">Tipo</span>
                    <span className="header-position">Posición</span>
                    <span className="header-dob">Fecha Nacimiento</span>
                    <span className="header-drive-link">Drive Link</span> {/* Header for Drive Link */}
                    <span className="header-actions">Acciones</span>
                </li>
                {filteredPersonas.map(persona => (
                    <li key={persona._id} className="person-item">
                        <span className="person-image">
                            {persona.googleDriveLink && (
                                <img
                                    src={persona.googleDriveLink}
                                    alt={`${persona.nombre} ${persona.apellido}`}
                                    className="person-thumbnail" // Add a class for styling
                                />
                            )}
                        </span>
                        <span className="person-name">{persona.nombre} {persona.apellido}</span>
                        <span className="person-type">({persona.tipo})</span>
                        <span className="person-position">
                            {persona.tipo === 'jugador' && persona.posicion ? persona.posicion : '-'}
                        </span>
                        <span className="person-dob">
                            {persona.fechaNacimiento ? new Date(persona.fechaNacimiento).toLocaleDateString() : '-'}
                        </span>
                        <span className="person-drive-link">
                            {persona.googleDriveLink ? (
                                <a href={persona.googleDriveLink} target="_blank" rel="noopener noreferrer">
                                    Ver Imagen
                                </a>
                            ) : (
                                '-'
                            )}
                        </span>
                        <div className="person-actions">
                            <button className="edit-button" onClick={() => handleEditar(persona._id, persona.tipo)}>
                                <FaEdit />
                            </button>
                            <button className="delete-button" onClick={() => handleEliminar(persona._id, persona.tipo, persona.nombre, persona.apellido)}>
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonList;