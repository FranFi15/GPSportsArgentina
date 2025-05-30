import React, { useState, useEffect } from 'react';
import useLanguage from '../hooks/useLanguage';
import './Charlas.css';
import Gallery from '../components/Gallery';
import cImage1 from '../assets/Conferencias/1.avif';
import cImage2 from '../assets/Conferencias/2.avif';
import cImage3 from '../assets/Conferencias/3.avif';
import cImage4 from '../assets/Conferencias/4.avif';
import cImage5 from '../assets/Conferencias/5.avif';
import cImage6 from '../assets/Conferencias/6.avif';
import cImage7 from '../assets/Conferencias/7.avif';
import cImage8 from '../assets/Conferencias/8.avif';
import cImage9 from '../assets/Conferencias/9.avif';


const Charlas = () => {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const textos = {
        es: {
            titulo: 'Conferencias',
            contenido: 'En GP Sports creemos que la experiencia compartida inspira, motiva y transforma. Por eso impulsamos y organizamos conferencias y encuentros con deportistas  y referentes del alto rendimiento. A través de estas dinámicas, acercamos historias reales de superación, liderazgo, trabajo en equipo y toma de decisiones, tanto dentro como fuera de la cancha. Son espacios de aprendizaje y conexión pensados para empresas y organizaciones que buscan enriquecer sus equipos desde la mirada del deporte y sus valores. Porque detrás de cada logro, hay un recorrido que merece ser contado.',

        },
        en: {
            titulo: 'Conferences',
            contenido: 'At GP Sports, we believe that shared experience inspires, motivates, and transforms. That\'s why we promote and organize conferences and meetings with athletes and high-performance leaders. Through these dynamics, we share real stories of overcoming challenges, leadership, teamwork, and decision-making, both on and off the field. These are learning and connection spaces designed for companies and organizations seeking to enrich their teams from the perspective of sports and its values. Because behind every achievement, there is a journey that deserves to be told.',

        }
    };

    const galleryItems = [
        { type: 'image', src: cImage9 },
        { type: 'image', src: cImage6 },
        { type: 'image', src: cImage3 },
        { type: 'image', src: cImage4 },
        { type: 'image', src: cImage5 },
        { type: 'image', src: cImage7 },
        { type: 'image', src: cImage1 },
        { type: 'image', src: cImage8 },
        { type: 'image', src: cImage2 },
    ];

    return (
        <div className={`charlas-container ${isVisible ? 'fade-in' : ''}`}>
            <h1 className="charlas-title">{textos[language].titulo}</h1>
            <p className="charlas-content">{textos[language].contenido}</p>

            <section className="charlas-gallery-section">
                <Gallery items={galleryItems} />
            </section>
        </div>
    );
};

export default Charlas;
