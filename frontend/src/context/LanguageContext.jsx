import React, { createContext, useState, useContext } from 'react'; // Importa React y hooks necesarios

export const LanguageContext = createContext(); // Crea un nuevo contexto para el idioma

export const LanguageProvider = ({ children }) => { // Provider para el contexto de idioma
    const [language, setLanguage] = useState('es'); // Estado para el idioma actual, valor inicial 'es' (español)

    const toggleLanguage = () => {                  // Función para cambiar el idioma
        setLanguage(prevLanguage => prevLanguage === 'es' ? 'en' : 'es'); // Cambia entre 'es' y 'en'
    };

    return (                                       // Provider del contexto de idioma
        <LanguageContext.Provider value={{ language, toggleLanguage }}> {/* Proporciona el idioma y la función toggleLanguage a los componentes hijos*/}
            {children}                                {/* Renderiza los componentes hijos*/}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {                  // Hook personalizado para consumir el contexto de idioma
    return useContext(LanguageContext);           // Usa useContext para acceder al valor del LanguageContext
};

export default LanguageProvider;