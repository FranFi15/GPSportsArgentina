import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PersonList.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Importar de @hello-pangea/dnd

const PersonList = () => {
    const [personas, setPersonas] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroPosicion, setFiltroPosicion] = useState('todos');
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

                // Combinar y ordenar por el campo 'order' que viene de la base de datos
                const combinedPersonas = [...jugadoresData, ...entrenadoresData].sort((a, b) => a.order - b.order);
                setPersonas(combinedPersonas);
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
    }, [token, navigate, API_BASE_URL]);

    // **IMPORTANTE**: Los filtros se aplican sobre el estado `personas` original.
    // El arrastrar y soltar afectará el `personas` original, que luego se filtra.
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
                // Actualiza el estado y luego el orden si es necesario
                const updatedPersonas = personas.filter(p => !(p._id === id && p.tipo === tipo));
                setPersonas(updatedPersonas);
                // Opcional: Re-enviar el orden actualizado al backend después de eliminar
                // Esto es importante si el orden es crítico y la eliminación afecta el orden de los demás.
                // Si el orden es crucial, deberías recalcular y enviar el nuevo orden de 'updatedPersonas'
                // a tu endpoint /api/personas/reorder. Por simplicidad, no lo incluyo aquí,
                // pero tenlo en cuenta para un sistema robusto.
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función para manejar el final del arrastre
    const onDragEnd = async (result) => {
        if (!result.destination) return; // Si no se soltó en un lugar válido
        if (result.destination.index === result.source.index) return; // Si no se movió de posición

        const reorderedPersonas = Array.from(personas); // Trabaja con el estado original de personas
        const [removed] = reorderedPersonas.splice(result.source.index, 1);
        reorderedPersonas.splice(result.destination.index, 0, removed);

        // Actualiza el estado local inmediatamente para una buena UX
        setPersonas(reorderedPersonas);

        // Prepara los datos para enviar al backend
        const updatedOrder = reorderedPersonas.map((p, index) => ({
            id: p._id,
            tipo: p.tipo,
            order: index, // El nuevo índice como su orden
        }));

        try {
            const response = await fetch(`${API_BASE_URL}/api/personas/reorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ order: updatedOrder }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el orden.');
            }
            // console.log('Orden actualizado en el backend con éxito');
            // No necesitas hacer nada más si la actualización fue exitosa,
            // ya que el estado local `personas` ya está actualizado.
        } catch (err) {
            console.error("Error al guardar el nuevo orden:", err);
            setError("No se pudo guardar el nuevo orden. Por favor, inténtalo de nuevo.");
            // Opcional: Revertir el estado si el guardado falla
            // setPersonas(personasSnapshot); // Si hubieras guardado el estado antes del arrastre
        }
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

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="person-list-droppable">
                    {(provided) => (
                        <ul className="person-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {filteredPersonas.map((persona, index) => (
                                <Draggable key={persona._id} draggableId={`${persona.tipo}-${persona._id}`} index={index}>
                                    {(provided) => (
                                        <li
                                            className="person-item"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <span className="person-image">
                                                {persona.googleDriveLink && (
                                                    <img
                                                        src={persona.googleDriveLink}
                                                        alt={`${persona.nombre} ${persona.apellido}`}
                                                        className="person-thumbnail"
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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default PersonList;