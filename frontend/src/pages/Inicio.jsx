import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';

const Inicio = () => {
    const { language } = useLanguage();
    const bienvenidaRef = useRef(null);
    const lineasRef = useRef([]);
    const [isVisible, setIsVisible] = useState(false);
    const [lineasVisible, setLineasVisible] = useState([]);

    const textos = {
        es: {
            linea1b: "TEAMGPSPORTS",
            linea2: "UN GRUPO APASIONADO DE PROFESIONALES",
            linea3: "COMPROMETIDOS CON LA EXCELENCIA EN",
            linea4: "REPRESENTACIÓN DEPORTIVA",
        },
        en: {
            linea1b: "TEAMGPSPORTS",
            linea2: "A PASSIONATE GROUP OF PROFESSIONALS",
            linea3: "COMMITTED TO EXCELLENCE IN",
            linea4: "SPORTS REPRESENTATION",
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), 500); // Fade in del fondo
                    lineasRef.current.forEach((linea, index) => {
                        setTimeout(() => {
                            setLineasVisible(prev => {
                                const newState = [...prev];
                                newState[index] = true;
                                return newState;
                            });
                        }, 800 + index * 300); // Aparición escalonada de las líneas
                    });
                    observer.unobserve(entry.target); // Deja de observar una vez que es visible
                }
            });
        }, {
            threshold: 0.5 // Ajusta según sea necesario para cuando se considera visible
        });

        if (bienvenidaRef.current) {
            observer.observe(bienvenidaRef.current);
        }

        lineasRef.current = lineasRef.current.slice(0, Object.keys(textos[language]).length); // Asegura que el array de refs tenga la longitud correcta

    }, [language]); // Dependencia del idioma para recargar las animaciones si cambia

    useEffect(() => {
        // Asegura que lineasVisible tenga la misma longitud que los textos y se inicialice en false
        setLineasVisible(Array(Object.keys(textos[language]).length).fill(false));
    }, [language]);

    return (
        <div className='inicio'>
            <div ref={bienvenidaRef} className={`bienvenida ${isVisible ? 'fade-in' : ''}`}>
                <p ref={el => lineasRef.current[0] = el} className={`linea-bienvenida linea-titulo ${lineasVisible[0] ? 'slide-up' : ''}`}>
                    <strong className="highlight">{textos[language].linea1b}</strong>
                </p>
                <p ref={el => lineasRef.current[1] = el} className={`linea-bienvenida ${lineasVisible[1] ? 'slide-up' : ''}`}>{textos[language].linea2}</p>
                <p ref={el => lineasRef.current[2] = el} className={`linea-bienvenida ${lineasVisible[2] ? 'slide-up' : ''}`}>{textos[language].linea3}</p>
                <p ref={el => lineasRef.current[3] = el} className={`linea-bienvenida ${lineasVisible[3] ? 'slide-up' : ''}`}>{textos[language].linea4}</p>
                <SocialButtons /> 
            </div>
        </div>
    );
};

export default Inicio;