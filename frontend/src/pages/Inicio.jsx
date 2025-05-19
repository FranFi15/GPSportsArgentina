import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import "./Inicio.css";
import SocialButtons from '../components/SocialButtons';

const Inicio = () => {
    const { language } = useLanguage();
    const bienvenidaRef = useRef(null);
    const lineasRef = useRef([]);
    const descriptionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [lineasVisible, setLineasVisible] = useState([]);
    const [descriptionVisible, setDescriptionVisible] = useState(false);

    const textos = {
        es: {
            linea1b: "#TeamGPSports",
            linea2: "UN GRUPO APASIONADO DE PROFESIONALES",
            linea3: "COMPROMETIDOS CON LA EXCELENCIA EN",
            linea4: "REPRESENTACIÓN DEPORTIVA",
            description:'El #TeamGPSports está formado por jugadores, entrenadores y deportistas de distintas disciplinas, unidos por una misma filosofía: compromiso, dedicación, trabajo en equipo y pasión por lo que hacen. Desde jóvenes promesas hasta referentes consagrados, acompañamos a cada integrante en su camino, brindando un respaldo cercano y profesional en cada etapa de su carrera. Nuestro equipo no se define solo por lo que logra dentro de la cancha, sino por los valores que representa fuera de ella.',
        },
        en: {
            linea1b: "#TeamGPSports",
            linea2: "A PASSIONATE GROUP OF PROFESSIONALS",
            linea3: "COMMITTED TO EXCELLENCE IN",
            linea4: "SPORTS REPRESENTATION",
            description:'The #TeamGPSports is made of players, coaches, and athletes from different disciplines, united by a common philosophy: commitment, dedication, teamwork, and passion for what they do. From young talents to established stars, we support each member on their journey, providing close and professional backing at every stage of their career. Our team is defined not only by what they achieve on the field but also by the values they represent off it.',
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
                    setTimeout(() => setDescriptionVisible(true), 1200 + lineasRef.current.length * 300); // Fade in de la descripción después de las líneas
                    observer.unobserve(entry.target); // Deja de observar una vez que es visible
                }
            });
        }, {
            threshold: 0.5 // Ajusta según sea necesario para cuando se considera visible
        });

        if (bienvenidaRef.current) {
            observer.observe(bienvenidaRef.current);
        }
    }, [language]); // Dependencia del idioma para recargar las animaciones si cambia

    useEffect(() => {
        // Asegura que lineasVisible tenga la misma longitud que los textos y se inicialice en false
        setLineasVisible(Array(Object.keys(textos[language]).length).fill(false));
        setDescriptionVisible(false); // Reinicia la visibilidad de la descripción al cambiar el idioma
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
            <div ref={descriptionRef} className={`description ${descriptionVisible ? 'fade-in' : ''}`}>
                <p>{textos[language].description}</p>
            </div>
        </div>
    );
};

export default Inicio;