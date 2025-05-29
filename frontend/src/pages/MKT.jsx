// src/components/MarketingEventos/MarketingEventos.jsx

import React, { useEffect, useRef, useState } from 'react';
import useLanguage from '../hooks/useLanguage'; // Assuming you still need language context
import Gallery from '../components/Gallery'; // Assuming Gallery is used here
import "./MKT.css"; // Create this CSS file for styling
import manGil from '../assets/MKT/gillettemanu.jpg';
import luchagat from '../assets/MKT/gatelucha.jpg';
import paretocol from '../assets/MKT/paretocolchon.jpg';
import img1 from '../assets/MKT/IMG_2450.png';
import img2 from '../assets/MKT/IMG_2453.png';
import img3 from '../assets/MKT/IMG_2454.png'

const MarketingEventos = () => {
    const { language } = useLanguage();
    const mktEventRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const textos = {
        es: {
            mktEventTitulo: 'Marketing',
            mktEventContenido: 'En GP SPORTS trabajamos para que la imagen de cada deportista fuera de la cancha sea tan valiosa como sus logros dentro de ella.\nOfrecemos un servicio integral de desarrollo de marca personal, orientado a maximizar el atractivo frente a patrocinadores, medios y audiencias.\nAnalizamos en profundidad el perfil, la historia y los objetivos de cada atleta, para diseñar una estrategia de posicionamiento a medida que potencie su visibilidad y genere nuevas fuentes de ingresos.\nIdentificamos las marcas más afines a sus valores, gestionamos vínculos comerciales estratégicos, potenciamos su presencia en medios y optimizamos el uso de redes sociales para fortalecer la conexión con sus seguidores.\nEn GP SPORTS, el rendimiento deportivo se convierte en una plataforma de crecimiento económico, impacto cultural y consolidación de imagen.',
        },
        en: {
            mktEventTitulo: 'Marketing',
            mktEventContenido: 'At GP SPORTS, we work to ensure that the image of each athlete off the field is as valuable as their achievements on it.\nWe offer a comprehensive personal brand development service, aimed at maximizing appeal to sponsors, media, and audiences.\nWe deeply analyze the profile, history, and goals of each athlete to design a tailored positioning strategy that enhances their visibility and generates new income streams.\nWe identify brands that align with their values, manage strategic commercial links, boost their media presence, and optimize social media use to strengthen their connection with followers.\nAt GP SPORTS, sports performance becomes a platform for economic growth, cultural impact, and image consolidation.',
        }
    };

    const galleryItems = [
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Xtae7OBUKGg' },
        { type: 'image', src: luchagat, caption: 'Lucha Aymar' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Rl2YjjTH1pE' },
        { type: 'image', src: img1, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/2allLNcNMCo' },
        { type: 'image', src: img2, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/IgIeKtkECek' },
        { type: 'image', src: manGil, caption: 'Manu Ginóbili' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/Q89QZlTl-IA'},
        { type: 'image', src: img3, },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/mp0SHWGWYEg' },
        { type: 'video', source: 'youtube', videoId: 'https://www.youtube.com/embed/OtyiNEiETno' },
        
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), 50);
                }
            });
        }, {
            threshold: 0.1
        });

        if (mktEventRef.current) observer.observe(mktEventRef.current);

        return () => observer.disconnect();
    }, []);

    const currentText = textos[language];

    // Para manejar los saltos de línea en el contenido del párrafo
    const formattedContent = currentText.mktEventContenido.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div ref={mktEventRef} className={`marketing-eventos ${isVisible ? 'fade-in-bottom' : ''}`}>
            <h2>{currentText.mktEventTitulo}</h2>
            <p className='marketing-eventos-content'>{formattedContent}</p>
            <Gallery items={galleryItems} />
        </div>
    );
};

export default MarketingEventos;