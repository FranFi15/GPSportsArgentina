import React from 'react'; // Importa React
import useLanguage from '../../hooks/useLanguage'; // Importa el hook personalizado useLanguage para el contexto de idioma

const Basketball = () => { // Componente funcional Basketball (Página de Basketball dentro de Deportes)
    const { language } = useLanguage(); // Obtiene el idioma actual del contexto de idioma

    // Textos para la página de Basketball, se traducen según el idioma seleccionado
    const textos = {
        es: {
            titulo: 'Basketball',
            contenido: 'Bienvenido a la sección de Basketball de GP SPORT.'
        },
        en: {
            titulo: 'Basketball',
            contenido: 'Welcome to the Basketball section of GP SPORT.'
        }
    };

    return (                                       // Renderizado de la página de Basketball
        <div className="container">
            <h1>{textos[language].titulo}</h1>     {/* Título de la página (traducido) */}
            <p>{textos[language].contenido}</p>   {/* Contenido de la página (traducido) */}
        </div>
    );
};

export default Basketball; // Exporta el componente Basketball