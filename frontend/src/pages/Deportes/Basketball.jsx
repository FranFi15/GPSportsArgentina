import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import './Basketball.css';
import { FaInstagram } from 'react-icons/fa6'; // Import the Instagram icon

const Basketball = () => {
    const [personas, setPersonas] = useState([]);
    const [edades, setEdades] = useState({}); // Objeto para almacenar las edades por _id
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroPosicion, setFiltroPosicion] = useState('todos');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { language } = useLanguage();

    const API_BASE_URL = import.meta.env.VITE_API_URL;

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
            alaPivot: 'Ala-Pivot',
            pivot: 'Pivot',
            jugador: 'Jugador',
            entrenador: 'Entrenador',
            tipo: 'Tipo',
            posicion: 'Posición',
            edad: 'Edad',
            instagram: 'Instagram',
            equipo: 'Equipo',
            años: 'años',
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
            alaPivot: 'Power Forward',
            pivot: 'Center',
            jugador: 'Player',
            entrenador: 'Coach',
            tipo: 'Type',
            posicion: 'Position',
            edad: 'Age',
            instagram: 'Instagram',
            equipo: 'Team',
            años: 'years',
        },
    };

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) {
            return '-';
        }
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    useEffect(() => {
        const fetchPersonas = async () => {
            setError('');
            try {
                const responseJugadores = await fetch(`${API_BASE_URL}/api/jugadores`);
                if (!responseJugadores.ok) {
                    throw new Error('Error loading players');
                }
                const jugadoresData = await responseJugadores.json();
                jugadoresData.forEach(jugador => jugador.tipo = 'jugador');

                const responseEntrenadores = await fetch(`${API_BASE_URL}/api/entrenadores`);
                if (!responseEntrenadores.ok) {
                    throw new Error('Error loading coaches');
                }
                const entrenadoresData = await responseEntrenadores.json();
                entrenadoresData.forEach(entrenador => entrenador.tipo = 'entrenador');

                const combined = [...jugadoresData, ...entrenadoresData];
                combined.sort((a, b) => {
                    const nameA = `${a.nombre} ${a.apellido}`.toLowerCase();
                    const nameB = `${b.nombre} ${b.apellido}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                setPersonas(combined);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            }
        };

        fetchPersonas();
    }, []);

    useEffect(() => {
        const nuevasEdades = {};
        personas.forEach(persona => {
            nuevasEdades[persona._id] = calcularEdad(persona.fechaNacimiento);
        });
        setEdades(nuevasEdades);

        const intervalId = setInterval(() => {
            const nuevasEdadesInterval = {};
            personas.forEach(persona => {
                nuevasEdadesInterval[persona._id] = calcularEdad(persona.fechaNacimiento);
            });
            setEdades(nuevasEdadesInterval);
        }, 1000 * 60 * 60 * 24); // Actualizar cada 24 horas

        return () => clearInterval(intervalId); // Limpiar el intervalo
    }, [personas]); // Dependencia de 'personas' para recalcular al cambiar la lista

    const formatName = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
                            <option value="ala-pivot">{textos[language].alaPivot}</option>
                            <option value="pivot">{textos[language].pivot}</option>
                        </select>
                    </>
                )}
            </div>

            <ul className="basketball-person-list">
                <li className="basketball-person-header">
                    <span className="person-name-header">{textos[language].filterName}</span>
                    <span className="person-team-header">{textos[language].equipo}</span>
                    <span className="person-age-header">{textos[language].edad}</span>
                    <span className="person-instagram-header">{textos[language].instagram}</span>
                </li>
                {filteredPersonas.map(persona => (
                    <li key={persona._id} className="basketball-person-item">
                        <span className="basketball-person-name">{formatName(persona.nombre)} {formatName(persona.apellido)}</span>
                        <span className="basketball-person-team">{persona.equipo}</span>
                        <span className="basketball-person-age">{edades[persona._id] + ' ' + textos[language].años || '-'}</span>
                        <span className="basketball-person-instagram">
                            {persona.inst ? (
                                <a href={`${persona.inst}`} target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="instagram-icon" />
                                </a>
                            ) : (
                                '-'
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Basketball;