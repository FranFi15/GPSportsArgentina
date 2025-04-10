import React from 'react';    // Importa React
import useLanguage from '../hooks/useLanguage'; // Importa el hook personalizado useLanguage para el contexto de idioma

const Deportes = () => { // Componente funcional Deportes (Página de Deportes)
    const { language } = useLanguage(); // Obtiene el idioma actual del contexto de idioma

    // Textos para la página de Deportes, se traducen según el idioma seleccionado
    const textos = {
        es: {
            titulo: 'Deportes',
            contenido: 'Página dedicada a la sección de deportes de GP SPORT.'
        },
        en: {
            titulo: 'Sports',
            contenido: 'Page dedicated to the sports section of GP SPORT.'
        }
    };

    return (                                       // Renderizado de la página de Deportes
        <div className="container">
            <h1>{textos[language].titulo}</h1>     {/* Título de la página (traducido) */}
            <p>{textos[language].contenido}</p>   {/* Contenido de la página (traducido) */}
        </div>
    );
};

export default Deportes; // Exporta el componente Deportes