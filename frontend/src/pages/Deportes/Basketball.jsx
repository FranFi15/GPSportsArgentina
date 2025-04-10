// src/components/Admin/Basketball.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import './Basketball.css';
import { FaInstagram } from 'react-icons/fa6'; // Import the Instagram icon

const Basketball = () => {
  const [personas, setPersonas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPosicion, setFiltroPosicion] = useState('todos');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const textos = {
    es: {
      title: 'Nuestro Clientes',
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
      edad: 'Edad', // Nuevo texto para la columna Edad
      instagram: 'Instagram',
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
      edad: 'Age', // Nuevo texto para la columna Edad
      instagram: 'Instagram',
    },
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      setError('');
      try {
        const responseJugadores = await fetch('/api/jugadores');
        if (!responseJugadores.ok) {
          throw new Error('Error loading players');
        }
        const jugadoresData = await responseJugadores.json();
        jugadoresData.forEach(jugador => jugador.tipo = 'jugador');

        const responseEntrenadores = await fetch('/api/entrenadores');
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
        setError(err.message);
      }
    };

    fetchPersonas();
  }, []);

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
          <span className="person-type-header">{textos[language].tipo}</span>
          <span className="person-position-header">{textos[language].posicion}</span>
          <span className="person-age-header">{textos[language].edad}</span> {/* Nueva columna Edad */}
          <span className="person-instagram-header">{textos[language].instagram}</span>
        </li>
        {filteredPersonas.map(persona => (
          <li key={persona._id} className="basketball-person-item">
            <span className="basketball-person-name">{formatName(persona.nombre)} {formatName(persona.apellido)}</span>
            <span className="basketball-person-type">{textos[language][persona.tipo] || persona.tipo}</span>
            <span className="basketball-person-position">{textos[language][persona.posicion] || persona.posicion}</span>
            <span className="basketball-person-age">{persona.edad}</span> {/* Mostrar la edad directamente */}
            <span className="basketball-person-instagram">
              {persona.inst ? (
                <a href={`https://www.instagram.com/${persona.inst}`} target="_blank" rel="noopener noreferrer">
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