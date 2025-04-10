import React from 'react';    // Importa React
import useLanguage from '../hooks/useLanguage'; // Importa el hook personalizado useLanguage para el contexto de idioma

const MarketingyEventos = () => { // Componente funcional MarketingyEventos (Página 'Marketing y Eventos')
    const { language } = useLanguage(); // Obtiene el idioma actual del contexto de idioma

    // Textos para la página de 'Marketing y Eventos', se traducen según el idioma seleccionado
    const textos = {
        es: {
            titulo: 'Marketing y Eventos',
            contenido: 'Descubre nuestros servicios de marketing deportivo y organización de eventos.'
        },
        en: {
            titulo: 'Marketing and Events',
            contenido: 'Discover our sports marketing services and event organization.'
        }
    };

    return (                                       // Renderizado de la página 'Marketing y Eventos'
        <div className="container">
            <h1>{textos[language].titulo}</h1>     {/* Título de la página (traducido) */}
            <p>{textos[language].contenido}</p>   {/* Contenido de la página (traducido) */}
        </div>
    );
};

export default MarketingyEventos; // Exporta el componente MarketingyEventos