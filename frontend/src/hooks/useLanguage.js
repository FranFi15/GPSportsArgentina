import { useContext } from 'react';        // Importa el hook useContext
import { LanguageContext } from '../context/LanguageContext'; // Importa el contexto de idioma

const useLanguage = () => {                // Define un hook personalizado llamado useLanguage
    return useContext(LanguageContext);     // Utiliza el hook useContext para acceder al LanguageContext
};

export default useLanguage; // Exporta el hook useLanguage para poder usarlo en otros componentes