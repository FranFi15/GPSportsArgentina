import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import './Basketball.css';
import { FaInstagram } from 'react-icons/fa6'; // Import the Instagram icon

const Basketball = () => {
    const [personas, setPersonas] = useState([]);
    // Eliminamos el estado de edades, ya no se necesita
    // const [edades, setEdades] = useState({});
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroPosicion, setFiltroPosicion] = useState('todos');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { language } = useLanguage();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const textos = {
        es: {
            title: 'Nuestros Clientes',
            filterName: 'Nombre y Apellido',
            all: 'Todos',
            players: 'Jugadores',
            coaches: 'Entrenadores',
            allPositions: 'Todas las posiciones',
            base: 'Base',
            escolta: 'Escolta',
            alero: 'Alero',
            'ala-pivot': 'Ala-Pívot', // Corregido a "Ala-Pívot" con tilde y guion
            pivot: 'Pívot',      // Corregido a "Pívot" con tilde
            jugador: 'Jugador',
            entrenador: 'Entrenador',
            tipo: 'Tipo',
            posicion: 'Posición', 
            instagram: 'Instagram',
            equipo: 'Equipo',
            loading: 'Cargando datos...',
            noPosition: 'Entrenador', // Nuevo texto para entrenadores sin posición
        },
        en: {
            title: 'Our Clients',
            filterName: 'Name and Surname',
            all: 'All',
            players: 'Players',
            coaches: 'Coaches',
            allPositions: 'All positions',
            base: 'Point Guard',
            escolta: 'Shooting Guard',
            alero: 'Small Forward',
            'ala-pivot': 'Power Forward',
            pivot: 'Center',
            jugador: 'Player',
            entrenador: 'Coach',
            tipo: 'Type',
            posicion: 'Position', 
            instagram: 'Instagram',
            equipo: 'Team',
            loading: 'Loading data...',
            noPosition: 'Coach', 
        },
    };

    // Eliminamos la función calcularEdad
    // const calcularEdad = (fechaNacimiento) => {
    //     if (!fechaNacimiento) {
    //         return '-';
    //     }
    //     const hoy = new Date();
    //     const nacimiento = new Date(fechaNacimiento);
    //     let edad = hoy.getFullYear() - nacimiento.getFullYear();
    //     const mes = hoy.getMonth() - nacimiento.getMonth();
    //     if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    //         edad--;
    //     }
    //     return edad;
    // };

    useEffect(() => {
        const fetchPersonas = async () => {
            setError('');
            setIsLoading(true);
            try {
                const responseJugadores = await fetch(`${API_BASE_URL}/api/jugadores`);
                if (!responseJugadores.ok) {
                    throw new Error('Error loading players');
                }
                let jugadoresData = await responseJugadores.json();
                jugadoresData = jugadoresData.map(jugador => {
                    jugador.tipo = 'jugador';
                    return jugador;
                });

                const responseEntrenadores = await fetch(`${API_BASE_URL}/api/entrenadores`);
                if (!responseEntrenadores.ok) {
                    throw new Error('Error loading coaches');
                }
                let entrenadoresData = await responseEntrenadores.json();
                entrenadoresData = entrenadoresData.map(entrenador => {
                    entrenador.tipo = 'entrenador';
                    return entrenador;
                });

                const combined = [...jugadoresData, ...entrenadoresData];
                // Ordenar por el campo 'order' 
                combined.sort((a, b) => a.order - b.order);
                setPersonas(combined);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersonas();
    }, [API_BASE_URL]);

    // Eliminamos el useEffect relacionado con el cálculo y actualización de edades
    // useEffect(() => {
    //     const nuevasEdades = {};
    //     personas.forEach(persona => {
    //         nuevasEdades[persona._id] = calcularEdad(persona.fechaNacimiento);
    //     });
    //     setEdades(nuevasEdades);

    //     const intervalId = setInterval(() => {
    //         const nuevasEdadesInterval = {};
    //         personas.forEach(persona => {
    //             nuevasEdadesInterval[persona._id] = calcularEdad(persona.fechaNacimiento);
    //         });
    //         setEdades(nuevasEdadesInterval);
    //     }, 1000 * 60 * 60 * 24);

    //     return () => clearInterval(intervalId);
    // }, [personas]);

    const formatName = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Función auxiliar para traducir la posición
    const translatePosition = (positionKey) => {
        if (!positionKey || positionKey === 'N/A') return textos[language].noPosition;
        return textos[language][positionKey] || positionKey;
    };


    const filteredPersonas = personas.filter(persona => {
        const nombreCompleto = `${persona.nombre} ${persona.apellido}`.toLowerCase();
        const filtroLower = filtroNombre.toLowerCase();
        const nombreMatch = nombreCompleto.includes(filtroLower);
        const tipoMatch = filtroTipo === 'todos' || persona.tipo === filtroTipo;
        const posicionMatch = filtroTipo === 'jugador' ?
            (filtroPosicion === 'todos' || persona.posicion === filtroPosicion) : true;
        return nombreMatch && tipoMatch && posicionMatch;
    });

    return (
        <div className="basketball-list-container">
            <h2 className="basketball-list-title">{textos[language].title}</h2>
            {error && <p className="basketball-error-message">{error}</p>}

            {isLoading ? (
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p>{textos[language].loading}</p>
                </div>
            ) : (
                <>
                    <div className="basketball-filter-controls">
                        <label htmlFor="filterNombre" className="basketball-filter-label">{textos[language].filterName}:</label>
                        <input
                            type="text"
                            id="filterNombre"
                            className="basketball-filter-input"
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                        />

                        <label htmlFor="filterTipo" className="basketball-filter-label">{textos[language].tipo}:</label>
                        <select
                            id="filterTipo"
                            className="basketball-filter-select"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="todos">{textos[language].all}</option>
                            <option value="jugador">{textos[language].players}</option>
                            <option value="entrenador">{textos[language].coaches}</option>
                        </select>

                        {filtroTipo === 'jugador' && (
                            <>
                                <label htmlFor="filterPosicion" className="basketball-filter-label">{textos[language].posicion}:</label>
                                <select
                                    id="filterPosicion"
                                    className="basketball-filter-select"
                                    value={filtroPosicion}
                                    onChange={(e) => setFiltroPosicion(e.target.value)}
                                >
                                    <option value="todos">{textos[language].allPositions}</option>
                                    <option value="base">{textos[language].base}</option>
                                    <option value="escolta">{textos[language].escolta}</option>
                                    <option value="alero">{textos[language].alero}</option>
                                    <option value="ala-pivot">{textos[language]['ala-pivot']}</option>
                                    <option value="pivot">{textos[language].pivot}</option>
                                </select>
                            </>
                        )}
                    </div>

                    <ul className="basketball-person-list">
                        <li className="basketball-person-header">
                            <span className="person-image-header"></span> {/* Added header for image */}
                            <span className="person-name-header">{textos[language].filterName}</span>
                            <span className="person-team-header">{textos[language].equipo}</span>
                            <span className="person-position-header">{textos[language].posicion}</span> {/* CAMBIO AQUÍ: Encabezado de Posición */}
                            <span className="person-instagram-header">{textos[language].instagram}</span>
                        </li>
                        {filteredPersonas.map(persona => (
                            <li key={persona._id} className="basketball-person-item">
                                <span className="basketball-person-image">
                                    {persona.googleDriveLink && (
                                        <img
                                            src={persona.googleDriveLink}
                                            alt={`${persona.nombre} ${persona.apellido}`}
                                            className="person-thumbnail"
                                        />
                                    )}
                                </span>
                                <span className="basketball-person-name">{formatName(persona.nombre)} {formatName(persona.apellido)}</span>
                                <span className="basketball-person-team">{persona.equipo}</span>
                                <span className="basketball-person-position"> {/* CAMBIO AQUÍ: Clase para la columna de posición */}
                                    {persona.tipo === 'jugador'
                                        ? translatePosition(persona.posicion) // Muestra la posición para jugadores
                                        : textos[language].noPosition} {/* Muestra "N/A" o similar para entrenadores */}
                                </span>
                                <span className="basketball-person-instagram">
                                    {persona.inst ? (
                                        <a href={persona.inst.startsWith('http') ? persona.inst : `https://www.instagram.com/${persona.inst}`} target="_blank" rel="noopener noreferrer">
                                            <FaInstagram className="instagram-icon" />
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Basketball;